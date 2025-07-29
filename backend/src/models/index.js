const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Определяем модель User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  telegram_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  photo_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'moderator', 'manager'),
    defaultValue: 'user'
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 1000
  },
  monthly_rating_change: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tournaments_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  level: {
    type: DataTypes.ENUM('A', 'B+', 'B', 'C+', 'C', 'D'),
    defaultValue: 'D'
  },
  registration_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_active: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Определяем модель Match
const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  court_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  max_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 11
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  created_by_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'matches',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Определяем модель MatchPlayer для связи матчей и игроков
const MatchPlayer = sequelize.define('MatchPlayer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  match_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  team: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[1, 2]]
    }
  }
}, {
  tableName: 'match_players',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Определяем модель MatchScore для хранения счета
const MatchScore = sequelize.define('MatchScore', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  match_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  set_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  team1_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  team2_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'match_scores',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Определяем модель Tournament
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
    allowNull: false,
    get() {
      const date = this.getDataValue('tournament_date');
      return date; // Возвращаем дату как есть
    }
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

// Определяем модель TournamentPair
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

// Связи между моделями Match и User
Match.belongsToMany(User, { 
  through: MatchPlayer,
  foreignKey: 'match_id',
  otherKey: 'user_id',
  as: 'players'
});

User.belongsToMany(Match, { 
  through: MatchPlayer,
  foreignKey: 'user_id',
  otherKey: 'match_id',  
  as: 'matches'
});

Match.hasMany(MatchPlayer, {
  foreignKey: 'match_id',
  as: 'matchPlayers'
});

MatchPlayer.belongsTo(Match, {
  foreignKey: 'match_id'
});

MatchPlayer.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'player'
});

User.hasMany(MatchPlayer, {
  foreignKey: 'user_id'
});

Match.hasMany(MatchScore, {
  foreignKey: 'match_id',
  as: 'scores'
});

MatchScore.belongsTo(Match, {
  foreignKey: 'match_id'
});

Match.belongsTo(User, {
  foreignKey: 'created_by_id',
  as: 'creator'
});

User.hasMany(Match, {
  foreignKey: 'created_by_id',
  as: 'createdMatches'
});

// Связи между моделями Tournament и User
Tournament.hasMany(TournamentPair, {
  foreignKey: 'tournament_id',
  as: 'pairs'
});

TournamentPair.belongsTo(Tournament, {
  foreignKey: 'tournament_id',
  as: 'tournament'
});

TournamentPair.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

User.hasMany(TournamentPair, {
  foreignKey: 'user_id',
  as: 'tournamentPairs'
});

Tournament.belongsTo(User, {
  foreignKey: 'created_by_id',
  as: 'creator'
});

User.hasMany(Tournament, {
  foreignKey: 'created_by_id',
  as: 'createdTournaments'
});

module.exports = {
  sequelize,
  User,
  Match,
  MatchPlayer,
  MatchScore,
  Tournament,
  TournamentPair
};