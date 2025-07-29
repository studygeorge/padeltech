<template>
  <div class="tournament-container">
    <Loading v-if="isLoading" text="Загрузка турнира..." />
    
    <ErrorAlert v-else-if="error" :error="error" />
    
    <div v-else-if="tournament" class="tournament-content">
      <!-- Заголовок турнира -->
      <div class="tournament-header">
        <div class="tournament-date">
          {{ formatDate(tournament.tournamentDate) }}
        </div>
        <h1 class="tournament-title">{{ tournament.name }}</h1>
        <div v-if="tournament.description" class="tournament-description">
          {{ tournament.description }}
        </div>
      </div>

      <!-- Статистика турнира -->
      <div class="tournament-stats">
        <div class="stat-card">
          <div class="stat-number">{{ tournament.occupiedSlots }}/{{ tournament.totalSlots }}</div>
          <div class="stat-label">Участников</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ tournament.pairsCount }}</div>
          <div class="stat-label">Пар</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ tournament.availableSlots }}</div>
          <div class="stat-label">Свободно мест</div>
        </div>
      </div>

      <!-- Участники -->
      <div class="participants-section">
        <h2>Участники ({{ tournament.occupiedSlots }})</h2>
        
        <div v-if="tournament.participants.length === 0" class="no-participants">
          <p>Пока никто не зарегистрировался на турнир</p>
        </div>
        
        <div v-else class="participants-grid">
          <div 
            v-for="participant in tournament.participants" 
            :key="participant.id"
            class="participant-card"
          >
            <div class="participant-avatar">
              <img v-if="participant.photo_url" :src="participant.photo_url" :alt="participant.first_name">
              <span v-else class="avatar-fallback">{{ participant.first_name?.[0] || 'U' }}</span>
            </div>
            <div class="participant-info">
              <div class="participant-name">
                {{ participant.first_name }} {{ participant.last_name }}
              </div>
              <div v-if="participant.username" class="participant-username">
                @{{ participant.username }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Информация о турнире -->
      <div class="tournament-info">
        <h2>Информация</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Дата и время</div>
            <div class="info-value">{{ formatDateTime(tournament.tournamentDate) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Формат</div>
            <div class="info-value">Парный турнир</div>
          </div>
          <div class="info-item">
            <div class="info-label">Статус</div>
            <div class="info-value">
              <span class="status-badge" :class="getStatusClass(tournament.status)">
                {{ getStatusText(tournament.status) }}
              </span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">Организатор</div>
            <div class="info-value">
              {{ tournament.creator?.first_name }} {{ tournament.creator?.last_name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Уведомления -->
      <div v-if="notification.show" class="notification" :class="notification.type">
        {{ notification.message }}
      </div>
    </div>

    <!-- Нижняя панель с кнопкой -->
    <div v-if="tournament && authStore.isAuthenticated && authStore.user?.registrationCompleted" class="bottom-actions">
      <button 
        v-if="!isUserRegistered"
        @click="registerForTournament"
        :disabled="tournament.isFullyBooked || isRegistering"
        class="action-button primary"
      >
        {{ isRegistering ? 'Регистрация...' : tournament.isFullyBooked ? 'Нет свободных мест' : 'Участвовать' }}
      </button>
      
      <button 
        v-else
        @click="unregisterFromTournament"
        :disabled="isRegistering"
        class="action-button secondary"
      >
        {{ isRegistering ? 'Отмена...' : 'Отменить участие' }}
      </button>
    </div>

    <!-- Сообщение для неавторизованных -->
    <div v-else-if="tournament && !authStore.isAuthenticated" class="bottom-actions">
      <div class="auth-message">
        <p>Войдите в систему для участия в турнире</p>
        <button @click="$router.push('/')" class="action-button primary">
          Войти
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Loading from '@/components/ui/Loading.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const tournament = ref(null)
const isLoading = ref(true)
const error = ref(null)
const isRegistering = ref(false)
const notification = ref({
  show: false,
  message: '',
  type: ''
})

const isUserRegistered = computed(() => {
  if (!authStore.user || !tournament.value) return false
  return tournament.value.participants.some(p => p.id === authStore.user.id)
})

// Показать уведомление
const showNotification = (message, type = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Загрузка данных турнира
const loadTournament = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    console.log('Loading tournament with ID:', route.params.id)
    
    const response = await fetch(`/api/tournaments/${route.params.id}`)
    if (!response.ok) {
      throw new Error('Турнир не найден')
    }
    
    tournament.value = await response.json()
    console.log('Tournament loaded:', tournament.value)
  } catch (err) {
    console.error('Error loading tournament:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Регистрация на турнир
const registerForTournament = async () => {
  try {
    isRegistering.value = true
    
    console.log('Registering for tournament:', route.params.id)
    
    const response = await fetch(`/api/tournaments/${route.params.id}/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Ошибка при регистрации')
    }
    
    const result = await response.json()
    console.log('Registration successful:', result)
    
    await loadTournament()
    showNotification('Вы зарегистрированы на турнир')
  } catch (err) {
    console.error('Error registering:', err)
    showNotification(err.message, 'error')
  } finally {
    isRegistering.value = false
  }
}

// Отмена регистрации
const unregisterFromTournament = async () => {
  try {
    isRegistering.value = true
    
    console.log('Unregistering from tournament:', route.params.id)
    
    const response = await fetch(`/api/tournaments/${route.params.id}/register`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Ошибка при отмене регистрации')
    }
    
    const result = await response.json()
    console.log('Unregistration successful:', result)
    
    await loadTournament()
    showNotification('Регистрация отменена')
  } catch (err) {
    console.error('Error unregistering:', err)
    showNotification(err.message, 'error')
  } finally {
    isRegistering.value = false
  }
}

// Утилиты форматирования
const formatDate = (dateString) => {
  try {
    let date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else if (dateString.includes(' ')) {
      const [datePart, timePart] = dateString.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      date = new Date(year, month - 1, day, hour, minute);
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date in formatDate:', dateString);
      return 'Неверная дата';
    }
    
    return date.toLocaleDateString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'long'
    }).toUpperCase();
  } catch (error) {
    console.error('Error in formatDate:', error, dateString);
    return 'Ошибка даты';
  }
}

const formatDateTime = (dateString) => {
  try {
    let date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else if (dateString.includes(' ')) {
      const [datePart, timePart] = dateString.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      date = new Date(year, month - 1, day, hour, minute);
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date in formatDateTime:', dateString);
      return 'Неверная дата и время';
    }
    
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error in formatDateTime:', error, dateString);
    return 'Ошибка даты и времени';
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'upcoming': return 'status-upcoming'
    case 'active': return 'status-active'
    case 'completed': return 'status-completed'
    case 'cancelled': return 'status-cancelled'
    default: return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'upcoming': return 'Ожидается'
    case 'active': return 'Активный'
    case 'completed': return 'Завершен'
    case 'cancelled': return 'Отменен'
    default: return status
  }
}

onMounted(() => {
  loadTournament()
})
</script>

<style scoped>
.tournament-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px 140px 16px;
}

.tournament-header {
  text-align: center;
  padding: 32px 0;
  border-bottom: 1px solid #eee;
}

.tournament-date {
  color: #007acc;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
}

.tournament-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.tournament-description {
  color: #666;
  font-size: 16px;
}

.tournament-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid #eee;
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.stat-number {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

.participants-section {
  padding: 32px 0;
  border-bottom: 1px solid #eee;
}

.participants-section h2 {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
}

.no-participants {
  text-align: center;
  color: #666;
  padding: 40px 20px;
}

.participants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.participant-card {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.participant-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.participant-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  font-size: 16px;
  font-weight: 500;
  color: #666;
}

.participant-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
}

.participant-username {
  font-size: 12px;
  color: #666;
}

.tournament-info {
  padding: 32px 0;
}

.tournament-info h2 {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-size: 14px;
}

.info-value {
  font-weight: 500;
  color: #333;
  text-align: right;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-upcoming {
  background: #e3f2fd;
  color: #1976d2;
}

.status-active {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-completed {
  background: #f5f5f5;
  color: #616161;
}

.status-cancelled {
  background: #ffebee;
  color: #d32f2f;
}

.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1001;
}

.notification.error {
  background: #d32f2f;
}

.bottom-actions {
  position: fixed;
  bottom: 56px;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #eee;
  padding: 16px;
  z-index: 50;
}

.action-button {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}

.action-button.primary {
  background: #007acc;
  color: white;
}

.action-button.primary:hover:not(:disabled) {
  background: #005fa3;
}

.action-button.primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.action-button.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.action-button.secondary:hover:not(:disabled) {
  background: #e9ecef;
}

.auth-message {
  text-align: center;
}

.auth-message p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

@media (max-width: 600px) {
  .tournament-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  .stat-card {
    padding: 12px;
  }
  
  .stat-number {
    font-size: 18px;
  }
  
  .participants-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  .tournament-container {
    padding: 0 16px 140px 16px;
  }
}
</style>