const { User } = require('../models');
const { AmericanoGame, AmericanoPlayer, AmericanoMatch } = require('../models/americano');

// Функция генерации пар для американо (улучшенная)
function generateAmericanoRounds(playerCount) {
  const rounds = [];
  const players = Array.from({ length: playerCount }, (_, i) => i);
  
  // Для американо количество раундов = количество игроков - 1
  const roundCount = playerCount - 1;
  
  for (let round = 0; round < roundCount; round++) {
    const matches = [];
    const availablePlayers = [...players];
    
    // Создаем матчи для текущего раунда
    while (availablePlayers.length >= 4) {
      const team1Player1 = availablePlayers.shift();
      const team1Player2 = availablePlayers.shift();
      const team2Player1 = availablePlayers.shift();
      const team2Player2 = availablePlayers.shift();
      
      matches.push({
        team1Player1,
        team1Player2,
        team2Player1,
        team2Player2
      });
    }
    
    rounds.push(matches);
    
    // Ротация для следующего раунда (простая)
    if (playerCount > 4) {
      const first = players.shift();
      players.push(first);
    }
  }
  
  return rounds;
}

// Создание игры американо (с использованием Sequelize)
const createAmericano = async (req, res) => {
  try {
    const { name, players, courtNumber, maxPoints } = req.body;
    const userId = req.user?.id || null;

    // Валидация
    if (!name || !players || !courtNumber || !maxPoints) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    const playerCount = players.length;
    if (!((playerCount >= 4 && playerCount <= 16) || playerCount === 20 || playerCount === 24)) {
      return res.status(400).json({ 
        error: 'Количество игроков должно быть от 4 до 16, либо ровно 20 или 24' 
      });
    }

    if (maxPoints < 8 || maxPoints > 40) {
      return res.status(400).json({ error: 'Количество очков должно быть от 8 до 40' });
    }

    console.log('🎮 Creating americano game with players:', players);

    // Создаем игру через Sequelize
    const game = await AmericanoGame.create({
      name: name,
      created_by_id: userId,
      max_points: maxPoints,
      court_number: courtNumber,
      total_rounds: playerCount - 1,
      status: 'active'
    });

    console.log('✅ Game created with ID:', game.id);

    // Добавляем игроков
    const playerPromises = players.map((playerName, index) => 
      AmericanoPlayer.create({
        game_id: game.id,
        player_name: playerName,
        player_index: index
      })
    );
    
    await Promise.all(playerPromises);

    // Генерируем раунды
    const rounds = generateAmericanoRounds(playerCount);
    console.log('🔄 Generated rounds:', rounds);
    
    // Сохраняем матчи
    const matchPromises = [];
    for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
      for (const match of rounds[roundIndex]) {
        matchPromises.push(
          AmericanoMatch.create({
            game_id: game.id,
            round_number: roundIndex + 1,
            team1_player1: match.team1Player1,
            team1_player2: match.team1Player2,
            team2_player1: match.team2Player1,
            team2_player2: match.team2Player2
          })
        );
      }
    }
    
    await Promise.all(matchPromises);

    res.status(201).json({
      success: true,
      gameId: game.id,
      message: 'Игра американо создана успешно'
    });
  } catch (error) {
    console.error('❌ Error creating americano:', error);
    res.status(500).json({ 
      error: 'Ошибка при создании игры',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Получение данных игры
const getAmericanoGame = async (req, res) => {
  try {
    const gameId = req.params.id;

    const game = await AmericanoGame.findByPk(gameId, {
      include: [
        {
          model: AmericanoPlayer,
          as: 'players'
        },
        {
          model: AmericanoMatch,
          as: 'matches'
        }
      ]
    });

    if (!game) {
      return res.status(404).json({ error: 'Игра не найдена' });
    }

    // Группируем матчи по раундам
    const rounds = [];
    for (let i = 1; i <= game.total_rounds; i++) {
      const roundMatches = game.matches
        .filter(m => m.round_number === i)
        .map(match => ({
          id: match.id,
          team1: {
            player1: game.players[match.team1_player1]?.player_name,
            player2: game.players[match.team1_player2]?.player_name
          },
          team2: {
            player1: game.players[match.team2_player1]?.player_name,
            player2: game.players[match.team2_player2]?.player_name
          },
          team1Score: match.team1_score,
          team2Score: match.team2_score,
          courtNumber: game.court_number
        }));
      
      rounds.push({
        roundNumber: i,
        matches: roundMatches
      });
    }

    // Рассчитываем лидерборд
    const leaderboard = calculateLeaderboard(game.players, game.matches);

    const gameData = {
      id: game.id,
      name: game.name,
      gameType: 'Американо',
      maxPoints: game.max_points,
      courtNumber: game.court_number,
      status: game.status,
      players: game.players.map(p => p.player_name),
      rounds: rounds,
      leaderboard: leaderboard
    };

    res.json(gameData);
  } catch (error) {
    console.error('Ошибка при получении данных игры:', error);
    res.status(500).json({ error: 'Ошибка при загрузке игры' });
  }
};

// Функция расчета лидерборда
function calculateLeaderboard(players, matches) {
    const stats = {};
    
    players.forEach(player => {
      stats[player.player_index] = {
        name: player.player_name,
        wins: 0,
        draws: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        pointDiff: 0
      };
    });
  
    matches.forEach(match => {
      if (match.team1_score !== null && match.team2_score !== null) {
        const team1Players = [match.team1_player1, match.team1_player2];
        const team2Players = [match.team2_player1, match.team2_player2];
        
        // Добавляем очки каждому игроку
        team1Players.forEach(playerId => {
          if (stats[playerId]) {
            stats[playerId].pointsFor += match.team1_score;
            stats[playerId].pointsAgainst += match.team2_score;
          }
        });
        
        team2Players.forEach(playerId => {
          if (stats[playerId]) {
            stats[playerId].pointsFor += match.team2_score;
            stats[playerId].pointsAgainst += match.team1_score;
          }
        });
  
        // Определяем победителей и проигравших
        if (match.team1_score > match.team2_score) {
          team1Players.forEach(playerId => {
            if (stats[playerId]) stats[playerId].wins++;
          });
          team2Players.forEach(playerId => {
            if (stats[playerId]) stats[playerId].losses++;
          });
        } else if (match.team1_score < match.team2_score) {
          team1Players.forEach(playerId => {
            if (stats[playerId]) stats[playerId].losses++;
          });
          team2Players.forEach(playerId => {
            if (stats[playerId]) stats[playerId].wins++;
          });
        } else {
          // Ничья
          team1Players.forEach(playerId => {
            if (stats[playerId]) stats[playerId].draws++;
          });
          team2Players.forEach(playerId => {
            if (stats[playerId]) stats[playerId].draws++;
          });
        }
      }
    });
  
    // Рассчитываем разность очков и сортируем
    const leaderboard = Object.values(stats).map(player => ({
      ...player,
      pointDiff: player.pointsFor - player.pointsAgainst
    })).sort((a, b) => {
      // Сортировка по: 1) победы, 2) разность очков, 3) очки за
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.pointDiff !== a.pointDiff) return b.pointDiff - a.pointDiff;
      return b.pointsFor - a.pointsFor;
    });
  
    return leaderboard;
  }
  
  // Сохранение счета матча
  const saveMatchScore = async (req, res) => {
    try {
      const { matchId, team1Score, team2Score } = req.body;
  
      if (team1Score == null || team2Score == null) {
        return res.status(400).json({ error: 'Счет обеих команд обязателен' });
      }
  
      const match = await AmericanoMatch.findByPk(matchId);
      if (!match) {
        return res.status(404).json({ error: 'Матч не найден' });
      }
  
      await match.update({
        team1_score: team1Score,
        team2_score: team2Score
      });
  
      console.log('✅ Match score updated:', { matchId, team1Score, team2Score });
  
      res.json({ success: true });
    } catch (error) {
      console.error('Ошибка при сохранении счета:', error);
      res.status(500).json({ error: 'Ошибка при сохранении счета' });
    }
  };
  
  // Завершение игры
  const finishGame = async (req, res) => {
    try {
      const gameId = req.params.id;
  
      const game = await AmericanoGame.findByPk(gameId);
      if (!game) {
        return res.status(404).json({ error: 'Игра не найдена' });
      }
  
      await game.update({
        status: 'finished'
      });
  
      console.log('✅ Game finished:', gameId);
  
      res.json({ success: true });
    } catch (error) {
      console.error('Ошибка при завершении игры:', error);
      res.status(500).json({ error: 'Ошибка при завершении игры' });
    }
  };
  
  module.exports = {
    createAmericano,
    getAmericanoGame,
    saveMatchScore,
    finishGame
  };