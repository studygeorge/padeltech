<template>
  <div class="level-basic-container" :class="{ 'mobile': isMobile, 'desktop': !isMobile }">
    <!-- ОСНОВНОЕ ЗАДАНИЕ -->
    <div class="level-question-text" :class="{ 'mobile-question': isMobile, 'desktop-question': !isMobile }">
      {{ task.problem }}
    </div>
    
    <div class="level-options-container" :class="{ 'mobile-options': isMobile, 'desktop-options': !isMobile }">
      <button 
        v-for="option in task.options" 
        :key="`level1-${option}-${attemptCount}`"
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
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'

export default {
  name: 'Level1Basic',
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
  emits: ['task-completed'],
  setup(props, { emit }) {
    const answered = ref(false)
    const selectedAnswer = ref('')
    const isCorrectAnswer = ref(false)
    
    const task = computed(() => ({
      problem: "Let's buy this shiny collar and some food. Can you pay for me, please? I don't know how many coins do we need…",
      options: generateOptions(6, 3),
      correctAnswer: 6
    }))
    
    const generateOptions = (correctAnswer, optionsCount = 3) => {
      const options = [correctAnswer]
      
      const wrongAnswers = [5, 7]
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
      
      console.log('Level1: Ответ выбран -', answer, 'правильный:', isCorrectAnswer.value)
      
      emit('task-completed', isCorrectAnswer.value, answer)
    }
    
    const resetTask = () => {
      answered.value = false
      selectedAnswer.value = ''
      isCorrectAnswer.value = false
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
      checkAnswer,
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
  margin: 0;
  
  &.mobile-question {
    font-size: 16px;
    line-height: 1.2;
    max-width: 320px;
    color: rgba(255, 255, 255, 0.92);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
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
    
    &:not(.correct):not(.incorrect) {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@media (max-width: 360px) {
  .level-basic-container.mobile {
    gap: 6px;
  }
  
  .level-question-text.mobile-question {
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
}

@media (max-height: 600px) {
  .level-basic-container.mobile {
    gap: 5px;
  }
  
  .level-question-text.mobile-question {
    font-size: 14px;
  }
  
  .level-option-button.mobile-option {
    min-height: 32px;
    font-size: 12px;
    padding: 6px 4px;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .level-basic-container.mobile {
    gap: 4px;
  }
  
  .level-question-text.mobile-question {
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
}

@media (min-height: 800px) and (max-width: 768px) {
  .level-basic-container.mobile {
    gap: 10px;
  }
  
  .level-question-text.mobile-question {
    font-size: 18px;
    max-width: 350px;
  }
  
  .level-option-button.mobile-option {
    font-size: 16px;
    min-height: 40px;
    padding: 10px 8px;
  }
}
</style>
