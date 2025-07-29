const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TournamentPair = sequelize.define('TournamentPair', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tournament_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pair_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_pair_leader: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'tournament_pairs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = TournamentPair;