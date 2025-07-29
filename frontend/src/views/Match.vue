<template>
  <div class="match-container">
    <h1>Быстрая игра</h1>
    <p class="subtitle">Американо — минимум настроек, максимум игры</p>

    <form @submit.prevent="handleSubmit" class="match-form">
      <div class="form-group">
        <label for="matchName">Название игры</label>
        <input 
          type="text" 
          id="matchName" 
          v-model="matchData.name" 
          placeholder="Введите название игры"
          class="match-input"
          required
        />
      </div>

      <PlayersManager
        ref="playersManager"
        :players="matchData.players"
        @update:players="matchData.players = $event"
        :min-players="4"
        :max-players="24"
      />

      <CourtSelector v-model="matchData.selectedCourt" />

      <div class="form-group">
        <label for="maxPoints">Максимальное количество очков за сет</label>
        <input 
          type="number" 
          id="maxPoints" 
          v-model.number="matchData.maxPoints" 
          min="8"
          max="40"
          class="match-input"
          required
        />
        <span class="field-hint">От 8 до 40 очков</span>
      </div>

      <Button 
        type="submit" 
        variant="primary"
        :disabled="!isFormValid || isLoading"
        class="submit-btn"
      >
        {{ isLoading ? 'Создаем игру...' : 'Начать игру американо' }}
      </Button>
    </form>

    <!-- Отображение ошибок -->
    <ErrorAlert v-if="error" :error="error" />

    <!-- Модальное окно входа (опционально) -->
    <LoginModal 
      :show="showLoginModal"
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
    />

    <Loading v-if="isLoading" text="Создаем вашу игру американо..." overlay />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import PlayersManager from '@/components/match/PlayersManager.vue'
import CourtSelector from '@/components/match/CourtSelector.vue'
import LoginModal from '@/components/auth/LoginModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref(null)
const playersManager = ref(null)
const showLoginModal = ref(false)

const matchData = ref({
  name: '',
  players: ['', '', '', '', '', ''], // 6 игроков по умолчанию
  selectedCourt: null,
  maxPoints: 21
})

const isFormValid = computed(() => {
  const hasValidPlayers = playersManager.value?.isValidPlayerCount &&
                         matchData.value.players.every(p => p.trim())
  
  return matchData.value.name &&
         hasValidPlayers &&
         matchData.value.selectedCourt &&
         matchData.value.maxPoints >= 8 &&
         matchData.value.maxPoints <= 40
})

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  try {
    isLoading.value = true
    error.value = null
    
    console.log('🎮 Creating americano game...', {
      name: matchData.value.name,
      players: matchData.value.players.filter(p => p.trim()),
      courtNumber: matchData.value.selectedCourt,
      maxPoints: matchData.value.maxPoints
    })
    
    // Отправляем запрос на создание американо
    const response = await fetch('/api/matches/americano', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Добавляем токен если есть
        ...(authStore.token && { 'Authorization': `Bearer ${authStore.token}` })
      },
      body: JSON.stringify({
        name: matchData.value.name,
        players: matchData.value.players.filter(p => p.trim()),
        courtNumber: matchData.value.selectedCourt,
        maxPoints: matchData.value.maxPoints
      })
    })

    console.log('📡 Response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Неизвестная ошибка' }))
      throw new Error(errorData.error || `Ошибка ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ Game created successfully:', result)
    
    // Переходим на страницу игры
    router.push(`/fast-match/${result.gameId}?round=1`)
  } catch (err) {
    console.error('❌ Error creating game:', err)
    error.value = err.message || 'Ошибка при создании игры'
  } finally {
    isLoading.value = false
  }
}

const handleLoginSuccess = () => {
  showLoginModal.value = false
  error.value = null
}
</script>
<style scoped>
.match-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.auth-required,
.registration-required {
  text-align: center;
  padding: 40px 20px;
}

.auth-required h2,
.registration-required h2 {
  margin-bottom: 16px;
  color: #333;
}

.auth-required p,
.registration-required p {
  margin-bottom: 24px;
  color: #666;
}

.subtitle {
  color: #666;
  margin-bottom: 32px;
  text-align: center;
  font-size: 16px;
}

.match-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #222;
  font-size: 16px;
}

.match-input {
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.15s;
}

.match-input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.field-hint {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.submit-btn {
  margin-top: 20px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 600px) {
  .match-container {
    padding: 16px 8px;
  }
  
  .match-form {
    gap: 24px;
  }
  
  .auth-required,
  .registration-required {
    padding: 32px 16px;
  }
}
</style>