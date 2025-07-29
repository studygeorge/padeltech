const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MatchScore = sequelize.define('MatchScore', {
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
  team1Score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  team2Score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['matchId']
    }
  ]
});

module.exports = MatchScore; 