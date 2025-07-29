<template>
  <section style="width:100%;max-width:340px;margin:0 auto;">
    <h1>Профиль</h1>
    
    <div v-if="authStore.isAuthenticated" style="text-align:center;">
      <div style="margin:24px 0;">
        <div style="width:80px;height:80px;border-radius:50%;background:#f2f3f5;margin:0 auto 16px;overflow:hidden;">
          <img v-if="authStore.user?.photo_url" :src="authStore.user.photo_url" :alt="authStore.user?.first_name" style="width:100%;height:100%;object-fit:cover;">
          <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px;color:#666;">
            {{ authStore.user?.first_name?.[0] || 'U' }}
          </div>
        </div>
        <div style="font-size:18px;font-weight:500;margin-bottom:4px;">{{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</div>
        <div style="color:#666;font-size:14px;" v-if="authStore.user?.username">@{{ authStore.user.username }}</div>
        <div v-if="isManager" style="color:#999;font-size:12px;margin-top:8px;">{{ getRoleText(authStore.user?.role) }}</div>
      </div>

      <!-- Секция управления для менеджеров -->
      <div v-if="isManager" class="manager-section">
        <div class="menu-item" @click="showCreateTournament = true">
          <span>Создать турнир</span>
        </div>
        <div class="menu-item" @click="viewTournaments">
          <span>Управление турнирами</span>
        </div>
      </div>
      
      <button class="logout-btn" @click="handleLogout">Выйти</button>
    </div>
    
    <div v-else style="text-align:center;color:#666;padding:32px 0;">
      Войдите, чтобы увидеть свой профиль
    </div>

    <!-- Модальное окно создания турнира -->
    <Modal 
      :show="showCreateTournament" 
      title="Создание турнира"
      @close="showCreateTournament = false"
    >
      <form @submit.prevent="createTournament" class="tournament-form">
        <div class="form-group">
          <label for="tournamentName">Название турнира</label>
          <input 
            type="text" 
            id="tournamentName"
            v-model="tournamentForm.name"
            required
            class="form-input"
            placeholder="Введите название турнира"
          />
        </div>
        
        <div class="datetime-group">
          <div class="form-group">
            <label for="tournamentDate">Дата</label>
            <input 
              type="date" 
              id="tournamentDate"
              v-model="tournamentForm.date"
              required
              class="form-input"
              :min="minDate"
            />
          </div>
          
          <div class="form-group">
            <label for="tournamentTime">Время</label>
            <input 
              type="time" 
              id="tournamentTime"
              v-model="tournamentForm.time"
              required
              class="form-input"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="pairsCount">Количество пар</label>
          <input 
            type="number" 
            id="pairsCount"
            v-model.number="tournamentForm.pairsCount"
            required
            min="2"
            max="16"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="description">Описание (необязательно)</label>
          <textarea 
            id="description"
            v-model="tournamentForm.description"
            rows="3"
            class="form-input"
            placeholder="Дополнительная информация о турнире"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="isCreatingTournament"
          >
            {{ isCreatingTournament ? 'Создание...' : 'Создать' }}
          </button>
          <button 
            type="button"
            class="btn btn-secondary" 
            @click="showCreateTournament = false"
          >
            Отмена
          </button>
        </div>
      </form>
    </Modal>

    <!-- Простое уведомление -->
    <div v-if="notification.show" class="notification">
      {{ notification.message }}
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Modal from '@/components/ui/Modal.vue'

const authStore = useAuthStore()
const router = useRouter()

const isManager = computed(() => ['admin', 'manager'].includes(authStore.user?.role))

const showCreateTournament = ref(false)
const isCreatingTournament = ref(false)

const tournamentForm = ref({
  name: '',
  date: '',
  time: '14:00',
  pairsCount: 8,
  description: ''
})

const notification = ref({
  show: false,
  message: ''
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const getRoleText = (role) => {
  const roleMap = {
    'admin': 'Администратор',
    'manager': 'Менеджер'
  }
  return roleMap[role] || ''
}

const viewTournaments = () => {
  router.push('/tournaments')
}

const showNotification = (message) => {
  notification.value = {
    show: true,
    message
  }
  
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const resetForm = () => {
  tournamentForm.value = {
    name: '',
    date: '',
    time: '14:00',
    pairsCount: 8,
    description: ''
  }
}

const createTournament = async () => {
  if (isCreatingTournament.value) return
  
  try {
    isCreatingTournament.value = true

    const tournamentData = {
      name: tournamentForm.value.name,
      tournamentDate: tournamentForm.value.date,
      tournamentTime: tournamentForm.value.time,
      pairsCount: tournamentForm.value.pairsCount,
      description: tournamentForm.value.description
    }

    const response = await fetch('/api/admin/tournaments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(tournamentData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Ошибка при создании турнира')
    }

    showCreateTournament.value = false
    resetForm()
    showNotification('Турнир создан')
    
  } catch (err) {
    console.error('Error creating tournament:', err)
    showNotification('Ошибка при создании турнира')
  } finally {
    isCreatingTournament.value = false
  }
}

onMounted(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tournamentForm.value.date = tomorrow.toISOString().split('T')[0]
})
</script>

<style scoped>
.manager-section {
  margin: 24px 0;
}

.menu-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s;
  text-align: left;
}

.menu-item:last-child {
  margin-bottom: 0;
}

.menu-item:hover {
  background: #e9ecef;
}

.menu-item span {
  font-size: 16px;
  color: #333;
}

.logout-btn {
  background: none;
  border: 1px solid #ddd;
  color: #666;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 24px;
  transition: all 0.15s;
}

.logout-btn:hover {
  background: #f8f9fa;
  border-color: #ccc;
}

/* Стили формы */
.tournament-form {
  max-width: none;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #007acc;
}

.form-input::placeholder {
  color: #999;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
  line-height: 1.4;
}

.datetime-group {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.datetime-group .form-group {
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  flex: 1;
}

.btn-primary {
  background: #007acc;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #005fa3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e9ecef;
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

/* Мобильная адаптивность */
@media (max-width: 768px) {
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
  .form-input {
    font-size: 16px;
  }
}
</style>