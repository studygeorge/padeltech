<template>
  <VideoBackground 
    :videoName="videoName" 
    @video-ready="onVideoReady"
  >
    <div 
      class="content-overlay-slide"
      :class="{ 
        'slide-up': contentVisible,
        'slide-down': !contentVisible,
        'mobile-overlay': isMobile,
        'desktop-overlay': !isMobile
      }"
    >
      <div class="math-game-content" :class="{ 'mg-mobile-layout': isMobile, 'mg-desktop-layout': !isMobile }">
        
        <!-- MOBILE VERSION -->
        <template v-if="isMobile">
          <div class="mg-mobile-content-wrapper">
            <div class="mg-progress-bar">
              <div class="mg-progress-fill" :style="{ width: `${(completedTasks / 6) * 100}%` }"></div>
              <span class="mg-progress-text">{{ completedTasks }}/6</span>
            </div>
            
            <div class="mg-content-area">
              <!-- БАЗОВЫЕ УРОВНИ С КНОПКАМИ -->
              <template v-if="!displayedTask.isInteractive">
                
                <!-- УРОВЕНЬ 1 -->
                <Level1Basic 
                  v-if="displayedTaskNumber === 1"
                  :is-mobile="isMobile"
                  :game-ready="gameReady"
                  :is-transitioning="isTransitioning"
                  :attempt-count="attemptCount"
                  @task-completed="onBasicTaskCompleted"
                />
                
                <!-- УРОВЕНЬ 2 -->
                <Level2Basic 
                  v-if="displayedTaskNumber === 2"
                  :is-mobile="isMobile"
                  :game-ready="gameReady"
                  :is-transitioning="isTransitioning"
                  :attempt-count="attemptCount"
                  @task-completed="onBasicTaskCompleted"
                />
                
                <!-- УРОВЕНЬ 6 -->
                <Level6Basic 
                  v-if="displayedTaskNumber === 6"
                  :is-mobile="isMobile"
                  :game-ready="gameReady"
                  :is-transitioning="isTransitioning"
                  :attempt-count="attemptCount"
                  @task-completed="onLevel6TaskCompleted"
                  @go-to-rewards="goToRewards"
                  ref="level6Ref"
                />
                
              </template>
              
              <!-- ИНТЕРАКТИВНЫЕ ЗАДАНИЯ -->
              <div v-else class="mg-interactive-container">
                
                <!-- ЗАДАНИЕ 3 - DRAG & DROP -->
                <Level3DragDrop 
                  v-if="displayedTask.interactiveType === 'drag_and_drop'"
                  :is-mobile="isMobile"
                  @task-completed="onInteractiveCompleted"
                  ref="dragDropRef"
                />
                
                <!-- ЗАДАНИЕ 4 - DISTRIBUTION -->
                <Level4Distribution 
                  v-if="displayedTask.interactiveType === 'distribution'"
                  :is-mobile="isMobile"
                  @task-completed="onInteractiveCompleted"
                  ref="distributionRef"
                />
                
                <!-- ЗАДАНИЕ 5 - SLIDER -->
                <Level5Slider 
                  v-if="displayedTask.interactiveType === 'slider'"
                  :is-mobile="isMobile"
                  @task-completed="onInteractiveCompleted"
                  ref="sliderRef"
                />
                
              </div>
            </div>
          </div>
        </template>
        
        <!-- DESKTOP VERSION -->
        <template v-else>
          <div class="mg-desktop-content">
            <div class="mg-progress-bar mg-desktop-progress">
              <div class="mg-progress-fill" :style="{ width: `${(completedTasks / 6) * 100}%` }"></div>
              <span class="mg-progress-text">Task {{ completedTasks }}/6</span>
            </div>
            
            <div class="mg-desktop-content-area">
              <div class="mg-content-area">
                
                <!-- БАЗОВЫЕ УРОВНИ -->
                <template v-if="!displayedTask.isInteractive">
                  
                  <!-- УРОВЕНЬ 1 -->
                  <Level1Basic 
                    v-if="displayedTaskNumber === 1"
                    :is-mobile="isMobile"
                    :game-ready="gameReady"
                    :is-transitioning="isTransitioning"
                    :attempt-count="attemptCount"
                    @task-completed="onBasicTaskCompleted"
                  />
                  
                  <!-- УРОВЕНЬ 2 -->
                  <Level2Basic 
                    v-if="displayedTaskNumber === 2"
                    :is-mobile="isMobile"
                    :game-ready="gameReady"
                    :is-transitioning="isTransitioning"
                    :attempt-count="attemptCount"
                    @task-completed="onBasicTaskCompleted"
                  />
                  
                  <!-- УРОВЕНЬ 6 -->
                  <Level6Basic 
                    v-if="displayedTaskNumber === 6"
                    :is-mobile="isMobile"
                    :game-ready="gameReady"
                    :is-transitioning="isTransitioning"
                    :attempt-count="attemptCount"
                    @task-completed="onLevel6TaskCompleted"
                    @go-to-rewards="goToRewards"
                    ref="level6Ref"
                  />
                  
                </template>
                
                <!-- ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ ДЛЯ ДЕСКТОПА -->
                <div v-else class="mg-interactive-container desktop">
                  
                  <!-- ЗАДАНИЕ 3 - DRAG & DROP -->
                  <Level3DragDrop 
                    v-if="displayedTask.interactiveType === 'drag_and_drop'"
                    :is-mobile="isMobile"
                    @task-completed="onInteractiveCompleted"
                    ref="dragDropRef"
                  />
                  
                  <!-- ЗАДАНИЕ 4 - DISTRIBUTION -->
                  <Level4Distribution 
                    v-if="displayedTask.interactiveType === 'distribution'"
                    :is-mobile="isMobile"
                    @task-completed="onInteractiveCompleted"
                    ref="distributionRef"
                  />
                  
                  <!-- ЗАДАНИЕ 5 - SLIDER -->
                  <Level5Slider 
                    v-if="displayedTask.interactiveType === 'slider'"
                    :is-mobile="isMobile"
                    @task-completed="onInteractiveCompleted"
                    ref="sliderRef"
                  />
                  
                </div>
              </div>
            </div>
          </div>
        </template>
        
      </div>
    </div>
  </VideoBackground>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { mathProblems } from '@/utils/mathProblems'
