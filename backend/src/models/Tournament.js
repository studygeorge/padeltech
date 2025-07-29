const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tournament = sequelize.define('Tournament', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tournament_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  pairs_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'active', 'completed', 'cancelled'),
    defaultValue: 'upcoming'
  },
  created_by_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'tournaments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Tournament;