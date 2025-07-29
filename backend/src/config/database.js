require('dotenv').config();
const { Sequelize } = require('sequelize');

// Отладочная информация
console.log('🔧 Конфигурация базы данных:');
console.log('DB_HOST исходное значение:', JSON.stringify(process.env.DB_HOST));
console.log('DB_NAME исходное значение:', JSON.stringify(process.env.DB_NAME));
console.log('DB_USER исходное значение:', JSON.stringify(process.env.DB_USER));
console.log('DB_PORT исходное значение:', JSON.stringify(process.env.DB_PORT));

// Получаем значения с обработкой ошибок
const dbHost = process.env.DB_HOST && process.env.DB_HOST.trim() !== '' ? process.env.DB_HOST.trim() : '127.0.0.1';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
const dbUser = process.env.DB_USER && process.env.DB_USER.trim() !== '' ? process.env.DB_USER.trim() : 'u3188490_default';
const dbPass = process.env.DB_PASS && process.env.DB_PASS.trim() !== '' ? process.env.DB_PASS.trim() : '';
const dbName = process.env.DB_NAME && process.env.DB_NAME.trim() !== '' ? process.env.DB_NAME.trim() : 'u3188490_default';

console.log('🔧 Обработанные значения:');
console.log('Host:', JSON.stringify(dbHost));
console.log('Port:', dbPort);
console.log('User:', JSON.stringify(dbUser));
console.log('Database:', JSON.stringify(dbName));
console.log('Has Password:', !!dbPass);

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPass,
  database: dbName,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    charset: 'utf8mb4',
    dateStrings: true,
    typeCast: true,
    timezone: '+03:00',
    flags: ['-FOUND_ROWS']
  },
  timezone: '+03:00',
  define: {
    charset: 'utf8mb4',
    timestamps: true,
    underscored: false,
    freezeTableName: false
  },
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 0
  }
});

module.exports = sequelize;