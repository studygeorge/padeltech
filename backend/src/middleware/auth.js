const jwt = require('jsonwebtoken');
const { sequelize } = require('../models');

const auth = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware started');
    console.log('📋 Authorization header:', req.headers.authorization ? 'Present' : 'Missing');

    // Получаем токен из заголовка
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('❌ No authorization header');
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      console.log('❌ No token in header');
      return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    console.log('🔍 Token found, length:', token.length);
    console.log('🔍 Token preview:', token.substring(0, 20) + '...');

    // Проверяем токен
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      console.log('✅ Token decoded successfully:', { id: decoded.id, username: decoded.username });
    } catch (jwtError) {
      console.log('❌ JWT verification failed:', jwtError.message);
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Недействительный токен' });
      }
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Срок действия токена истек' });
      }
      throw jwtError;
    }
    
    // Находим пользователя через raw SQL
    console.log('👤 Looking for user with ID:', decoded.id);
    const users = await sequelize.query(
      'SELECT * FROM users WHERE id = ?',
      {
        replacements: [decoded.id],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    console.log('👤 User query completed, found:', users.length, 'users');
    
    if (users.length === 0) {
      console.log('❌ User not found in database for ID:', decoded.id);
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    const user = users[0];
    console.log('✅ User found:', { id: user.id, username: user.username, telegram_id: user.telegram_id });

    // Добавляем пользователя в объект запроса
    req.user = user;
    console.log('✅ User attached to request object');
    
    // Продолжаем выполнение
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(500).json({ error: 'Ошибка сервера при аутентификации' });
  }
};

module.exports = auth;