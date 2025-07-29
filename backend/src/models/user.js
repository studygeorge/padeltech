const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  telegramId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING
  },
  firstName: {
    type: DataTypes.STRING
  },
  lastName: {
    type: DataTypes.STRING
  },
  photoUrl: {
    type: DataTypes.TEXT
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'moderator'),
    defaultValue: 'user',
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    allowNull: false
  },
  monthlyRatingChange: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  tournamentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  level: {
    type: DataTypes.STRING(2),
    defaultValue: 'D',
    allowNull: false
  },
  lastActive: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['telegramId']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['level']
    }
  ]
});

module.exports = User; 