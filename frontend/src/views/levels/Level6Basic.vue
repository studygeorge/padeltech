
<template>
  <div class="level-basic-container" :class="{ 'mobile': isMobile, 'desktop': !isMobile }">
    
    <!-- ОБЫЧНОЕ ЗАДАНИЕ -->
    <template v-if="!showCompletionScreen">
      <div class="level-question-text" :class="{ 'mobile-question': isMobile, 'desktop-question': !isMobile }">
        {{ task.problem }}
      </div>
      
      <div class="level-options-container" :class="{ 'mobile-options': isMobile, 'desktop-options': !isMobile }">
        <button 
          v-for="option in task.options" 
          :key="`level6-${option}-${attemptCount}`"
          class="level-option-button"
          :class="{ 
            'mobile-option': isMobile, 
            'desktop-option': !isMobile,
            'selected': answered && selectedAnswer === option,
            'correct': answered && selectedAnswer === option && isCorrectAnswer,
            'incorrect': answered && selectedAnswer === option && !isCorrectAnswer,
            'disabled': !gameReady || isTransitioning
          }"
          @click="checkAnswer(option)"
          :disabled="answered || isTransitioning || !gameReady"
        >
          {{ option }}
        </button>
      </div>
    </template>
    
    <!-- ЭКРАН ЗАВЕРШЕНИЯ 6 УРОВНЯ -->
    <template v-else>
      <div class="completion-screen" :class="{ 'mobile-completion': isMobile, 'desktop-completion': !isMobile }">
        <div class="completion-message" :class="{ 'mobile-message': isMobile, 'desktop-message': !isMobile }">
          Come back later and we'll share the cookies with my friends!
        </div>
        
        <div class="completion-button-container" :class="{ 'mobile-button-container': isMobile, 'desktop-button-container': !isMobile }">
          <button 
            class="completion-button"
            :class="{ 
              'mobile-completion-btn': isMobile, 
              'desktop-completion-btn': !isMobile,
              'disabled': !completionReady
            }"
            @click="goToRewards"
            :disabled="!completionReady"
          >
            {{ completionReady ? 'Come back later' : 'Loading...' }}
          </button>
        </div>
      </div>
    </template>
    
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'

export default {
  name: 'Level6Basic',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    },
    gameReady: {
      type: Boolean,
      default: false
    },
    isTransitioning: {
      type: Boolean,
      default: false
    },
    attemptCount: {
      type: Number,
      default: 1
    }
  },
  emits: ['task-completed', 'show-completion-video', 'go-to-rewards'],
  setup(props, { emit }) {
    const answered = ref(false)
    const selectedAnswer = ref('')
    const isCorrectAnswer = ref(false)
    const showCompletionScreen = ref(false)
    const completionReady = ref(false)
    
    const task = computed(() => ({
      problem: "3 friends are coming, each needs 2 cookies. 3 × 2 = ?",
      options: generateOptions(6, 3),
      correctAnswer: 6
    }))
    
    const generateOptions = (correctAnswer, optionsCount = 3) => {
      const options = [correctAnswer]
      
      const wrongAnswers = [9, 4]
      options.push(...wrongAnswers)
      
      return options.sort(() => Math.random() - 0.5)
    }
    
    const checkAnswer = (answer) => {
      if (!props.gameReady || answered.value || props.isTransitioning) {
        return
      }
      
      selectedAnswer.value = answer
      answered.value = true
      isCorrectAnswer.value = answer === task.value.correctAnswer
      
      console.log('Level6: Ответ выбран -', answer, 'правильный:', isCorrectAnswer.value)
      
      // Если правильный ответ - показываем специальную последовательность
      if (isCorrectAnswer.value) {
        // Сначала обычный happy, потом специальное видео
        emit('task-completed', true, answer, true) // третий параметр указывает что это последний уровень
      } else {
        emit('task-completed', false, answer)
      }
    }
    
    const showCompletion = () => {
      console.log('Level6: Показываем экран завершения')
      showCompletionScreen.value = true
      completionReady.value = true
    }
    
    const goToRewards = () => {
      if (completionReady.value) {
        console.log('Level6: Переходим к наградам')
        emit('go-to-rewards')
      }
    }
    
    const resetTask = () => {
      answered.value = false
      selectedAnswer.value = ''
      isCorrectAnswer.value = false
      showCompletionScreen.value = false
      completionReady.value = false
    }
    
    watch(() => props.attemptCount, () => {
      resetTask()
    })
    
    onMounted(() => {
      resetTask()
    })
    
    return {
      task,
      answered,
      selectedAnswer,
      isCorrectAnswer,
      showCompletionScreen,
      completionReady,
      checkAnswer,
      showCompletion,
      goToRewards,
      resetTask
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.level-basic-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  
  &.desktop {
    gap: 12px;
  }
}

.level-question-text {
  text-align: center;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  margin: 0;
  
  &.mobile-question {
    font-size: 16px;
    line-height: 1.2;
    max-width: 320px;
  }
  
  &.desktop-question {
    font-size: 24px;
    line-height: 1.3;
    max-width: 450px;
    color: #2c2c2c;
    text-shadow: none;
    font-weight: 700;
  }
}

.level-options-container {
  width: 100%;
  display: flex;
  gap: 4px;
  
  &.mobile-options {
    max-width: 270px;
    justify-content: space-between;
  }
  
  &.desktop-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    max-width: 400px;
    gap: 8px;
  }
}

