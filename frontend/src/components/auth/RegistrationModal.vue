<template>
    <Modal :show="show" title="Завершение регистрации" :close-on-overlay="false">
      <div class="registration-form">
        <p class="welcome-text">
          Добро пожаловать в PadelTech! Для завершения регистрации укажите ваш уровень игры и пол.
        </p>
        
        <ErrorAlert :error="error" />
        
        <form @submit.prevent="handleSubmit" v-if="!isLoading">
          <div class="form-group">
            <label>Ваш уровень игры</label>
            <div class="level-options">
              <label class="option-card" :class="{ active: selectedLevel === 'D' }">
                <input type="radio" v-model="selectedLevel" value="D" />
                <div class="option-content">
                  <div class="option-title">Начальный</div>
                  <div class="option-description">Новичок в падел теннисе</div>
                </div>
              </label>
              
              <label class="option-card" :class="{ active: selectedLevel === 'C' }">
                <input type="radio" v-model="selectedLevel" value="C" />
                <div class="option-content">
                  <div class="option-title">Средний</div>
                  <div class="option-description">Играю несколько месяцев</div>
                </div>
              </label>
              
              <label class="option-card" :class="{ active: selectedLevel === 'B' }">
                <input type="radio" v-model="selectedLevel" value="B" />
                <div class="option-content">
                  <div class="option-title">Опытный</div>
                  <div class="option-description">Играю более года</div>
                </div>
              </label>
            </div>
          </div>
  
          <div class="form-group">
            <label>Пол</label>
            <div class="gender-options">
              <label class="option-card" :class="{ active: selectedGender === 'male' }">
                <input type="radio" v-model="selectedGender" value="male" />
                <div class="option-content">
                  <div class="option-title">Мужской</div>
                </div>
              </label>
              
              <label class="option-card" :class="{ active: selectedGender === 'female' }">
                <input type="radio" v-model="selectedGender" value="female" />
                <div class="option-content">
                  <div class="option-title">Женский</div>
                </div>
              </label>
            </div>
          </div>
  
          <Button 
            type="submit" 
            variant="primary"
            :disabled="!selectedLevel || !selectedGender"
          >
            Завершить регистрацию
          </Button>
        </form>
        
        <Loading v-else text="Сохраняем ваши данные..." />
      </div>
    </Modal>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Modal from '@/components/ui/Modal.vue'
  import Button from '@/components/ui/Button.vue'
  import Loading from '@/components/ui/Loading.vue'
  import ErrorAlert from '@/components/ui/ErrorAlert.vue'
  import { useAuthStore } from '@/stores/auth'
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['completed', 'error'])
  
  const authStore = useAuthStore()
  const selectedLevel = ref('')
  const selectedGender = ref('')
  const isLoading = ref(false)
  const error = ref(null)
  
  const handleSubmit = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const result = await authStore.completeRegistration({
        level: selectedLevel.value,
        gender: selectedGender.value
      })
      
      if (result.success) {
        emit('completed')
      } else {
        error.value = result.error || 'Ошибка при завершении регистрации'
      }
    } catch (err) {
      error.value = err.message || 'Ошибка при завершении регистрации'
      emit('error', error.value)
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  .registration-form {
    padding: 8px;
  }
  
  .welcome-text {
    text-align: center;
    color: #666;
    margin-bottom: 24px;
    line-height: 1.5;
  }
  
  .form-group {
    margin-bottom: 24px;
  }
  
  .form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 12px;
    color: #222;
  }
  
  .level-options,
  .gender-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .option-card {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 2px solid #eee;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.15s;
    background: white;
  }
  
  .option-card:hover {
    border-color: #1976d2;
    background: #f8f9ff;
  }
  
  .option-card.active {
    border-color: #1976d2;
    background: #f8f9ff;
  }
  
  .option-card input[type="radio"] {
    margin-right: 12px;
    transform: scale(1.2);
  }
  
  .option-content {
    flex: 1;
  }
  
  .option-title {
    font-weight: 500;
    color: #222;
    margin-bottom: 2px;
  }
  
  .option-description {
    font-size: 14px;
    color: #666;
  }
  
  .gender-options {
    flex-direction: row;
    gap: 12px;
  }
  
  .gender-options .option-card {
    flex: 1;
    justify-content: center;
    text-align: center;
  }
  
  @media (max-width: 600px) {
    .gender-options {
      flex-direction: column;
    }
  }
  </style>