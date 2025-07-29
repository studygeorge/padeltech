const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MatchPlayer = sequelize.define('MatchPlayer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  matchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Matches',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  team: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[1, 2]] // Только команды 1 или 2
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['matchId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['team']
    }
  ]
});

module.exports = MatchPlayer; 