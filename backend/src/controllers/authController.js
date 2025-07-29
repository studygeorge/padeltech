const jwt = require('jsonwebtoken');
const { User, sequelize } = require('../models');
const crypto = require('crypto');

// Проверка подписи Telegram (упрощенная)
function checkTelegramAuth(data, botToken) {
  // В разработке отключаем проверку
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  if (!botToken) return false;
  
  try {
    const secret = crypto.createHash('sha256').update(botToken).digest();
    
    const dataCheckString = Object.keys(data)
      .filter((key) => key !== 'hash' && data[key] !== null && data[key] !== undefined)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('\n');
    
    const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
    return hmac === data.hash;
  } catch (error) {
    console.error('Ошибка проверки подписи Telegram:', error);
    return false;
  }
}

exports.telegramAuth = async (req, res) => {
  console.log('🚀 Telegram auth request received');
  console.log('📦 Request body:', req.body);
  
  const {
    id,
    first_name,
    last_name,
    username,
    photo_url,
    auth_date,
    hash
  } = req.body;

  // Базовая валидация
  if (!id || !first_name) {
    return res.status(400).json({ message: 'Недостаточно данных от Telegram' });
  }

  try {
    console.log('🔍 Checking if user exists in database...');
    
    // Используем Sequelize ORM
    let user = await User.findOne({
      where: { telegram_id: id }
    });
    
    if (user) {
      console.log('✅ User found in database');
      
      // Обновляем данные пользователя
      await user.update({
        first_name: first_name || user.first_name,
        last_name: last_name || user.last_name,
        username: username || user.username,
        photo_url: photo_url || user.photo_url
      });
      
      console.log('📝 User data updated');
    } else {
      console.log('🆕 User not found, creating new user...');
      
      // Создаем нового пользователя
      user = await User.create({
        telegram_id: id,
        first_name: first_name,
        last_name: last_name,
        username: username,
        photo_url: photo_url,
        registration_completed: false,
        rating: 1000,
        level: 'D',
        role: 'user',
        monthly_rating_change: 0,
        tournaments_count: 0
      });
      
      console.log('✅ New user created with ID:', user.id);
    }

    console.log('🎫 Generating JWT token...');
    
    const token = jwt.sign(
      {
        id: user.id,
        telegram_id: user.telegram_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '30d' }
    );

    const responseData = {
      token,
      user: {
        id: user.id,
        telegram_id: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        photoUrl: user.photo_url,
        role: user.role,
        rating: user.rating,
        level: user.level,
        gender: user.gender,
        registrationCompleted: Boolean(user.registration_completed)
      }
    };

    console.log('✅ Auth successful, sending response');
    
    res.json(responseData);
  } catch (err) {
    console.error('❌ Error during Telegram auth:', err);
    res.status(500).json({ 
      message: 'Ошибка сервера при авторизации',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Завершение регистрации через raw SQL
// Завершение регистрации через raw SQL
exports.completeRegistration = async (req, res) => {
  try {
    console.log('🔧 Complete registration started');
    console.log('🔍 Request object keys:', Object.keys(req));
    console.log('👤 req.user exists:', !!req.user);
    console.log('👤 req.user:', req.user ? {
      id: req.user.id,
      username: req.user.username,
      telegram_id: req.user.telegram_id
    } : 'undefined');
    console.log('📦 Request body:', req.body);

    // Проверяем наличие пользователя с детальными логами
    if (!req.user) {
      console.log('❌ req.user is undefined or null');
      return res.status(401).json({ error: 'Пользователь не авторизован - req.user отсутствует' });
    }

    if (!req.user.id) {
      console.log('❌ req.user.id is undefined or null');
      console.log('❌ req.user structure:', JSON.stringify(req.user, null, 2));
      return res.status(401).json({ error: 'Пользователь не авторизован - отсутствует ID' });
    }

    const { level, gender } = req.body;
    const userId = req.user.id;

    console.log('🔧 Proceeding with registration completion for user ID:', userId, 'with data:', { level, gender });

    if (!level || !gender) {
      return res.status(400).json({ error: 'Уровень и пол обязательны' });
    }

    const validLevels = ['D', 'C', 'B'];
    const validGenders = ['male', 'female'];

    if (!validLevels.includes(level)) {
      return res.status(400).json({ error: 'Некорректный уровень' });
    }

    if (!validGenders.includes(gender)) {
      return res.status(400).json({ error: 'Некорректный пол' });
    }

    console.log('🔄 Executing SQL update...');

    // Используем raw SQL для обновления
    const updateResult = await sequelize.query(
      `UPDATE users SET 
        level = ?, 
        gender = ?, 
        registration_completed = 1,
        updated_at = NOW()
      WHERE id = ?`,
      {
        replacements: [level, gender, userId],
        type: sequelize.QueryTypes.UPDATE
      }
    );

    console.log('✅ SQL update completed, result:', updateResult);

    // Получаем обновленного пользователя через raw SQL
    console.log('🔄 Fetching updated user...');
    const users = await sequelize.query(
      'SELECT * FROM users WHERE id = ?',
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (users.length === 0) {
      console.log('❌ User not found after update');
      return res.status(404).json({ error: 'Пользователь не найден после обновления' });
    }

    const user = users[0];
    console.log('✅ Updated user retrieved:', { 
      id: user.id, 
      level: user.level, 
      gender: user.gender, 
      registration_completed: user.registration_completed 
    });

    const responseData = {
      success: true,
      user: {
        id: user.id,
        telegram_id: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        photoUrl: user.photo_url,
        role: user.role,
        rating: user.rating,
        level: user.level,
        gender: user.gender,
        registrationCompleted: Boolean(user.registration_completed)
      }
    };

    console.log('✅ Sending successful response');
    res.json(responseData);
  } catch (err) {
    console.error('❌ Error completing registration:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(500).json({ 
      error: 'Ошибка при завершении регистрации',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Проверка токена через raw SQL
exports.verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    // Используем raw SQL для получения пользователя
    const users = await sequelize.query(
      'SELECT * FROM users WHERE id = ?',
      {
        replacements: [decoded.id],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const user = users[0];

    res.json({
      user: {
        id: user.id,
        telegram_id: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        photoUrl: user.photo_url,
        role: user.role,
        rating: user.rating,
        level: user.level,
        gender: user.gender,
        registrationCompleted: Boolean(user.registration_completed)
      }
    });
  } catch (err) {
    console.error('Error in verifyToken:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Недействительный токен' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Срок действия токена истек' });
    }
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Выход выполнен успешно' });
};