.level-option-button {
  border: 2px solid $primary-color;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c3e50;
  font-weight: 600;
  position: relative;
  
  &.mobile-option {
    flex: 1;
    padding: 8px 6px;
    font-size: 14px;
    min-height: 36px;
    border-radius: 8px;
  }
  
  &.desktop-option {
    padding: 8px;
    font-size: 13px;
    min-height: 36px;
    border-radius: 10px;
  }
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.95);
    border-color: darken($primary-color, 10%);
    transform: translateY(-1px);
    
    &.mobile-option {
      box-shadow: 0 2px 8px rgba($primary-color, 0.2);
    }
    
    &.desktop-option {
      box-shadow: 0 4px 16px rgba($primary-color, 0.25);
      transform: translateY(-2px);
    }
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
    
    &.desktop-option {
      transform: translateY(-1px) scale(0.98);
    }
  }
  
  &.selected {
    background: rgba(255, 255, 255, 0.95);
    border-color: darken($primary-color, 10%);
    transform: scale(1.02);
    
    &.mobile-option {
      box-shadow: 0 3px 12px rgba($primary-color, 0.25);
    }
    
    &.desktop-option {
      box-shadow: 0 6px 20px rgba($primary-color, 0.25);
      transform: scale(1.05);
    }
  }
  
  &.correct {
    background: linear-gradient(135deg, #4CAF50 0%, darken(#4CAF50, 8%) 100%) !important;
    border-color: darken(#4CAF50, 15%) !important;
    color: white !important;
    transform: scale(1.05) !important;
    
    &.mobile-option {
      box-shadow: 0 3px 12px rgba(#4CAF50, 0.35) !important;
      
      &::after {
        content: '✓';
        position: absolute;
        top: 2px;
        right: 6px;
        font-size: 14px;
        color: white;
        font-weight: 900;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
    }
    
    &.desktop-option {
      box-shadow: 0 6px 20px rgba(#4CAF50, 0.35) !important;
      transform: scale(1.08) !important;
      
      &::after {
        content: '✓';
        position: absolute;
        top: 6px;
        right: 8px;
        font-size: 14px;
        color: white;
        font-weight: 900;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
    }
  }
  
  &.incorrect {
    background: linear-gradient(135deg, #f44336 0%, darken(#f44336, 8%) 100%) !important;
    border-color: darken(#f44336, 15%) !important;
    color: white !important;
    transform: scale(1.05) !important;
    
    &.mobile-option {
      box-shadow: 0 3px 12px rgba(#f44336, 0.35) !important;
      
      &::after {
        content: '✗';
        position: absolute;
        top: 2px;
        right: 6px;
        font-size: 14px;
        color: white;
        font-weight: 900;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
    }
    
    &.desktop-option {
      box-shadow: 0 6px 20px rgba(#f44336, 0.35) !important;
      transform: scale(1.08) !important;
      
      &::after {
        content: '✗';
        position: absolute;
        top: 6px;
        right: 8px;
        font-size: 14px;
        color: white;
        font-weight: 900;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
    }
  }
  
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  &:disabled {
    cursor: default;
    opacity: 0.8;
  }
}

// СТИЛИ ДЛЯ ЭКРАНА ЗАВЕРШЕНИЯ
.completion-screen {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  &.desktop-completion {
    gap: 20px;
  }
}

.completion-message {
  text-align: center;
  font-weight: 600;
  margin: 0;
  
  &.mobile-message {
    font-size: 16px;
    line-height: 1.2;
    max-width: 320px;
    color: rgba(255, 255, 255, 0.92);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  }
  
  &.desktop-message {
    font-size: 24px;
    line-height: 1.3;
    max-width: 450px;
    color: #2c2c2c;
    text-shadow: none;
    font-weight: 700;
  }
}

.completion-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
  
  &.mobile-button-container {
    max-width: 280px;
  }
  
  &.desktop-button-container {
    max-width: 300px;
  }
}

.completion-button {
  border: 2px solid $accent-color;
  background: linear-gradient(135deg, $accent-color 0%, darken($accent-color, 8%) 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  
  &.mobile-completion-btn {
    width: 100%;
    padding: 10px 16px;
    font-size: 14px;
    min-height: 36px;
    border-radius: 18px;
  }
  
  &.desktop-completion-btn {
    width: 100%;
    min-width: 200px;
    padding: 12px 20px;
    font-size: 16px;
    min-height: 40px;
    border-radius: 20px;
  }
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, darken($accent-color, 5%) 0%, darken($accent-color, 13%) 100%);
    border-color: darken($accent-color, 10%);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba($accent-color, 0.3);
    
    &.desktop-completion-btn {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($accent-color, 0.4);
    }
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
    
    &.desktop-completion-btn {
      transform: translateY(-1px) scale(0.98);
    }
  }
  
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  &:disabled {
    cursor: default;
    opacity: 0.8;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

// МЕДИА-ЗАПРОСЫ
@media (max-width: 360px) {
  .level-basic-container.mobile {
    gap: 6px;
  }
  
  .level-question-text.mobile-question,
  .completion-message.mobile-message {
    font-size: 14px;
    max-width: 280px;
  }
  
  .level-options-container.mobile-options {
    max-width: 250px;
    gap: 3px;
  }
  
  .level-option-button.mobile-option {
    font-size: 12px;
    min-height: 32px;
    padding: 6px 4px;
  }
  
  .completion-button.mobile-completion-btn {
    font-size: 12px;
    min-height: 32px;
    padding: 8px 14px;
  }
}

@media (max-height: 600px) {
  .level-basic-container.mobile {
    gap: 5px;
  }
  
  .level-question-text.mobile-question,
  .completion-message.mobile-message {
    font-size: 14px;
  }
  
  .level-option-button.mobile-option {
    min-height: 32px;
    font-size: 12px;
    padding: 6px 4px;
  }
  
  .completion-screen.mobile-completion {
    gap: 8px;
  }
  
  .completion-button.mobile-completion-btn {
    min-height: 32px;
    font-size: 12px;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .level-basic-container.mobile {
    gap: 4px;
  }
  
  .level-question-text.mobile-question,
  .completion-message.mobile-message {
    font-size: 12px;
  }
  
  .level-option-button.mobile-option {
    min-height: 28px;
    font-size: 11px;
    border-radius: 6px;
    padding: 4px 3px;
  }
  
  .level-options-container.mobile-options {
    gap: 3px;
  }
  
  .completion-screen.mobile-completion {
    gap: 6px;
  }
  
  .completion-button.mobile-completion-btn {
    min-height: 28px;
    font-size: 11px;
    border-radius: 14px;
  }
}

@media (min-height: 800px) and (max-width: 768px) {
  .level-basic-container.mobile {
    gap: 10px;
  }
  
  .level-question-text.mobile-question,
  .completion-message.mobile-message {
    font-size: 18px;
    max-width: 350px;
  }
  
  .level-option-button.mobile-option {
    font-size: 16px;
    min-height: 40px;
    padding: 10px 8px;
  }
  
  .completion-screen.mobile-completion {
    gap: 16px;
  }
  
  .completion-button.mobile-completion-btn {
    font-size: 16px;
    min-height: 40px;
    padding: 12px 18px;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>