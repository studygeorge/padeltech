require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Импортируем все модели
const { sequelize } = require('./models');
const { AmericanoGame, AmericanoPlayer, AmericanoMatch } = require('./models/americano');

// Импортируем маршруты
const authRoutes = require('./routes/auth');
const matchRoutes = require('./routes/match');
const ratingRoutes = require('./routes/rating');
const adminRoutes = require('./routes/admin');
const americanoRoutes = require('./routes/americano');
const tournamentRoutes = require('./routes/tournaments');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/matches/americano', americanoRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tournaments', tournamentRoutes);

// Обработка ошибок 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Эндпоинт не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Глобальная ошибка:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Инициализация базы данных и создание таблиц
const initApp = async () => {
  try {
    console.log('🔌 Подключение к базе данных...');
    
    // Отладочная информация переменных окружения
    console.log('🔧 Переменные окружения БД:');
    console.log('DB_HOST:', JSON.stringify(process.env.DB_HOST));
    console.log('DB_NAME:', JSON.stringify(process.env.DB_NAME));
    console.log('DB_USER:', JSON.stringify(process.env.DB_USER));
    console.log('DB_PORT:', JSON.stringify(process.env.DB_PORT));
    console.log('typeof DB_HOST:', typeof process.env.DB_HOST);
    
    console.log('📊 Конфигурация БД:', {
      host: process.env.DB_HOST || '127.0.0.1',
      database: process.env.DB_NAME || 'u3188490_default',
      user: process.env.DB_USER || 'u3188490_default',
      port: process.env.DB_PORT || 3306,
      hasPassword: !!process.env.DB_PASS
    });

    // Проверяем подключение к базе данных
    await sequelize.authenticate();
    console.log('✅ База данных успешно подключена');

    // Синхронизируем ВСЕ модели с базой данных
    console.log('🔄 Синхронизация моделей с базой данных...');
    
    // Создаем таблицы в правильном порядке (сначала основные, потом зависимые)
    await sequelize.sync({ 
      alter: true, // Изменяет существующие таблицы при необходимости
      force: false // НЕ удаляем существующие данные
    });
    
    console.log('✅ Все модели синхронизированы с базой данных');
    
    // Выводим информацию о созданных таблицах
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();
    console.log('📋 Созданные таблицы:', tables);

    // Запускаем сервер
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`🌐 Режим: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API доступно по адресу: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Ошибка при инициализации приложения:', error);
    
    // Детальная информация об ошибке подключения к БД
    if (error.name === 'SequelizeAccessDeniedError') {
      console.error('🔒 Проверьте правильность учетных данных базы данных');
      console.error('📝 Текущие настройки:', {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'u3188490_default',
        database: process.env.DB_NAME || 'u3188490_default',
        port: process.env.DB_PORT || 3306,
        hasPassword: !!process.env.DB_PASS
      });
    }
    
    if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeConnectionRefusedError') {
      console.error('🌐 Проблемы с подключением к базе данных');
      console.error('💡 Убедитесь, что MySQL сервер запущен и доступен');
      console.error('🔍 Проверьте:');
      console.error('  - MySQL сервер запущен: systemctl status mysql');
      console.error('  - Порт 3306 доступен: netstat -tlnp | grep :3306');
      console.error('  - Подключение работает: mysql -h 127.0.0.1 -u u3188490_default -p');
    }
    
    if (error.name === 'SequelizeHostNotFoundError') {
      console.error('🌐 Хост базы данных не найден');
      console.error('💡 Проверьте значение DB_HOST в .env файле');
      console.error('🔧 Текущее значение DB_HOST:', JSON.stringify(process.env.DB_HOST));
    }
    
    process.exit(1);
  }
};

// Обработка неперехваченных исключений
process.on('uncaughtException', (err) => {
  console.error('Неперехваченное исключение:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Необработанное отклонение промиса:', reason);
  process.exit(1);
});

// Запускаем приложение
initApp();