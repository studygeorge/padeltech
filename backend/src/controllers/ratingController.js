const { User } = require('../models');
const { Op } = require('sequelize');

const getRating = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id',
        'username',
        'first_name',
        'last_name', 
        'photo_url',
        'rating',
        'monthly_rating_change',
        'tournaments_count',
        'level'
      ],
      order: [
        ['rating', 'DESC'],
        ['tournaments_count', 'DESC']
      ]
    });

    // Преобразуем данные для фронтенда
    const formattedUsers = users.map((user, index) => ({
      id: user.id,
      rank: index + 1,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Пользователь',
      username: user.username,
      avatar: user.photo_url,
      rating: user.rating,
      monthlyChange: user.monthly_rating_change,
      tournaments: user.tournaments_count,
      level: user.level
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Ошибка при получении рейтинга:', error);
    res.status(500).json({ error: 'Ошибка при получении рейтинга' });
  }
};

const updateRatings = async (matchId) => {
  // TODO: Реализация обновления рейтингов через Sequelize
  console.log('TODO: Implement rating updates for match:', matchId);
};

const resetMonthlyChanges = async (req, res) => {
  try {
    const [affectedCount] = await User.update(
      { monthly_rating_change: 0 },
      { 
        where: { 
          monthly_rating_change: { [Op.ne]: 0 } 
        } 
      }
    );

    console.log('✅ Monthly changes reset for', affectedCount, 'users');
    res.json({ success: true, affectedUsers: affectedCount });
  } catch (error) {
    console.error('Ошибка при сбросе месячных изменений:', error);
    res.status(500).json({ error: 'Ошибка при сбросе месячных изменений' });
  }
};

module.exports = {
  getRating,
  updateRatings,
  resetMonthlyChanges
};