import VideoBackground from '@/components/game/VideoBackground.vue'
import { 
  Level1Basic, 
  Level2Basic, 
  Level3DragDrop, 
  Level4Distribution, 
  Level5Slider, 
  Level6Basic 
} from '@/views/levels'
import { getDeviceType } from '@/utils/responsive'

export default {
  name: 'MathGame',
  components: {
    VideoBackground,
    Level1Basic,
    Level2Basic,
    Level3DragDrop,
    Level4Distribution,
    Level5Slider,
    Level6Basic
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const answered = ref(false)
    const selectedAnswer = ref('')
    const isCorrectAnswer = ref(false)
    const gameReady = ref(false)
    const isTransitioning = ref(false)
    const contentVisible = ref(false)
    const attemptCount = ref(1)
    
    // ИСПРАВЛЕНО: отслеживание времени начала уровня
    const levelStartTime = ref(0)
    const MIN_LEVEL_DURATION = 4000 // ИЗМЕНЕНО С 10000 НА 4000 (4 секунды в миллисекундах)
    
    const displayedTaskNumber = ref(1)
    
    const dragDropRef = ref(null)
    const distributionRef = ref(null)
    const sliderRef = ref(null)
    const level6Ref = ref(null)
    
    const autoProgressTimer = ref(null)
    const contentShowTimer = ref(null)
    
    const isMobile = computed(() => {
      const deviceType = getDeviceType()
      return deviceType === 'mobile' || deviceType === 'tablet'
    })
    
    const currentTaskNumber = computed(() => store.getters.currentTaskNumber || 1)
    const completedTasks = computed(() => store.getters.completedTasks || 0)
    
    const displayedTask = computed(() => {
      const task = mathProblems[displayedTaskNumber.value]
      if (task) {
        return {
          problem: task.problem,
          options: task.isInteractive ? [] : [],
          correctAnswer: task.answer,
          isInteractive: task.isInteractive,
          interactiveType: task.interactiveType
        }
      }
      
      return {
        problem: "Fluffy has 2 + 2 coins. How many is that?",
        options: [],
        correctAnswer: 4
      }
    })
    
    const videoName = computed(() => {
      if (!answered.value) {
        return 'question'
      }
      
      return isCorrectAnswer.value ? 'happy' : 'sad'
    })
    
    // ИСПРАВЛЕНО: ФУНКЦИЯ ДЛЯ ВЫЧИСЛЕНИЯ ЗАДЕРЖКИ
    const calculateDelay = () => {
      const elapsed = Date.now() - levelStartTime.value
      const remaining = MIN_LEVEL_DURATION - elapsed
      
      if (remaining > 0) {
        console.log(`MathGame: ⏳ Осталось ждать ${remaining}ms до минимальных 4 секунд`)
        return remaining
      }
      
      console.log('MathGame: ✅ Минимальные 4 секунды прошли, переходим сразу')
      return 0
    }
    
    // ОБЫЧНЫЕ БАЗОВЫЕ ЗАДАНИЯ (1, 2)
    const onBasicTaskCompleted = (success, answer) => {
      if (!gameReady.value || answered.value || isTransitioning.value) {
        return
      }
      
      answered.value = true
      selectedAnswer.value = answer
      isCorrectAnswer.value = success
      
      console.log('MathGame: ✅ Базовое задание завершено:', success, 'ответ:', answer, 'попытка:', attemptCount.value)
      
      // Сохраняем количество попыток в store
      store.dispatch('setTaskAttempt', { 
        taskNumber: displayedTaskNumber.value, 
        attemptCount: attemptCount.value 
      })
      
      store.dispatch('setTaskResult', { 
        taskNumber: displayedTaskNumber.value, 
        success: success 
      })
      
      store.dispatch('addPoints', 10)
      
      // ИСПРАВЛЕНО: ждем минимум 4 секунды + время эмоции
      const minimumDelay = calculateDelay()
      const emotionDelay = 4500 // время эмоции
      const totalDelay = minimumDelay + emotionDelay
      
      console.log(`MathGame: 📅 Общая задержка: ${totalDelay}ms (минимум: ${minimumDelay}ms + эмоция: ${emotionDelay}ms)`)
      
      autoProgressTimer.value = setTimeout(() => {
        handleAnswer()
      }, totalDelay)
    }
    
    // СПЕЦИАЛЬНАЯ ОБРАБОТКА 6 УРОВНЯ
    const onLevel6TaskCompleted = (success, answer, isLastLevel = false) => {
      if (!gameReady.value || answered.value || isTransitioning.value) {
        return
      }
      
      answered.value = true
      selectedAnswer.value = answer
      isCorrectAnswer.value = success
      
      console.log('MathGame: ✅ Уровень 6 завершен:', success, 'последний уровень:', isLastLevel, 'попытка:', attemptCount.value)
      
      // Сохраняем количество попыток в store
      store.dispatch('setTaskAttempt', { 
        taskNumber: displayedTaskNumber.value, 
        attemptCount: attemptCount.value 
      })
      
      store.dispatch('setTaskResult', { 
        taskNumber: displayedTaskNumber.value, 
        success: success 
      })
      
      store.dispatch('addPoints', 10)
      
      if (success && isLastLevel) {
        // ИСПРАВЛЕНО: ждем минимум 4 секунды + время видео с духовкой
        const minimumDelay = calculateDelay()
        const videoDelay = 4500 // время видео с духовкой
        const totalDelay = minimumDelay + videoDelay
        
        console.log(`MathGame: 📅 Задержка для 6 уровня: ${totalDelay}ms (минимум: ${minimumDelay}ms + духовка: ${videoDelay}ms)`)
        
        autoProgressTimer.value = setTimeout(() => {
          console.log('MathGame: Показываем экран завершения 6 уровня после видео с духовкой')
          
          if (level6Ref.value && typeof level6Ref.value.showCompletion === 'function') {
            level6Ref.value.showCompletion()
          }
        }, totalDelay)
        
      } else {
        // Обычная обработка для неправильного ответа
        const minimumDelay = calculateDelay()
        const emotionDelay = 4500
        const totalDelay = minimumDelay + emotionDelay
        
        autoProgressTimer.value = setTimeout(() => {
          handleAnswer()
        }, totalDelay)
      }
    }
    
    const onInteractiveCompleted = (success) => {
      if (!gameReady.value || answered.value || isTransitioning.value) {
        return
      }
      
      answered.value = true
      selectedAnswer.value = 'interactive'
      isCorrectAnswer.value = success
      
      console.log('MathGame: ✅ Интерактивное задание завершено:', success, 'попытка:', attemptCount.value)
      
      // Сохраняем количество попыток в store (интерактивные всегда с первой попытки)
      store.dispatch('setTaskAttempt', { 
        taskNumber: displayedTaskNumber.value, 
        attemptCount: 1 // Интерактивные задания всегда успешны с первой попытки
      })
      
      store.dispatch('setTaskResult', { 
        taskNumber: displayedTaskNumber.value, 
        success: success 
      })
      
      store.dispatch('addPoints', 10)
      
      // ИСПРАВЛЕНО: ждем минимум 4 секунды + время эмоции
      const minimumDelay = calculateDelay()
      const emotionDelay = 4500
      const totalDelay = minimumDelay + emotionDelay
      
      console.log(`MathGame: 📅 Интерактивная задержка: ${totalDelay}ms (минимум: ${minimumDelay}ms + эмоция: ${emotionDelay}ms)`)
      
      autoProgressTimer.value = setTimeout(() => {
        handleAnswer()
      }, totalDelay)
    }
    
    const resetInteractiveComponents = () => {
      if (dragDropRef.value && typeof dragDropRef.value.resetTask === 'function') {
        dragDropRef.value.resetTask()
      }
      if (distributionRef.value && typeof distributionRef.value.resetTask === 'function') {
        distributionRef.value.resetTask()
      }
      if (sliderRef.value && typeof sliderRef.value.resetTask === 'function') {
        sliderRef.value.resetTask()
      }
      if (level6Ref.value && typeof level6Ref.value.resetTask === 'function') {
        level6Ref.value.resetTask()
      }
    }
    
    const handleAnswer = async () => {
      console.log('MathGame: 🎯 Обрабатываем ответ после полного проигрывания эмоции')
      
      if (isCorrectAnswer.value) {
        console.log('MathGame: ✅ Правильный ответ - переходим к следующему заданию')
        store.dispatch('completeTask')
        
        const newCompletedTasks = store.getters.completedTasks
        
        if (newCompletedTasks >= 6) {
          console.log('MathGame: 🎉 Все задания выполнены - переходим к наградам!')
          contentVisible.value = false
          setTimeout(() => {
            router.push('/rewards')
          }, 500)
          return
        }
        
        await transitionToNextTask()
        
      } else {
        if (attemptCount.value === 1) {
          console.log('MathGame: ❌ Первая неправильная попытка - повторяем задание')
          await retryCurrentTask()
        } else {
          console.log('MathGame: ❌ Вторая неправильная попытка - пропускаем задание')
          store.dispatch('completeTask')
          
          const newCompletedTasks = store.getters.completedTasks
          if (newCompletedTasks >= 6) {
            contentVisible.value = false
            setTimeout(() => {
              router.push('/rewards')
            }, 500)
            return
          }
          
          await transitionToNextTask()
        }
      }
    }
    
    const retryCurrentTask = async () => {
      isTransitioning.value = true
      attemptCount.value = 2
      
      answered.value = false
      selectedAnswer.value = ''
      isCorrectAnswer.value = false
      
      // ИСПРАВЛЕНО: сбрасываем время начала уровня при повторной попытке
      levelStartTime.value = Date.now()
      
      resetInteractiveComponents()
      clearAllTimers()
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      isTransitioning.value = false
    }
    
    const transitionToNextTask = async () => {
      isTransitioning.value = true
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      answered.value = false
      selectedAnswer.value = ''
      isCorrectAnswer.value = false
      attemptCount.value = 1
      
      resetInteractiveComponents()
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      displayedTaskNumber.value = currentTaskNumber.value
      
      // ИСПРАВЛЕНО: устанавливаем время начала нового уровня
      levelStartTime.value = Date.now()
      
      clearAllTimers()
      
      await new Promise(resolve => setTimeout(resolve, 400))
      isTransitioning.value = false
    }
    
    const goToRewards = () => {
      console.log('MathGame: Переходим к наградам из 6 уровня')
      contentVisible.value = false
      setTimeout(() => {
        router.push('/rewards')
      }, 500)
    }
    
    const clearAllTimers = () => {
      if (autoProgressTimer.value) {
        clearTimeout(autoProgressTimer.value)
        autoProgressTimer.value = null
      }
      
      if (contentShowTimer.value) {
        clearTimeout(contentShowTimer.value)
        contentShowTimer.value = null
      }
    }
    
    const onVideoReady = () => {
      console.log('MathGame: 📺 Видео готово')
      gameReady.value = true
      
      // ИСПРАВЛЕНО: устанавливаем время начала уровня когда видео готово
      levelStartTime.value = Date.now()
      console.log('MathGame: ⏰ Установлено время начала уровня:', new Date(levelStartTime.value).toLocaleTimeString())
      
      contentShowTimer.value = setTimeout(() => {
        contentVisible.value = true
      }, 100)
    }
    
    watch(currentTaskNumber, async (newTask, oldTask) => {
      if (newTask !== oldTask && oldTask !== undefined) {
        console.log('MathGame: 📋 Store: смена задания с', oldTask, 'на', newTask)
      }
    })
    
    onMounted(() => {
      console.log('MathGame: 🚀 Компонент инициализирован')
      
      const initialTask = currentTaskNumber.value || 1
      
      if (!currentTaskNumber.value) {
        store.dispatch('setCurrentTask', 1)
      }
      
      displayedTaskNumber.value = initialTask
      
      answered.value = false
      selectedAnswer.value = ''
      isCorrectAnswer.value = false
      attemptCount.value = 1
      
      clearAllTimers()
    })
    
    return {
      displayedTask,
      displayedTaskNumber,
      answered,
      selectedAnswer,
      isCorrectAnswer,
      attemptCount,
      completedTasks,
      gameReady,
      contentVisible,
      videoName,
      isMobile,
      currentTaskNumber,
      onVideoReady,
      isTransitioning,
      onBasicTaskCompleted,
      onLevel6TaskCompleted,
      onInteractiveCompleted,
      goToRewards,
      dragDropRef,
      distributionRef,
      sliderRef,
      level6Ref
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.content-overlay-slide {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateY(100%);
  transition: transform 0.5s ease;
  overflow: visible !important;
  
  &.slide-up {
    transform: translateY(0);
  }
  
  &.slide-down {
    transform: translateY(100%);
  }
  
  &.mobile-overlay {
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    box-shadow: none !important;
  }
  
  &.desktop-overlay {
    background: rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

.math-game-content {
  width: 100%;
  height: 100%;
  font-family: $font-family-primary;
  position: relative;
  z-index: 300;
  overflow: visible !important;
  display: flex;
  flex-direction: column;
}

.mg-progress-bar {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  position: relative;
  margin-bottom: 4px;
  overflow: hidden;
  margin-top: 8px;
  flex-shrink: 0;
  
  .mg-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, $primary-color 0%, $accent-color 100%);
    border-radius: 2px;
    transition: width 0.8s ease;
    box-shadow: 0 0 8px rgba($primary-color, 0.4);
  }
  
  .mg-progress-text {
    position: absolute;
    top: -14px;
    right: 0;
    font-size: 9px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
  
  &.mg-desktop-progress {
    height: 4px;
    margin-bottom: 8px;
    margin-top: 8px;
    
    .mg-progress-text {
      top: -16px;
      font-size: 10px;
    }
  }
}

.mg-mobile-layout {
  .mg-mobile-content-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 2px 6px 4px 6px;
    position: relative;
    z-index: 301;
    overflow: visible !important;
  }
  
  .mg-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    gap: 6px;
    overflow: visible !important;
    min-height: 0;
  }
}

.mg-desktop-layout {
  .mg-desktop-content {
    max-width: 550px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 8px 15px;
    position: relative;
    z-index: 301;
    overflow: visible !important;
  }
  
  .mg-desktop-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    overflow: visible !important;
    min-height: 0;
  }
  
  .mg-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 12px;
    overflow: visible !important;
    min-height: 0;
  }
}

