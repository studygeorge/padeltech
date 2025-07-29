const { Match, MatchPlayer, MatchScore, User } = require('../models');

// Создание нового матча
const createMatch = async (req, res) => {
  try {
    const { name, courtNumber, maxPoints, players } = req.body;
    const userId = req.user.id; // Получаем из middleware auth

    // Проверяем входные данные
    if (!name || !courtNumber || !maxPoints || !players || players.length !== 4) {
      return res.status(400).json({ 
        error: 'Необходимо указать название, номер корта, максимальное количество очков и 4 игрока' 
      });
    }

    // Создаем матч
    const match = await Match.create({
      name,
      courtNumber,
      maxPoints,
      createdById: userId
    });

    // Добавляем игроков (первые два в команду 1, вторые два в команду 2)
    const matchPlayers = await Promise.all(
      players.map((playerId, index) => 
        MatchPlayer.create({
          matchId: match.id,
          userId: playerId,
          team: index < 2 ? 1 : 2
        })
      )
    );

    // Создаем начальный счет
    await MatchScore.create({
      matchId: match.id,
      team1Score: 0,
      team2Score: 0
    });

    // Получаем полные данные матча
    const fullMatch = await Match.findByPk(match.id, {
      include: [
        {
          model: MatchPlayer,
          as: 'players',
          include: [{
            model: User,
            as: 'player',
            attributes: ['id', 'username', 'firstName', 'lastName', 'photoUrl']
          }]
        },
        {
          model: MatchScore,
          as: 'scores'
        }
      ]
    });

    res.status(201).json(fullMatch);
  } catch (error) {
    console.error('Ошибка при создании матча:', error);
    res.status(500).json({ error: 'Ошибка при создании матча' });
  }
};

// Получение списка матчей
const getMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({
      include: [
        {
          model: MatchPlayer,
          as: 'players',
          include: [{
            model: User,
            as: 'player',
            attributes: ['id', 'username', 'firstName', 'lastName', 'photoUrl']
          }]
        },
        {
          model: MatchScore,
          as: 'scores'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(matches);
  } catch (error) {
    console.error('Ошибка при получении списка матчей:', error);
    res.status(500).json({ error: 'Ошибка при получении списка матчей' });
  }
};

// Обновление счета матча
const updateMatchScore = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { team1Score, team2Score } = req.body;
    const userId = req.user.id;

    // Проверяем, что пользователь участвует в матче
    const matchPlayer = await MatchPlayer.findOne({
      where: { matchId, userId }
    });

    if (!matchPlayer) {
      return res.status(403).json({ error: 'Нет доступа к обновлению счета' });
    }

    // Обновляем счет
    const [score] = await MatchScore.update(
      { team1Score, team2Score },
      { where: { matchId } }
    );

    // Если матч завершен (достигнуто максимальное количество очков)
    const match = await Match.findByPk(matchId);
    if (team1Score >= match.maxPoints || team2Score >= match.maxPoints) {
      await match.update({ status: 'completed' });
      
      // TODO: Обновить рейтинги игроков
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении счета:', error);
    res.status(500).json({ error: 'Ошибка при обновлении счета' });
  }
};

// Отмена матча
const cancelMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;

    const match = await Match.findByPk(matchId);
    
    if (!match) {
      return res.status(404).json({ error: 'Матч не найден' });
    }

    if (match.createdById !== userId) {
      return res.status(403).json({ error: 'Только создатель может отменить матч' });
    }

    await match.update({ status: 'cancelled' });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при отмене матча:', error);
    res.status(500).json({ error: 'Ошибка при отмене матча' });
  }
};

module.exports = {
  createMatch,
  getMatches,
  updateMatchScore,
  cancelMatch
}; 