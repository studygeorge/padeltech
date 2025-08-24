<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop :class="{ 'mobile-modal': isMobile }">
        <div class="success-animation">
          <div class="checkmark">✓</div>
        </div>
        
        <h2 class="success-title">Отлично!</h2>
        <p class="success-message">
          Задание {{ completedTasks }}/6 выполнено
        </p>
        <p class="level-message" v-if="!isGameCompleted">
          Следующее задание: {{ currentTask }}
        </p>
        <p class="level-message completion-message" v-else>
          🎉 Все задания завершены! Печенье готово!
        </p>
        
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        
        <div class="modal-buttons">
          <AppButton 
            v-if="!isGameCompleted"
            type="primary" 
            :fullWidth="isMobile"
            @click="continueAdventure"
          >
            Продолжить историю
          </AppButton>
          
          <AppButton 
            v-if="isGameCompleted"
            type="accent" 
            :fullWidth="isMobile"
            @click="viewRewards"
          >
            Посмотреть награды
          </AppButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AppButton from '@/components/common/AppButton.vue'
import { getDeviceType } from '@/utils/responsive'

export default {
  name: 'SuccessModal',
  components: {
    AppButton
  },
  props: {
    completedTasks: {
      type: Number,
      default: 0
    }
  },
  emits: ['close', 'continue-adventure', 'view-rewards'],
  setup(props, { emit }) {
    const store = useStore()
    
    const isMobile = computed(() => {
      const deviceType = getDeviceType()
      return deviceType === 'mobile' || deviceType === 'tablet'
    })
    
    // ИСПРАВЛЕНО: Используем currentTask вместо currentLevel
    const currentTask = computed(() => store.getters.currentTask || 1)
    
    // ИСПРАВЛЕНО: Прогресс от 0 до 100% для 6 заданий
    const progressPercentage = computed(() => {
      return (props.completedTasks / 6) * 100
    })
    
    // ИСПРАВЛЕНО: Проверка завершения игры
    const isGameCompleted = computed(() => {
      return props.completedTasks >= 6
    })
    
    const closeModal = () => {
      console.log('SuccessModal: closeModal called')
      emit('close')
    }
    
    const continueAdventure = () => {
      console.log('SuccessModal: continueAdventure called')
      emit('continue-adventure')
    }
    
    const viewRewards = () => {
      console.log('SuccessModal: viewRewards called')
      emit('view-rewards')
    }
    
    return {
      isMobile,
      currentTask, // ИСПРАВЛЕНО
      progressPercentage,
      isGameCompleted, // ИСПРАВЛЕНО
      closeModal,
      continueAdventure,
      viewRewards
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: $spacing-medium;
}

.modal-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: $spacing-xxl;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 450px;
  width: 100%;
  
  &.mobile-modal {
    padding: $spacing-large;
    max-width: 90%;
    border-radius: 20px;
  }
}

.success-animation {
  margin-bottom: $spacing-large;
  
  .checkmark {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, $success-color 0%, #2ecc71 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5em;
    color: white;
    margin: 0 auto;
    animation: checkmarkPulse 0.6s ease-out;
    box-shadow: 0 8px 25px rgba($success-color, 0.4);
    
    @media (max-width: $breakpoint-mobile) {
      width: 60px;
      height: 60px;
      font-size: 2em;
    }
  }
}

.success-title {
  font-size: 2.2em;
  font-weight: 800;
  color: $primary-color;
  margin-bottom: $spacing-small;
  font-family: $font-family-display;
  
  @media (max-width: $breakpoint-mobile) {
    font-size: 1.8em;
  }
}

.success-message {
  font-size: 1.1em;
  color: $text-color;
  margin-bottom: $spacing-medium;
  opacity: 0.8;
  
  @media (max-width: $breakpoint-mobile) {
    font-size: 1em;
    margin-bottom: $spacing-small;
  }
}

.level-message {
  font-size: 0.9em;
  color: $secondary-color;
  margin-bottom: $spacing-large;
  font-weight: 600;
  
  // ИСПРАВЛЕНО: Стиль для сообщения о завершении
  &.completion-message {
    color: $success-color;
    font-size: 1em;
    font-weight: 700;
  }
  
  @media (max-width: $breakpoint-mobile) {
    font-size: 0.8em;
    margin-bottom: $spacing-medium;
    
    &.completion-message {
      font-size: 0.9em;
    }
  }
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba($primary-color, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: $spacing-large;
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, $primary-color 0%, $secondary-color 100%);
    border-radius: 4px;
    transition: width 0.8s ease-out;
  }
  
  @media (max-width: $breakpoint-mobile) {
    height: 6px;
    margin-bottom: $spacing-medium;
  }
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: $spacing-medium;
  
  @media (min-width: $breakpoint-md) {
    flex-direction: row;
    justify-content: center;
    
    .btn {
      min-width: 160px;
    }
  }
  
  @media (max-width: $breakpoint-mobile) {
    gap: $spacing-small;
  }
}

// Анимации
@keyframes checkmarkPulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-enter-active {
  transition: all 0.3s ease;
}

.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>