.mg-interactive-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
  overflow: visible !important;
  min-height: 0;
  justify-content: center;
  
  &.desktop {
    gap: 15px;
  }
}

@media (max-width: 360px) {
  .mg-mobile-layout {
    .mg-mobile-content-wrapper {
      padding: 1px 3px 3px 3px;
    }
    
    .mg-content-area {
      gap: 4px;
    }
    
    .mg-interactive-container {
      gap: 8px;
    }
  }
}

@media (max-height: 600px) {
  .mg-mobile-layout {
    .mg-mobile-content-wrapper {
      padding: 1px 4px 3px 4px;
    }
    
    .mg-content-area {
      gap: 4px;
    }
    
    .mg-interactive-container {
      gap: 6px;
    }
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .mg-mobile-layout {
    .mg-mobile-content-wrapper {
      padding: 1px 2px 2px 2px;
    }
    
    .mg-content-area {
      gap: 3px;
    }
    
    .mg-interactive-container {
      gap: 4px;
    }
  }
}

@media (min-height: 800px) and (max-width: 768px) {
  .mg-mobile-layout {
    .mg-mobile-content-wrapper {
      padding: 4px 8px 6px 8px;
    }
    
    .mg-content-area {
      gap: 8px;
    }
    
    .mg-interactive-container {
      gap: 14px;
    }
  }
}

* {
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
}

button {
  outline: none !important;
  -webkit-appearance: none !important;
  
  &:focus {
    outline: none !important;
  }
  
  &:active {
    outline: none !important;
  }
}
</style>