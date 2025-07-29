<template>
  <div class="rating-container">
    <h1>Рейтинг игроков</h1>

    <!-- Десктопная версия таблицы -->
    <div class="rating-table desktop-only">
      <div class="table-header">
        <div class="col-rank">Место</div>
        <div class="col-player">Игрок</div>
        <div class="col-rating">Рейтинг</div>
        <div class="col-tournaments">Турниры</div>
        <div class="col-level">Уровень</div>
        <div v-if="isAdmin" class="col-actions">Действия</div>
      </div>

      <Loading v-if="isLoading" text="Загрузка рейтинга..." />

      <ErrorAlert v-else-if="error" :error="error" />

      <div v-else class="table-body">
        <div v-for="player in players" :key="player.id" class="table-row">
          <div class="col-rank">{{ player.rank }}</div>
          <div class="col-player">
            <div class="player-info">
              <div class="player-avatar">
                <img v-if="player.avatar" :src="player.avatar" :alt="player.name">
                <span v-else class="avatar-fallback">{{ player.name[0] }}</span>
              </div>
              <div class="player-details">
                <div class="player-name">{{ player.name }}</div>
                <div v-if="player.username" class="player-username">@{{ player.username }}</div>
              </div>
            </div>
          </div>
          <div class="col-rating">
            <div class="rating-info">
              <div class="current-rating">{{ player.rating }}</div>
              <div class="monthly-change" :class="getChangeClass(player.monthlyChange)">
                {{ formatChange(player.monthlyChange) }}
              </div>
            </div>
          </div>
          <div class="col-tournaments">{{ player.tournaments }}</div>
          <div class="col-level">
            <span v-if="!isEditingLevel[player.id]" class="level-badge" :class="getLevelClass(player.level)">
              {{ player.level }}
            </span>
            <select 
              v-else
              v-model="editingLevel"
              @change="updatePlayerLevel(player.id)"
              class="level-select"
            >
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          <div v-if="isAdmin" class="col-actions">
            <Button 
              variant="small"
              @click="startEditingLevel(player.id, player.level)"
            >
              Изменить уровень
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Мобильная версия карточками -->
    <div class="rating-cards mobile-only">
      <Loading v-if="isLoading" text="Загрузка рейтинга..." />

      <ErrorAlert v-else-if="error" :error="error" />

      <div v-else class="cards-container">
        <div v-for="player in players" :key="player.id" class="player-card">
          <div class="card-content">
            <div class="rank-number">{{ player.rank }}</div>
            
            <div class="player-section">
              <div class="player-avatar">
                <img v-if="player.avatar" :src="player.avatar" :alt="player.name">
                <span v-else class="avatar-fallback">{{ player.name[0] }}</span>
              </div>
              <div class="player-details">
                <div class="player-name">{{ player.name }}</div>
                <div v-if="player.username" class="player-username">@{{ player.username }}</div>
              </div>
            </div>
            
            <div class="stats-section">
              <div class="rating-section">
                <div class="current-rating">{{ player.rating }}</div>
                <div class="monthly-change" :class="getChangeClass(player.monthlyChange)">
                  {{ formatChange(player.monthlyChange) }}
                </div>
              </div>
              
              <div class="tournaments-count">{{ player.tournaments }}</div>
              
              <div class="level-section">
                <span v-if="!isEditingLevel[player.id]" class="level-badge" :class="getLevelClass(player.level)">
                  {{ player.level }}
                </span>
                <select 
                  v-else
                  v-model="editingLevel"
                  @change="updatePlayerLevel(player.id)"
                  class="level-select-mobile"
                >
                  <option value="A">A</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              
              <div v-if="isAdmin" class="action-section">
                <Button 
                  variant="small"
                  @click="startEditingLevel(player.id, player.level)"
                  class="edit-btn"
                >
                  ✏️
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'

const authStore = useAuthStore()
const isAdmin = computed(() => ['admin', 'manager'].includes(authStore.user?.role))

const isLoading = ref(true)
const error = ref(null)
const players = ref([])
const isEditingLevel = ref({})
const editingLevel = ref('')

const getChangeClass = (change) => {
  if (change > 0) return 'positive'
  if (change < 0) return 'negative'
  return ''
}

const formatChange = (change) => {
  if (change > 0) return `+${change}`
  return change.toString()
}

const getLevelClass = (level) => {
  const levelMap = {
    'A': 'level-a',
    'B+': 'level-b-plus',
    'B': 'level-b',
    'C+': 'level-c-plus',
    'C': 'level-c',
    'D': 'level-d'
  }
  return levelMap[level] || ''
}

const startEditingLevel = (playerId, currentLevel) => {
  isEditingLevel.value = { [playerId]: true }
  editingLevel.value = currentLevel
}

