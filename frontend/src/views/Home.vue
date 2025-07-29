<template>
  <section class="home-container">
    <!-- Заголовок -->
    <div class="page-header">
      <h1>Турниры и тренировки по паделу</h1>
      <p class="page-subtitle">
        Присоединяйтесь к нашим турнирам и станьте частью 
        падел-сообщества! Участвуйте в захватывающих матчах и 
        наслаждайтесь динамикой спорта вместе с другими 
        фанатами игры в падел.
      </p>
    </div>

    <!-- Авторизация -->
    <div v-if="!authStore.isAuthenticated" class="auth-section">
      <Button variant="primary" @click="showLoginModal = true">
        Войти через Telegram
      </Button>
    </div>
    
    <!-- Для неавторизованных пользователей тоже показываем турниры -->
    <template v-else>
      <!-- Показываем кнопку завершения регистрации если не завершена -->
      <div v-if="!authStore.user?.registrationCompleted" class="registration-prompt">
        <p>Завершите регистрацию для участия в турнирах</p>
        <Button variant="primary" @click="showRegistrationModal = true">
          Завершить регистрацию
        </Button>
      </div>
    </template>

    <!-- Секция турниров -->
    <div class="tournaments-section">
      <div class="section-header">
        <h2>{{ upcomingTournaments.length }} турниров</h2>
        <div class="filters">
          <button class="filter-btn active">Показать ближайшие</button>
        </div>
      </div>

      <Loading v-if="isLoadingTournaments" text="Загрузка турниров..." />
      
      <ErrorAlert v-else-if="tournamentsError" :error="tournamentsError" />
      
      <div v-else-if="upcomingTournaments.length === 0" class="no-tournaments">
        <p>Нет запланированных турниров</p>
      </div>
      
      <div v-else class="tournaments-list">
        <div 
          v-for="tournament in upcomingTournaments" 
          :key="tournament.id"
          class="tournament-card"
          @click="goToTournament(tournament.id)"
        >
          <div class="tournament-time">
            {{ formatTournamentTime(tournament.tournamentDate) }}
          </div>
          
          <div class="tournament-content">
            <h3 class="tournament-name">{{ tournament.name }}</h3>
            <div class="tournament-details">
              <span>{{ tournament.description || 'Турнир' }}</span>
              <span>•</span>
              <span>{{ getStatusText(tournament.status) }}</span>
              <span v-if="tournament.availableSlots <= 3" class="limited-spots">
                • осталось {{ tournament.availableSlots }}
                <svg width="12" height="12" fill="#dc2626" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
              </span>
            </div>
          </div>
          
          <div class="tournament-participants">
            <div class="participants-avatars">
              <div 
                v-for="(participant, index) in tournament.participants.slice(0, 3)" 
                :key="participant.id"
                class="participant-avatar"
                :style="{ zIndex: 3 - index }"
              >
                <img v-if="participant.photo_url" :src="participant.photo_url" :alt="participant.first_name">
                <span v-else class="avatar-fallback">{{ participant.first_name?.[0] || 'U' }}</span>
              </div>
            </div>
            <div class="participants-count">{{ tournament.occupiedSlots }}/{{ tournament.totalSlots }} игроков</div>
          </div>
        </div>
      </div>
    </div>

    <LoginModal 
      :show="showLoginModal"
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
    />

    <RegistrationModal
      :show="showRegistrationModal"
      @completed="handleRegistrationCompleted"
      @close="showRegistrationModal = false"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import LoginModal from '@/components/auth/LoginModal.vue'
import RegistrationModal from '@/components/auth/RegistrationModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const showLoginModal = ref(false)
const showRegistrationModal = ref(false)

// Состояние турниров
const upcomingTournaments = ref([])
const isLoadingTournaments = ref(false)
const tournamentsError = ref(null)

// Загрузка турниров
const loadTournaments = async () => {
  try {
    isLoadingTournaments.value = true
    tournamentsError.value = null
    
    const response = await fetch('/api/tournaments/upcoming')
    if (!response.ok) {
      throw new Error('Ошибка при загрузке турниров')
    }
    
    upcomingTournaments.value = await response.json()
  } catch (error) {
    console.error('Error loading tournaments:', error)
    tournamentsError.value = 'Не удалось загрузить турниры'
  } finally {
    isLoadingTournaments.value = false
  }
}

// Переход к турниру
const goToTournament = (tournamentId) => {
  router.push(`/tournament/${tournamentId}`)
}

// Форматирование времени турнира
const formatTournamentTime = (dateString) => {
  try {
    // Создаем дату более безопасным способом
    let date;
    if (dateString.includes('T')) {
      // ISO формат
      date = new Date(dateString);
    } else if (dateString.includes(' ')) {
      // MySQL формат "YYYY-MM-DD HH:MM:SS"
      const [datePart, timePart] = dateString.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      date = new Date(year, month - 1, day, hour, minute);
    } else {
      date = new Date(dateString);
    }
    
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Неверная дата';
    }
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase();
    const dayNumber = date.getDate();
    const month = date.toLocaleDateString('ru-RU', { month: 'short' }).toUpperCase();
    const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    return `${dayName} • ${dayNumber} ${month} • ${time}`;
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return 'Ошибка даты';
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'upcoming': return 'Открытый'
    case 'active': return 'Активный'
    case 'completed': return 'Завершен'
    case 'cancelled': return 'Отменен'
    default: return 'Открытый'
  }
}

const handleLoginSuccess = () => {
  showLoginModal.value = false
  if (authStore.user && !authStore.user.registrationCompleted) {
    setTimeout(() => {
      showRegistrationModal.value = true
    }, 500)
  }
}

const handleRegistrationCompleted = () => {
  showRegistrationModal.value = false
}

onMounted(() => {
  loadTournaments()
})
</script>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
}

.page-header {
  padding: 32px 0;
  text-align: left;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.auth-section {
  padding: 24px 0;
  text-align: center;
}

.registration-prompt {
  text-align: center;
  padding: 20px;
  background: #fef3c7;
  border-radius: 12px;
  border: 1px solid #f59e0b;
  margin-bottom: 32px;
}

.registration-prompt p {
  margin-bottom: 16px;
  color: #92400e;
}

.tournaments-section {
  padding: 24px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.filters {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: white;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #1f2937;
  color: white;
  border-color: #1f2937;
}

.no-tournaments {
  text-align: center;
  color: #6b7280;
  padding: 60px 20px;
}

.tournaments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tournament-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s;
}

.tournament-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.tournament-time {
  font-size: 14px;
  color: #6366f1;
  font-weight: 500;
  margin-bottom: 8px;
}

.tournament-content {
  margin-bottom: 16px;
}

.tournament-name {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.tournament-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.limited-spots {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #dc2626;
  font-weight: 500;
}

.tournament-participants {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.participants-avatars {
  display: flex;
  margin-left: -8px;
}

.participant-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  margin-left: -8px;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.participant-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}

.participants-count {
  font-size: 14px;
  color: #6b7280;
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 28px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .tournament-card {
    padding: 16px;
  }
}
</style>