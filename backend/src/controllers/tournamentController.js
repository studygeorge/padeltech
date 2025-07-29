const { Tournament, TournamentPair, User } = require('../models');
const { Op } = require('sequelize');

// Получение ближайших турниров
const getUpcomingTournaments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tournaments = await Tournament.findAll({
      where: {
        tournament_date: {
          [Op.gte]: today
        },
        status: 'upcoming'
      },
      include: [
        {
          model: TournamentPair,
          as: 'pairs',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'username', 'photo_url']
          }]
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'username']
        }
      ],
      order: [['tournament_date', 'ASC']],
      limit: 5 // Показываем только 5 ближайших турниров
    });

    const formattedTournaments = tournaments.map(tournament => {
      // Подсчитываем занятые места
      const occupiedSlots = tournament.pairs ? tournament.pairs.length : 0;
      const totalSlots = tournament.pairs_count * 2; // 2 игрока на пару
      
      return {
        id: tournament.id,
        name: tournament.name,
        tournamentDate: tournament.tournament_date,
        pairsCount: tournament.pairs_count,
        description: tournament.description,
        status: tournament.status,
        creator: tournament.creator,
        occupiedSlots,
        totalSlots,
        availableSlots: totalSlots - occupiedSlots,
        isFullyBooked: occupiedSlots >= totalSlots,
        participants: tournament.pairs ? tournament.pairs.map(pair => pair.user) : [],
        createdAt: tournament.created_at
      };
    });

    res.json(formattedTournaments);
  } catch (error) {
    console.error('❌ Error getting upcoming tournaments:', error);
    res.status(500).json({ error: 'Ошибка при получении турниров' });
  }
};

// Получение турнира по ID
const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🏆 Getting tournament by ID:', id);

    const tournament = await Tournament.findByPk(id, {
      include: [
        {
          model: TournamentPair,
          as: 'pairs',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'username', 'photo_url']
          }]
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'username']
        }
      ]
    });

    if (!tournament) {
      return res.status(404).json({ error: 'Турнир не найден' });
    }

    // Подсчитываем занятые места
    const occupiedSlots = tournament.pairs ? tournament.pairs.length : 0;
    const totalSlots = tournament.pairs_count * 2;
    
    const formattedTournament = {
      id: tournament.id,
      name: tournament.name,
      tournamentDate: tournament.tournament_date,
      pairsCount: tournament.pairs_count,
      description: tournament.description,
      status: tournament.status,
      creator: tournament.creator,
      occupiedSlots,
      totalSlots,
      availableSlots: totalSlots - occupiedSlots,
      isFullyBooked: occupiedSlots >= totalSlots,
      participants: tournament.pairs ? tournament.pairs.map(pair => pair.user) : [],
      createdAt: tournament.created_at
    };

    console.log('✅ Tournament found:', formattedTournament);
    res.json(formattedTournament);
  } catch (error) {
    console.error('❌ Error getting tournament:', error);
    res.status(500).json({ error: 'Ошибка при получении турнира' });
  }
};

// Регистрация на турнир
const registerForTournament = async (req, res) => {
  try {
    const { id: tournamentId } = req.params; // Исправлено: получаем id из params
    const userId = req.user.id;

    console.log('🎾 User registration attempt:', { tournamentId, userId });

    // Проверяем, существует ли турнир
    const tournament = await Tournament.findByPk(tournamentId, {
      include: [{
        model: TournamentPair,
        as: 'pairs'
      }]
    });

    if (!tournament) {
      return res.status(404).json({ error: 'Турнир не найден' });
    }

    // Проверяем, что турнир еще не начался
    if (tournament.status !== 'upcoming') {
      return res.status(400).json({ error: 'Регистрация на этот турнир закрыта' });
    }

    // Проверяем, что турнир не в прошлом
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(tournament.tournament_date) < today) {
      return res.status(400).json({ error: 'Турнир уже прошел' });
    }

    // Проверяем, не зарегистрирован ли пользователь уже
    const existingRegistration = await TournamentPair.findOne({
      where: {
        tournament_id: tournamentId,
        user_id: userId
      }
    });

    if (existingRegistration) {
      return res.status(400).json({ error: 'Вы уже зарегистрированы на этот турнир' });
    }

    // Проверяем, есть ли свободные места
    const occupiedSlots = tournament.pairs ? tournament.pairs.length : 0;
    const totalSlots = tournament.pairs_count * 2;

    if (occupiedSlots >= totalSlots) {
      return res.status(400).json({ error: 'Нет свободных мест в турнире' });
    }

    // Находим номер пары для нового игрока
    let pairNumber = 1;
    let isLeader = true;

    // Ищем первую пару с одним игроком или создаем новую
    const pairCounts = {};
    tournament.pairs.forEach(pair => {
      pairCounts[pair.pair_number] = (pairCounts[pair.pair_number] || 0) + 1;
    });

    // Ищем пару с одним игроком
    for (let i = 1; i <= tournament.pairs_count; i++) {
      if (!pairCounts[i]) {
        // Пустая пара - становимся лидером
        pairNumber = i;
        isLeader = true;
        break;
      } else if (pairCounts[i] === 1) {
        // Пара с одним игроком - присоединяемся
        pairNumber = i;
        isLeader = false;
        break;
      }
    }

    // Регистрируем пользователя
    await TournamentPair.create({
      tournament_id: tournamentId,
      user_id: userId,
      pair_number: pairNumber,
      is_pair_leader: isLeader
    });

    console.log('✅ User registered successfully:', { 
      tournamentId, 
      userId, 
      pairNumber, 
      isLeader 
    });

    res.json({
      success: true,
      message: 'Вы успешно зарегистрированы на турнир',
      pairNumber: pairNumber,
      isLeader: isLeader
    });
  } catch (error) {
    console.error('❌ Error registering for tournament:', error);
    res.status(500).json({ 
      error: 'Ошибка при регистрации на турнир',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Отмена регистрации на турнир
const unregisterFromTournament = async (req, res) => {
  try {
    const { id: tournamentId } = req.params; // Исправлено: получаем id из params
    const userId = req.user.id;

    console.log('🚫 User unregistration attempt:', { tournamentId, userId });

    // Проверяем, существует ли турнир
    const tournament = await Tournament.findByPk(tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: 'Турнир не найден' });
    }

    // Проверяем, что турнир еще не начался
    if (tournament.status !== 'upcoming') {
      return res.status(400).json({ error: 'Нельзя отменить регистрацию - турнир уже начался' });
    }

    // Находим регистрацию пользователя
    const registration = await TournamentPair.findOne({
      where: {
        tournament_id: tournamentId,
        user_id: userId
      }
    });

    if (!registration) {
      return res.status(400).json({ error: 'Вы не зарегистрированы на этот турнир' });
    }

    // Удаляем регистрацию
    await registration.destroy();

    console.log('✅ User unregistered successfully:', { tournamentId, userId });

    res.json({
      success: true,
      message: 'Регистрация отменена успешно'
    });
  } catch (error) {
    console.error('❌ Error unregistering from tournament:', error);
    res.status(500).json({ 
      error: 'Ошибка при отмене регистрации',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getUpcomingTournaments,
  getTournamentById,
  registerForTournament,
  unregisterFromTournament
};