const updatePlayerLevel = async (playerId) => {
  try {
    const response = await fetch(`/api/admin/users/${playerId}/level`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ level: editingLevel.value })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Ошибка при обновлении уровня')
    }

    const playerIndex = players.value.findIndex(p => p.id === playerId)
    if (playerIndex !== -1) {
      players.value[playerIndex].level = editingLevel.value
    }

    isEditingLevel.value = {}
  } catch (err) {
    console.error('Ошибка при обновлении уровня:', err)
    error.value = 'Не удалось обновить уровень игрока'
  }
}

const loadPlayers = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await fetch('/api/rating')
    if (!response.ok) {
      throw new Error('Ошибка при загрузке рейтинга')
    }
    
    players.value = await response.json()
  } catch (err) {
    console.error('Ошибка при загрузке рейтинга:', err)
    error.value = 'Не удалось загрузить рейтинг'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadPlayers()
})
</script>

<style scoped>
.rating-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.header-actions {
  margin-bottom: 24px;
  text-align: right;
}

h1 {
  margin: 0 0 24px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
}

/* Показать/скрыть версии */
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

/* Десктопная таблица */
.rating-table {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

.table-header {
  display: grid;
  grid-template-columns: 70px minmax(200px, 2fr) 130px 90px 90px minmax(120px, 1fr);
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  gap: 16px;
  align-items: center;
}

.table-row {
  display: grid;
  grid-template-columns: 70px minmax(200px, 2fr) 130px 90px 90px minmax(120px, 1fr);
  padding: 20px 24px;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
  gap: 16px;
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background-color: #f9fafb;
}

.table-row:last-child {
  border-bottom: none;
}

.col-rank {
  font-weight: 700;
  text-align: center;
  font-size: 18px;
  color: #1f2937;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.player-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.player-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  font-weight: 600;
  color: #6b7280;
  font-size: 16px;
}

.player-details {
  min-width: 0;
  flex: 1;
}

.player-name {
  font-weight: 600;
  font-size: 16px;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.player-username {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rating-info {
  text-align: center;
}

.current-rating {
  font-weight: 700;
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 2px;
}

.monthly-change {
  font-size: 12px;
  font-weight: 500;
}

.monthly-change.positive {
  color: #059669;
}

.monthly-change.negative {
  color: #dc2626;
}

.col-tournaments {
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: #374151;
}

.level-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  min-width: 40px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.level-a {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
}

.level-b-plus {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(249, 115, 22, 0.3);
}

.level-b {
  background: linear-gradient(135deg, #eab308 0%, #d97706 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(234, 179, 8, 0.3);
}

.level-c-plus {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
}

.level-c {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.level-d {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(107, 114, 128, 0.3);
}

.level-select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 13px;
  font-weight: 500;
  background: white;
  min-width: 60px;
}

.col-actions {
  text-align: center;
}

/* Компактная мобильная версия */
.cards-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-card {
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.card-content {
  display: grid;
  grid-template-columns: 30px 1fr auto;
  gap: 12px;
  align-items: center;
}

.rank-number {
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
  text-align: center;
}

.player-section {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.player-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
}

.player-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
}

.player-details {
  min-width: 0;
  flex: 1;
}

.player-name {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.player-username {
  font-size: 11px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.stats-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-section {
  text-align: center;
  min-width: 50px;
}

.current-rating {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.monthly-change {
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
}

.tournaments-count {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  min-width: 20px;
}

.level-section {
  min-width: 28px;
}

.level-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
  min-width: 20px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.level-select-mobile {
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 10px;
  font-weight: 500;
  background: white;
  width: 40px;
}

.action-section {
  min-width: 24px;
}

.edit-btn {
  padding: 4px 6px !important;
  font-size: 12px !important;
  min-width: auto !important;
  border-radius: 4px !important;
}

/* Форма */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.15s ease;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.datetime-group {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.datetime-group .form-group {
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

/* Мобильная версия */
@media (max-width: 768px) {
  .rating-container {
    padding: 16px 12px;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .desktop-only {
    display: none;
  }
  
  .mobile-only {
    display: block;
  }
  
  .header-actions {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .datetime-group {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .datetime-group .form-group {
    margin-bottom: 16px;
  }
  
  .datetime-group .form-group:last-child {
    margin-bottom: 0;
  }
}

@media (max-width: 480px) {
  .rating-container {
    padding: 12px 8px;
  }
  
  .player-card {
    padding: 10px 12px;
  }
  
  .card-content {
    gap: 10px;
  }
  
  .stats-section {
    gap: 6px;
  }
  
  .form-input,
  .form-textarea {
    padding: 10px 12px;
  }
}
</style>