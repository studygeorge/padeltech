<template>
    <div class="fast-match-container">
      <div class="match-header">
        <h1>{{ gameData?.name || 'Игра' }}</h1>
        <div class="match-info">
          <span>{{ gameData?.gameType || 'Американо' }}</span>
          <span>{{ gameData?.maxPoints }} очков</span>
          <span>{{ gameData?.players?.length }} игроков</span>
        </div>
      </div>
  
      <div class="match-tabs">
        <button 
          :class="['tab-btn', { active: activeTab === 'rounds' }]"
          @click="activeTab = 'rounds'"
        >
          Раунды
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'leaderboard' }]"
          @click="activeTab = 'leaderboard'"
        >
          Лидерборд
        </button>
      </div>
  
      <!-- Раунды -->
      <div v-if="activeTab === 'rounds'" class="rounds-section">
        <div class="rounds-navigation">
          <button 
            v-for="round in totalRounds" 
            :key="round"
            :class="['round-nav-btn', { active: currentRound === round }]"
            @click="setCurrentRound(round)"
          >
            {{ round }}
          </button>
        </div>
  
        <div class="current-round">
          <h2>Раунд {{ currentRound }}</h2>
          
          <div v-if="currentRoundMatches.length" class="matches-grid">
            <div 
              v-for="match in currentRoundMatches" 
              :key="match.id"
              class="match-card"
            >
              <div class="match-players">
                <div class="team team-1">
                  <div class="player">{{ match.team1.player1 }}</div>
                  <div class="player">{{ match.team1.player2 }}</div>
                </div>
                <div class="vs-divider">VS</div>
                <div class="team team-2">
                  <div class="player">{{ match.team2.player1 }}</div>
                  <div class="player">{{ match.team2.player2 }}</div>
                </div>
              </div>
              
              <div class="match-score" @click="openScoreModal(match)">
                <div class="score-display">
                  <span class="score">{{ match.team1Score || 0 }}</span>
                  <span class="score-separator">:</span>
                  <span class="score">{{ match.team2Score || 0 }}</span>
                </div>
                <div class="court-info">Корт № {{ match.courtNumber }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Лидерборд -->
      <div v-if="activeTab === 'leaderboard'" class="leaderboard-section">
        <h2>Лидерборд</h2>
        <div class="leaderboard-table">
          <div class="leaderboard-header">
            <div>Место</div>
            <div>Игрок</div>
            <div>Победы</div>
            <div>Ничьи</div>
            <div>Поражения</div>
            <div>+</div>
            <div>-</div>
            <div>+/-</div>
          </div>
          <div 
            v-for="(player, index) in leaderboard" 
            :key="player.name"
            class="leaderboard-row"
          >
            <div class="rank">{{ index + 1 }}</div>
            <div class="player-name">{{ player.name }}</div>
            <div class="wins">{{ player.wins }}</div>
            <div class="draws">{{ player.draws }}</div>
            <div class="losses">{{ player.losses }}</div>
            <div class="points-for">{{ player.pointsFor }}</div>
            <div class="points-against">{{ player.pointsAgainst }}</div>
            <div class="point-diff" :class="{ positive: player.pointDiff > 0, negative: player.pointDiff < 0 }">
              {{ player.pointDiff > 0 ? '+' : '' }}{{ player.pointDiff }}
            </div>
          </div>
        </div>
      </div>
  
      <!-- Модальное окно для ввода счета -->
      <ScoreModal
        :show="showScoreModal"
        :match="selectedMatch"
        :max-points="gameData?.maxPoints"
        @close="closeScoreModal"
        @save="saveScore"
      />
  
      <!-- Кнопка завершения игры -->
      <div class="game-actions" v-if="canFinishGame">
        <Button variant="primary" @click="finishGame">
          Завершить игру
        </Button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import Button from '@/components/ui/Button.vue'
  import ScoreModal from '@/components/match/ScoreModal.vue'
  
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  
  const gameData = ref(null)
  const activeTab = ref('rounds')
  const currentRound = ref(1)
  const showScoreModal = ref(false)
  const selectedMatch = ref(null)
  
  const totalRounds = computed(() => {
    if (!gameData.value) return 0
    const playerCount = gameData.value.players.length
    return Math.max(1, playerCount - 1) // Количество раундов = количество игроков - 1
  })
  
  const currentRoundMatches = computed(() => {
    if (!gameData.value) return []
    return gameData.value.rounds?.[currentRound.value - 1]?.matches || []
  })
  
  const leaderboard = computed(() => {
    if (!gameData.value) return []
    return gameData.value.leaderboard || []
  })
  
  const canFinishGame = computed(() => {
    if (!gameData.value) return false
    // Проверяем, что все матчи во всех раундах завершены
    return gameData.value.rounds?.every(round => 
      round.matches.every(match => 
        match.team1Score !== null && match.team2Score !== null
      )
    ) || false
  })
  
  const setCurrentRound = (round) => {
    currentRound.value = round
    router.replace({ query: { ...route.query, round } })
  }
  
  const openScoreModal = (match) => {
    selectedMatch.value = match
    showScoreModal.value = true
  }
  
  const closeScoreModal = () => {
    showScoreModal.value = false
    selectedMatch.value = null
  }
  
  const saveScore = async (scoreData) => {
    try {
      const response = await fetch(`/api/matches/americano/${route.params.id}/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(scoreData)
      })
  
      if (!response.ok) {
        throw new Error('Ошибка при сохранении счета')
      }
  
      // Обновляем данные игры
      await fetchGameData()
      closeScoreModal()
    } catch (error) {
      console.error('Ошибка при сохранении счета:', error)
    }
  }
  
  const finishGame = async () => {
    try {
      const response = await fetch(`/api/matches/americano/${route.params.id}/finish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
  
      if (!response.ok) {
        throw new Error('Ошибка при завершении игры')
      }
  
      // Переходим на страницу результатов
      router.push(`/fast-match/${route.params.id}/results`)
    } catch (error) {
      console.error('Ошибка при завершении игры:', error)
    }
  }
  
  const fetchGameData = async () => {
    try {
      const response = await fetch(`/api/matches/americano/${route.params.id}`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
  
      if (!response.ok) {
        throw new Error('Ошибка при загрузке данных игры')
      }
  
      gameData.value = await response.json()
    } catch (error) {
      console.error('Ошибка при загрузке данных игры:', error)
      router.push('/match')
    }
  }
  
  onMounted(async () => {
    // Устанавливаем текущий раунд из URL
    if (route.query.round) {
      currentRound.value = parseInt(route.query.round)
    }
    
    await fetchGameData()
  })
  </script>
  
  <style scoped>
  .fast-match-container {
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .match-header {
    text-align: center;
    margin-bottom: 32px;
  }
  
  .match-header h1 {
    margin-bottom: 8px;
  }
  
  .match-info {
    display: flex;
    justify-content: center;
    gap: 16px;
    color: #666;
    font-size: 14px;
  }
  
  .match-tabs {
    display: flex;
    background: #f5f5f5;
    border-radius: 8px;
    padding: 4px;
    margin-bottom: 32px;
  }
  
  .tab-btn {
    flex: 1;
    padding: 12px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.15s;
  }
  
  .tab-btn.active {
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .rounds-navigation {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  
  .round-nav-btn {
    width: 40px;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.15s;
  }
  
  .round-nav-btn.active {
    background: #1976d2;
    color: white;
    border-color: #1976d2;
  }
  
  .current-round h2 {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .matches-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .match-card {
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 20px;
    background: white;
  }
  
  .match-players {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .team {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 120px;
  }
  
  .player {
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    text-align: center;
    font-weight: 500;
  }
  
  .team-1 .player {
    background: #ffe6e6;
  }
  
  .team-2 .player {
    background: #e6f3ff;
  }
  
  .vs-divider {
    margin: 0 20px;
    font-weight: bold;
    color: #666;
  }
  
  .match-score {
    text-align: center;
    cursor: pointer;
    padding: 12px;
    border-radius: 8px;
    transition: background 0.15s;
  }
  
  .match-score:hover {
    background: #f5f5f5;
  }
  
  .score-display {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .score-separator {
    margin: 0 8px;
    color: #666;
  }
  
  .court-info {
    color: #666;
    font-size: 14px;
  }
  
  .leaderboard-section h2 {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .leaderboard-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .leaderboard-header {
    display: grid;
    grid-template-columns: 60px 2fr 80px 80px 100px 60px 60px 80px;
    padding: 16px;
    background: #f5f5f5;
    font-weight: 500;
    gap: 12px;
  }
  
  .leaderboard-row {
    display: grid;
    grid-template-columns: 60px 2fr 80px 80px 100px 60px 60px 80px;
    padding: 16px;
    border-bottom: 1px solid #eee;
    align-items: center;
    gap: 12px;
  }
  
  .leaderboard-row:last-child {
    border-bottom: none;
  }
  
  .rank {
    font-weight: bold;
    text-align: center;
  }
  
  .player-name {
    font-weight: 500;
  }
  
  .wins, .draws, .losses, .points-for, .points-against {
    text-align: center;
  }
  
  .point-diff {
    text-align: center;
    font-weight: 500;
  }
  
  .point-diff.positive {
    color: #22c55e;
  }
  
  .point-diff.negative {
    color: #ef4444;
  }
  
  .game-actions {
    margin-top: 32px;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .fast-match-container {
      padding: 16px 8px;
    }
    
    .match-info {
      flex-direction: column;
      gap: 8px;
    }
    
    .match-players {
      flex-direction: column;
      gap: 12px;
    }
    
    .vs-divider {
      margin: 8px 0;
    }
    
    .leaderboard-header,
    .leaderboard-row {
      grid-template-columns: 40px 1fr 50px 50px 60px 40px 40px 50px;
      gap: 8px;
      font-size: 14px;
    }
  }
  </style>