const express = require('express');
const router = express.Router();
const americanoController = require('../controllers/americanoController');
const auth = require('../middleware/auth');

// Middleware для опциональной авторизации
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (token) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
        const { sequelize } = require('../models');
        
        const users = await sequelize.query(
          'SELECT * FROM users WHERE id = ?',
          {
            replacements: [decoded.id],
            type: sequelize.QueryTypes.SELECT
          }
        );
        
        if (users.length > 0) {
          req.user = users[0];
        }
      }
    }
  } catch (error) {
    // Игнорируем ошибки авторизации для опциональной авторизации
    console.log('Optional auth failed:', error.message);
  }
  next();
};

// Создание игры американо (опциональная авторизация)
router.post('/', optionalAuth, americanoController.createAmericano);

// Получение данных игры (без авторизации)
router.get('/:id', americanoController.getAmericanoGame);

// Сохранение счета (без авторизации)
router.post('/:id/score', americanoController.saveMatchScore);

// Завершение игры (без авторизации)
router.post('/:id/finish', americanoController.finishGame);

module.exports = router;