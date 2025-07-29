const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Модель игры американо
const AmericanoGame = sequelize.define('AmericanoGame', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_by_id: {
    type: DataTypes.INTEGER,
    allowNull: true // Разрешаем null для анонимных игр
  },
  max_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 21
  },
  court_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'finished'),
    defaultValue: 'active'
  },
  total_rounds: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'americano_games',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Модель игроков в американо
const AmericanoPlayer = sequelize.define('AmericanoPlayer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  game_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  player_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  player_index: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'americano_players',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Модель матчей в американо
const AmericanoMatch = sequelize.define('AmericanoMatch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  game_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  round_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  team1_player1: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  team1_player2: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  team2_player1: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  team2_player2: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  team1_score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  team2_score: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'americano_matches',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Связи между моделями американо
AmericanoGame.hasMany(AmericanoPlayer, {
  foreignKey: 'game_id',
  as: 'players'
});

AmericanoPlayer.belongsTo(AmericanoGame, {
  foreignKey: 'game_id'
});

AmericanoGame.hasMany(AmericanoMatch, {
  foreignKey: 'game_id',
  as: 'matches'
});

AmericanoMatch.belongsTo(AmericanoGame, {
  foreignKey: 'game_id'
});

module.exports = {
  AmericanoGame,
  AmericanoPlayer,
  AmericanoMatch
};