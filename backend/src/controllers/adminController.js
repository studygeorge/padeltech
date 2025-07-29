const { User, Tournament, TournamentPair } = require('../models');

// Обновление уровня игрока
const updatePlayerLevel = async (req, res) => {
  try {
    const { userId } = req.params;
    const { level } = req.body;

    // Проверяем, что пользователь админ или менеджер
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Только администраторы и менеджеры могут изменять уровень игрока' });
    }

    // Проверяем корректность уровня
    const validLevels = ['A', 'B+', 'B', 'C+', 'C', 'D'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ error: 'Некорректный уровень' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    await user.update({ level });
    
    console.log('✅ Player level updated:', { userId, level });
    
    res.json({ 
      success: true, 
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        level: user.level
      }
    });
  } catch (error) {
    console.error('Ошибка при обновлении уровня игрока:', error);
    res.status(500).json({ error: 'Ошибка при обновлении уровня игрока' });
  }
};

// Создание турнира
const createTournament = async (req, res) => {
  try {
    // Проверяем роль пользователя
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Только администраторы и менеджеры могут создавать турниры' 
      });
    }

    const { name, tournamentDate, tournamentTime, pairsCount, description } = req.body;

    // Валидация входных данных
    if (!name || !tournamentDate || !tournamentTime || !pairsCount) {
      return res.status(400).json({ 
        error: 'Название, дата, время турнира и количество пар обязательны' 
      });
    }

    if (pairsCount < 2) {
      return res.status(400).json({ 
        error: 'Минимальное количество пар - 2' 
      });
    }

    // Создаем дату БЕЗ автоматической конвертации в UTC
    // Используем MySQL формат DATETIME: 'YYYY-MM-DD HH:MM:SS'
    const tournamentDateTimeString = `${tournamentDate} ${tournamentTime}:00`;
    
    console.log('🏆 Creating tournament:', {
      name,
      tournamentDate,
      tournamentTime,
      combinedDateTime: tournamentDateTimeString,
      pairsCount,
      description,
      createdBy: req.user.id
    });

    // Проверяем, что дата не в прошлом
    const tournamentDateObj = new Date(`${tournamentDate}T${tournamentTime}:00`);
    const today = new Date();
    
    if (tournamentDateObj < today) {
      return res.status(400).json({ 
        error: 'Дата турнира не может быть в прошлом' 
      });
    }

    // Создаем турнир, передавая строку напрямую в MySQL
    const tournament = await Tournament.create({
      name: name,
      tournament_date: tournamentDateTimeString, // Передаем как строку в MySQL формате
      pairs_count: pairsCount,
      description: description,
      created_by_id: req.user.id,
      status: 'upcoming'
    });

    console.log('✅ Tournament created successfully:', tournament.id);

    // Получаем полные данные турнира
    const fullTournament = await Tournament.findByPk(tournament.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'username']
        }
      ]
    });

    res.status(201).json({
      success: true,
      tournament: {
        id: fullTournament.id,
        name: fullTournament.name,
        tournamentDate: fullTournament.tournament_date,
        pairsCount: fullTournament.pairs_count,
        description: fullTournament.description,
        status: fullTournament.status,
        creator: fullTournament.creator,
        createdAt: fullTournament.created_at
      }
    });
  } catch (error) {
    console.error('❌ Error creating tournament:', error);
    res.status(500).json({ 
      error: 'Ошибка при создании турнира',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Получение списка турниров
const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.findAll({
      include: [
        {
          model: TournamentPair,
          as: 'pairs',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'username']
          }]
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'username']
        }
      ],
      order: [['tournament_date', 'ASC']]
    });

    const formattedTournaments = tournaments.map(tournament => ({
      id: tournament.id,
      name: tournament.name,
      tournamentDate: tournament.tournament_date,
      pairsCount: tournament.pairs_count,
      description: tournament.description,
      status: tournament.status,
      creator: tournament.creator,
      registeredPairs: tournament.pairs ? tournament.pairs.length : 0,
      createdAt: tournament.created_at
    }));

    res.json(formattedTournaments);
  } catch (error) {
    console.error('❌ Error getting tournaments:', error);
    res.status(500).json({ error: 'Ошибка при получении турниров' });
  }
};

module.exports = {
  updatePlayerLevel,
  createTournament,
  getTournaments
};