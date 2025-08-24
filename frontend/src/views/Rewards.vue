<template>
  <div class="rewards-page" :class="{ 'mobile-layout': isMobile, 'desktop-layout': !isMobile }">
    
    <!-- МОБИЛЬНАЯ ВЕРСИЯ С ПРОКРУТКОЙ -->
    <template v-if="isMobile">
      <!-- Первый экран - видео + стрелочка -->
      <VideoBackground :videoName="resultsVideoName" class="video-section">
        <div class="mobile-video-overlay">
          <div class="mobile-header">
            <h2 class="rewards-title mobile-title">My Rewards</h2>
          </div>
          
          <!-- Стрелочка вниз с новым текстом -->
          <div class="scroll-indicator" @click="scrollToContent">
            <div class="arrow-container">
              <div class="scroll-arrow">↓</div>
              <div class="scroll-text">Click to get results</div>
            </div>
          </div>
        </div>
      </VideoBackground>
      
      <!-- Прокручиваемый контент -->
      <div class="scrollable-content" ref="scrollableContent">
        <div class="content-sections">
          
          <!-- Секция с отображением ошибок -->
          <section class="errors-section">
            <h3 class="section-title">Task Results</h3>
            <div class="task-results-container">
              <div 
                v-for="taskNum in 6" 
                :key="taskNum"
                class="task-result-item"
                :class="{ 'task-success': taskResults[taskNum], 'task-error': !taskResults[taskNum] }"
              >
                <div class="task-icon">
                  <span v-if="taskResults[taskNum]">✓</span>
                  <span v-else>✗</span>
                </div>
                <div class="task-info">
                  <div class="task-name">{{ getTaskName(taskNum) }}</div>
                  <div class="task-status">
                    <span v-if="taskResults[taskNum]" class="success-text">Completed successfully</span>
                    <span v-else class="error-text">Needs practice - {{ getErrorDescription(taskNum) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Секция завершения -->
          <section class="completion-section" v-if="completedTasks >= 6">
            <div class="completion-message">
              <div class="completion-checkmark">✓</div>
              <h3 class="completion-title">All Tasks Completed!</h3>
              <p class="completion-text">Great job finishing all levels!</p>
            </div>
          </section>
          
          <!-- Секция отчета для родителей -->
          <section class="report-section">
            <h3 class="section-title">Parent Report</h3>
            <div class="report-preview">
              <p class="report-description">
                Get a detailed report about the mathematical skills your child demonstrated
              </p>
              <AppButton 
                type="primary" 
                fullWidth
                @click="generateReport"
              >
                Get Parent Report
              </AppButton>
            </div>
          </section>
          
          <!-- Секция действий -->
          <section class="actions-section">
            <div class="actions-container">
              <AppButton 
                type="secondary" 
                fullWidth
                @click="showSubscribeModal"
              >
                Home
              </AppButton>
              <AppButton 
                v-if="completedTasks < 6" 
                type="accent" 
                fullWidth
                @click="continueGame"
              >
                Continue Playing
              </AppButton>
            </div>
          </section>
          
        </div>
      </div>
    </template>
    
    <!-- ДЕСКТОПНАЯ ВЕРСИЯ - УПРОЩЕННАЯ -->
    <template v-else>
      <VideoBackground :videoName="resultsVideoName">
        <div class="desktop-content">
          
          <div class="desktop-content-area">
            <div class="content-area">
              
              <!-- УПРОЩЕННОЕ ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ НА ДЕСКТОПЕ -->
              <div class="desktop-results-container">
                <h3 class="desktop-results-title">Task Results</h3>
                <div class="desktop-task-grid">
                  <div 
                    v-for="taskNum in 6" 
                    :key="taskNum"
                    class="desktop-task-card"
                    :class="{ 'success': taskResults[taskNum], 'error': !taskResults[taskNum] }"
                  >
                    <div class="task-number">{{ taskNum }}</div>
                    <div class="task-name">{{ getTaskName(taskNum) }}</div>
                    <div class="task-status-icon">
                      <span v-if="taskResults[taskNum]">✓</span>
                      <span v-else>✗</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- СООБЩЕНИЕ О ЗАВЕРШЕНИИ ДЛЯ ДЕСКТОПА -->
              <div v-if="completedTasks >= 6" class="desktop-completion-message">
                <div class="completion-icon">🎉</div>
                <div class="completion-text">Excellent work! All mathematical challenges completed successfully!</div>
              </div>
            </div>
            
            <!-- КНОПКИ ДЛЯ ДЕСКТОПА -->
            <div class="desktop-button-area">
              <AppButton 
                type="primary" 
                large
                @click="generateReport"
              >
                Get Parent Report
              </AppButton>
              <AppButton 
                type="secondary" 
                large
                @click="showSubscribeModal"
              >
                Home
              </AppButton>
              <AppButton 
                v-if="completedTasks < 6" 
                type="accent" 
                large
                @click="continueGame"
              >
                Continue Playing
              </AppButton>
            </div>
          </div>
        </div>
      </VideoBackground>
    </template>
  </div>
  
  <!-- Модальное окно отчета -->
  <transition name="modal">
    <div v-if="reportModalVisible" class="report-modal-overlay" @click="closeReportModal">
      <div class="report-modal" @click.stop>
        <div class="report-header">
          <h2 class="report-title">Progress Report</h2>
          <button class="close-btn" @click="closeReportModal">×</button>
        </div>
        
        <div class="report-content" ref="reportContent">
          <div class="report-intro">
            <p><strong>Thank you for participating in our math learning game!</strong></p>
            <p>Here's a summary of the mathematical skills your child demonstrated during gameplay.</p>
          </div>

          <div class="report-summary">
            <h3>Skills Demonstrated:</h3>
            
            <div class="task-report">
              <h4>Task 1: Addition</h4>
              <div v-if="taskResults[1]" class="task-success">
                <p>✓ <strong>Successfully used addition skills!</strong> Your child can confidently add numbers in practical scenarios.</p>
              </div>
              <div v-else class="task-fail">
                <p>⚠ <strong>Practice opportunity:</strong> Try working on addition together using hands-on examples.</p>
              </div>
            </div>

            <div class="task-report">
              <h4>Task 2: Subtraction</h4>
              <div v-if="taskResults[2]" class="task-success">
                <p>✓ <strong>Successfully applied subtraction!</strong> Your child accurately used subtraction to solve problems.</p>
              </div>
              <div v-else class="task-fail">
                <p>⚠ <strong>Practice opportunity:</strong> Use physical objects to help explain how subtraction works.</p>
              </div>
            </div>

            <div class="task-report">
              <h4>Task 3: Shape Recognition</h4>
              <div class="task-success">
                <p>✓ <strong>Excellent shape sorting!</strong> Shows good understanding of geometric shapes and patterns.</p>
              </div>
            </div>

            <div class="task-report">
              <h4>Task 4: Collection and Counting</h4>
              <div class="task-success">
                <p>✓ <strong>Great counting skills!</strong> Demonstrates ability to collect and count accurately.</p>
              </div>
            </div>

            <div class="task-report">
              <h4>Task 5: Fractions (Halves)</h4>
              <div class="task-success">
                <p>✓ <strong>Understanding of halves!</strong> Shows grasp of basic fraction concepts.</p>
              </div>
            </div>

            <div class="task-report">
              <h4>Task 6: Multiplication</h4>
              <div v-if="taskResults[6]" class="task-success">
                <p>✓ <strong>Multiplication success!</strong> Can apply multiplication in practical situations.</p>
              </div>
              <div v-else class="task-fail">
                <p>⚠ <strong>Practice opportunity:</strong> Practice with small groups of objects to build multiplication understanding.</p>
              </div>
            </div>
          </div>

          <div class="report-next-steps">
            <h3>Next Steps</h3>
            <p><strong>Thank you for playing our math learning game!</strong></p>
            <p>Continue practicing these skills through play and everyday activities to reinforce learning.</p>
            <p><strong>Keep up the great work!</strong></p>
          </div>
        </div>
        
        <div class="report-actions">
          <AppButton 
            type="primary" 
            @click="downloadReport"
          >
            Download Report
          </AppButton>
          <AppButton 
            type="secondary" 
            @click="shareReport"
          >
            Share
          </AppButton>
        </div>
      </div>
    </div>
  </transition>
  
  <!-- Модальное окно подписки -->
  <transition name="modal">
    <div v-if="subscribeModalVisible" class="subscribe-modal-overlay" @click="closeAndGoHome">
      <div class="subscribe-modal" @click.stop>
        <div class="subscribe-content">
          <h2 class="subscribe-title">Stay Updated</h2>
          
          <p class="subscribe-text">
            Subscribe to our newsletter to get access to the full course when it launches!
          </p>
          
          <div class="subscribe-form">
            <input 
              type="email" 
              class="email-input" 
              placeholder="Your email address"
              v-model="emailInput"
            >
            <AppButton 
              type="primary"
              :fullWidth="isMobile" 
              @click="submitSubscribe"
            >
              Subscribe
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
import VideoBackground from '@/components/game/VideoBackground.vue'
import { getDeviceType } from '@/utils/responsive'

export default {
  name: 'RewardsPage',
  components: {
    AppButton,
    VideoBackground
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // Рефы для элементов
    const scrollableContent = ref(null)
    
    // ИСПОЛЬЗУЕМ ВИДЕО РЕЗУЛЬТАТОВ ИЗ ПРАВИЛЬНОЙ ПАПКИ
    const resultsVideoName = 'показывает рузльтаты 7 этап'
    
    // Состояние модальных окон
    const subscribeModalVisible = ref(false)
    const reportModalVisible = ref(false)
    const emailInput = ref('')
    const reportContent = ref(null)
    
    const isMobile = computed(() => {
      const deviceType = getDeviceType()
      return deviceType === 'mobile' || deviceType === 'tablet'
    })
    
    const points = computed(() => store.getters.points || 0)
    const completedTasks = computed(() => store.getters.completedTasks || 0)
    
    const progressPercentage = computed(() => {
      return Math.round((completedTasks.value / 6) * 100)
    })
    
    // ПРАВИЛЬНОЕ ОПРЕДЕЛЕНИЕ РЕЗУЛЬТАТОВ ЗАДАНИЙ
    const taskResults = computed(() => {
      // Получаем реальные результаты из store с защитой от undefined
      const gameResults = store.getters.taskResults || {}
      
      return {
        1: gameResults[1] !== false, // Task 1 (Addition) - может быть ошибка
        2: gameResults[2] !== false, // Task 2 (Subtraction) - может быть ошибка  
        3: true, // Task 3 (Shapes) - ВСЕГДА успешно
        4: true, // Task 4 (Collection) - ВСЕГДА успешно
        5: true, // Task 5 (Fractions) - ВСЕГДА успешно
        6: gameResults[6] !== false  // Task 6 (Multiplication) - может быть ошибка
      }
    })
    
    // Функция прокрутки к контенту
    const scrollToContent = () => {
      if (scrollableContent.value) {
        scrollableContent.value.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
    
    // Функции для получения информации о заданиях
    const getTaskName = (taskNumber) => {
      const names = {
        1: 'Addition – Shopping',
        2: 'Subtraction – Door Code',
        3: 'Classification – Sorting Shapes',
        4: 'Collection – Completed successfully',
        5: 'Equal Parts – Introductory Fractions',
        6: 'Multiplication – Cookies Preparation'
      }
      return names[taskNumber] || `Task ${taskNumber}`
    }
    
    const getTaskDescription = (taskNumber) => {
      const descriptions = {
        1: 'Addition practice completed',
        2: 'Subtraction challenge solved',
        3: 'Shape recognition mastered',
        4: 'Counting skills demonstrated',
        5: 'Fraction concepts learned',
        6: 'Multiplication problem solved'
      }
      return descriptions[taskNumber] || `Task ${taskNumber} completed`
    }
    
    // Функция для получения описания ошибки
    const getErrorDescription = (taskNumber) => {
      const errorDescriptions = {
        1: 'Addition needs practice',
        2: 'Subtraction skills to improve',
        3: 'Shape recognition perfect', // НЕ ДОЛЖНО ПОКАЗЫВАТЬСЯ
        4: 'Counting skills excellent', // НЕ ДОЛЖНО ПОКАЗЫВАТЬСЯ
        5: 'Fraction understanding complete', // НЕ ДОЛЖНО ПОКАЗЫВАТЬСЯ
        6: 'Multiplication concepts to practice'
      }
      return errorDescriptions[taskNumber] || 'Needs improvement'
    }
    
    // Функции для отчета
    const generateReport = () => {
      console.log('Generating parent report...')
      reportModalVisible.value = true
    }
    
    const closeReportModal = () => {
      reportModalVisible.value = false
    }
    
    // ИСПРАВЛЕНО: Добавлена функция downloadReport
    const downloadReport = () => {
      console.log('Downloading report...')
      try {
        const reportData = generateReportData()
        const blob = new Blob([reportData], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'math-progress-report.html'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        // Показываем уведомление об успешном скачивании
        console.log('Report downloaded successfully!')
      } catch (error) {
        console.error('Error downloading report:', error)
        alert('Error downloading report. Please try again.')
      }
    }
    
    // ИСПРАВЛЕНО: Добавлена функция shareReport
    const shareReport = () => {
      console.log('Sharing report...')
      try {
        const reportText = `Math Learning Progress Report - Completed ${completedTasks.value}/6 tasks\n\nTask Results:\n${Object.entries(taskResults.value).map(([num, success]) => `Task ${num}: ${success ? '✓ Success' : '✗ Needs practice'}`).join('\n')}\n\nKeep up the great work!`
        
        if (navigator.share) {
          navigator.share({
            title: 'Math Progress Report',
            text: reportText,
            url: window.location.origin
          }).then(() => {
            console.log('Report shared successfully!')
          }).catch((error) => {
            console.error('Error sharing report:', error)
            fallbackShare(reportText)
          })
        } else {
          fallbackShare(reportText)
        }
      } catch (error) {
        console.error('Error sharing report:', error)
        alert('Error sharing report. Please try again.')
      }
    }
    
    // Fallback для браузеров без поддержки Web Share API
    const fallbackShare = (text) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          alert('Report info copied to clipboard!')
        }).catch(() => {
          console.error('Failed to copy to clipboard')
          alert('Unable to share. Please copy the report manually.')
        })
      } else {
        alert('Sharing not supported on this device.')
      }
    }
    
    // ИСПРАВЛЕНО: Добавлена функция генерации HTML отчета
    const generateReportData = () => {
      const results = taskResults.value
      const currentDate = new Date().toLocaleDateString()
      
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Math Learning Progress Report</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 40px; 
              background-color: #f8f9fa;
              color: #333;
            }
            .container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white; 
              padding: 40px; 
              border-radius: 12px; 
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .header { 
              text-align: center; 
              color: #2c3e50; 
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #eee;
            }
            .header h1 { 
              color: #3498db; 
              margin: 0 0 10px 0;
            }
            .task { 
              margin: 20px 0; 
              padding: 20px; 
              border-radius: 8px; 
              border-left: 5px solid;
            }
            .success { 
              background-color: #e8f5e8; 
              border-left-color: #4CAF50; 
            }
            .needs-practice { 
              background-color: #fff3e0; 
              border-left-color: #FF9800; 
            }
            .task h3 { 
              margin: 0 0 10px 0; 
              color: #2c3e50;
            }
            .task p { 
              margin: 0; 
              line-height: 1.5;
            }
            .summary { 
              background: #f1f3f4; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0;
            }
            .footer { 
              text-align: center; 
              color: #666; 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Math Learning Progress Report</h1>
              <p>Generated on ${currentDate}</p>
            </div>
            
            <div class="summary">
              <h2>Overall Progress: ${completedTasks.value}/6 Tasks Completed</h2>
              <p>This report summarizes the mathematical skills demonstrated during the interactive learning session.</p>
            </div>
            
            <h2>Detailed Task Results:</h2>
            
            <div class="task ${results[1] ? 'success' : 'needs-practice'}">
              <h3>Task 1: Addition Skills</h3>
              <p>${results[1] ? '✓ Successfully demonstrated addition skills in practical shopping scenarios. Your child can confidently add numbers and apply mathematical concepts in real-world situations.' : '⚠ This area would benefit from additional practice. Try working on addition together using hands-on examples like counting toys or snacks.'}</p>
            </div>
            
            <div class="task ${results[2] ? 'success' : 'needs-practice'}">
              <h3>Task 2: Subtraction Skills</h3>
              <p>${results[2] ? '✓ Successfully applied subtraction to solve door code problems. Shows strong understanding of taking away and finding differences.' : '⚠ Subtraction concepts need reinforcement. Use physical objects to help explain how subtraction works in everyday situations.'}</p>
            </div>
            
            <div class="task success">
              <h3>Task 3: Shape Recognition & Classification</h3>
              <p>✓ Excellent performance in shape sorting and pattern recognition. Demonstrates strong visual-spatial skills and understanding of geometric concepts.</p>
            </div>
            
            <div class="task success">
              <h3>Task 4: Collection & Counting</h3>
              <p>✓ Outstanding counting abilities and systematic approach to collection tasks. Shows strong number sense and organizational skills.</p>
            </div>
            
            <div class="task success">
              <h3>Task 5: Fraction Concepts</h3>
              <p>✓ Good grasp of foundational fraction concepts, particularly understanding halves. Shows readiness for more advanced fraction work.</p>
            </div>
            
            <div class="task ${results[6] ? 'success' : 'needs-practice'}">
              <h3>Task 6: Multiplication Concepts</h3>
              <p>${results[6] ? '✓ Successfully applied multiplication in cookie preparation scenarios. Shows understanding of groups and repeated addition concepts.' : '⚠ Multiplication concepts need more practice. Work with small groups of objects to build understanding of repeated addition and grouping.'}</p>
            </div>
            
            <div class="summary">
              <h2>Recommendations for Continued Learning</h2>
              <p><strong>Strengths:</strong> Your child shows particular strength in visual-spatial tasks, counting, and pattern recognition.</p>
              ${results[1] && results[2] && results[6] ? 
                '<p><strong>Well-rounded mathematical foundation:</strong> Excellent performance across all mathematical areas tested.</p>' : 
                '<p><strong>Areas for growth:</strong> Continue practicing arithmetic operations through fun, hands-on activities and games.</p>'
              }
              <p><strong>Next steps:</strong> Keep mathematics fun and engaging through play-based learning and real-world applications.</p>
            </div>
            
            <div class="footer">
              <p>This report was generated by the Math Learning Game system.</p>
              <p>Thank you for supporting your child's mathematical development!</p>
            </div>
          </div>
        </body>
        </html>
      `
    }
    
    // Функции для модального окна подписки
    const showSubscribeModal = () => {
      subscribeModalVisible.value = true
    }
    
    const submitSubscribe = () => {
      if (emailInput.value && validateEmail(emailInput.value)) {
        console.log('Subscribe with email:', emailInput.value)
        // Здесь будет логика отправки email на сервер
        subscribeModalVisible.value = false
        router.push('/')
      } else {
        alert('Please enter a valid email address')
      }
    }
    
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
    
    const closeAndGoHome = () => {
      subscribeModalVisible.value = false
      router.push('/')
    }
    
    // ИСПРАВЛЕНО: Добавлена функция continueGame
    const continueGame = () => {
      router.push('/comic')
    }
    
    // Обработка viewport height для мобильных устройств
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    
    onMounted(() => {
      // Устанавливаем viewport height для мобильных устройств
      if (isMobile.value) {
        setVH()
        window.addEventListener('resize', setVH)
        window.addEventListener('orientationchange', setVH)
      }
      
      // Логируем результаты для отладки
      console.log('RewardsPage: Результаты заданий:', taskResults.value)
      console.log('RewardsPage: Данные из store:', store.getters.taskResults)
      console.log('RewardsPage: Используем видео результатов:', resultsVideoName)
      console.log('RewardsPage: Завершено задач:', completedTasks.value)
    })
    
    onUnmounted(() => {
      if (isMobile.value) {
        window.removeEventListener('resize', setVH)
        window.removeEventListener('orientationchange', setVH)
      }
    })
    
    return {
      scrollableContent,
      resultsVideoName,
      points,
      completedTasks,
      progressPercentage,
      taskResults,
      isMobile,
      router,
      subscribeModalVisible,
      reportModalVisible,
      emailInput,
      reportContent,
      scrollToContent,
      getTaskName,
      getTaskDescription,
      getErrorDescription,
      generateReport,
      closeReportModal,
      downloadReport, // ИСПРАВЛЕНО: Добавлено в return
      shareReport, // ИСПРАВЛЕНО: Добавлено в return
      showSubscribeModal,
      submitSubscribe,
      closeAndGoHome,
      continueGame // ИСПРАВЛЕНО: Добавлено в return
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.rewards-page {
  width: 100%;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  position: relative;
  font-family: $font-family-primary;
  overflow-y: auto;
}

// === МОБИЛЬНАЯ ВЕРСИЯ ===
.mobile-layout {
  .video-section {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    z-index: 1;
  }
  
  .mobile-video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: $spacing-large $spacing-medium;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0) 30%,
      rgba(0, 0, 0, 0) 70%,
      rgba(0, 0, 0, 0.2) 100%
    );
  }
  
  .mobile-header {
    text-align: center;
    flex-shrink: 0;
  }
  
  .mobile-title {
    font-size: 2em;
    font-weight: 800;
    color: white;
    margin: 0;
    text-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
    font-family: $font-family-display;
  }
  
  // СТРЕЛОЧКА ВНИЗ С НОВЫМ ТЕКСТОМ
  .scroll-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    flex-shrink: 0;
    margin-bottom: $spacing-large;
    
    .arrow-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-xs;
      animation: bounce-arrow 2s infinite;
    }
    
    .scroll-arrow {
      font-size: 2.5em;
      color: white;
      font-weight: bold;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      animation: pulse-arrow 1.5s infinite alternate;
    }
    
    .scroll-text {
      color: white;
      font-size: 0.9em;
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      opacity: 0.9;
    }
  }
  
  // ПРОКРУЧИВАЕМЫЙ КОНТЕНТ
  .scrollable-content {
    position: absolute;
    top: 100vh;
    top: calc(var(--vh, 1vh) * 100);
    left: 0;
    width: 100%;
    min-height: 100vh;
    min-height: calc(var(--vh, 1vh) * 100);
    background: linear-gradient(
      to bottom,
      #f8f9fa 0%,
      #e9ecef 100%
    );
    z-index: 2;
    overflow-y: auto;
  }
  
  .content-sections {
    padding: $spacing-large $spacing-medium;
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
  }
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: $primary-color;
    margin: 0 0 $spacing-medium 0;
    text-align: center;
    font-family: $font-family-display;
  }
  
  // СЕКЦИИ КОНТЕНТА
  .errors-section, .completion-section, .report-section, .actions-section {
    background: white;
    border-radius: 20px;
    padding: $spacing-large;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.8);
  }
  
  // ОТОБРАЖЕНИЕ ОШИБОК - СТИЛИ КАК В Level2Basic
  .task-results-container {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
  }
  
  .task-result-item {
    display: flex;
    align-items: center;
    padding: 8px 6px;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(10px);
    min-height: 36px;
    position: relative;
    
    &.task-success {
      background: linear-gradient(135deg, #4CAF50 0%, darken(#4CAF50, 8%) 100%) !important;
      border-color: darken(#4CAF50, 15%) !important;
      color: white !important;
      transform: scale(1.05) !important;
      box-shadow: 0 3px 12px rgba(#4CAF50, 0.35) !important;
    }
    
    &.task-error {
      background: linear-gradient(135deg, #f44336 0%, darken(#f44336, 8%) 100%) !important;
      border-color: darken(#f44336, 15%) !important;
      color: white !important;
      transform: scale(1.05) !important;
      box-shadow: 0 3px 12px rgba(#f44336, 0.35) !important;
    }
    
    .task-icon {
      font-size: 14px;
      font-weight: 900;
      position: absolute;
      right: 6px;
      top: 6px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    .task-info {
      flex: 1;
      
      .task-name {
        font-size: 14px;
        font-weight: 600;
        color: inherit;
        margin-bottom: $spacing-xs;
      }
      
      .task-status {
        font-size: 12px;
        font-weight: 500;
        color: inherit;
        opacity: 0.9;
      }
    }
  }
  
  .completion-message {
    text-align: center;
    padding: $spacing-xl;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1));
    border: 2px solid rgba(76, 175, 80, 0.3);
    border-radius: 20px;
    
    .completion-checkmark {
      font-size: 4em;
      color: #4CAF50;
      font-weight: bold;
      margin-bottom: $spacing-medium;
    }
    
    .completion-title {
      font-size: 1.5em;
      font-weight: 800;
      color: #388e3c;
      margin: 0 0 $spacing-small 0;
      font-family: $font-family-display;
    }
    
    .completion-text {
      font-size: 1.1em;
      color: #388e3c;
      margin: 0;
      font-weight: 600;
    }
  }
  
  .report-preview {
    text-align: center;
    
    .report-description {
      font-size: 1em;
      color: $text-color;
      margin-bottom: $spacing-large;
      line-height: 1.5;
    }
  }
  
  .actions-container {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
  }
}

// === ДЕСКТОПНАЯ ВЕРСИЯ - УПРОЩЕННАЯ ===
.desktop-layout {
  .desktop-content {
    max-width: 900px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .desktop-title {
    font-size: 3em;
    font-weight: 900;
    color: white;
    margin-bottom: $spacing-xl;
    font-family: $font-family-display;
    letter-spacing: -0.02em;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
    text-align: center;
  }
  
  .desktop-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
  }
  
  // НОВЫЙ УПРОЩЕННЫЙ КОНТЕЙНЕР РЕЗУЛЬТАТОВ
  .desktop-results-container {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: $spacing-xl;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.5);
  }
  
  .desktop-results-title {
    font-size: 1.8em;
    font-weight: 800;
    color: $primary-color;
    margin: 0 0 $spacing-large 0;
    text-align: center;
    font-family: $font-family-display;
  }
  
  // СЕТКА ЗАДАНИЙ - БЕЗ НАЛОЖЕНИЙ
  .desktop-task-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-large;
  }
  
  .desktop-task-card {
    background: rgba(255, 255, 255, 0.8);
    border: 3px solid #e0e0e0;
    border-radius: 16px;
    padding: $spacing-large;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    &.success {
      background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
      border-color: #388E3C;
      color: white;
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4);
    }
    
    &.error {
      background: linear-gradient(135deg, #f44336 0%, #EF5350 100%);
      border-color: #D32F2F;
      color: white;
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(244, 67, 54, 0.4);
    }
    
    .task-number {
      font-size: 2.5em;
      font-weight: 900;
      margin-bottom: $spacing-small;
      font-family: $font-family-display;
    }
    
    .task-name {
      font-size: 1.1em;
      font-weight: 700;
      margin-bottom: $spacing-small;
    }
    
    .task-status-icon {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 1.2em;
      font-weight: 900;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }
  
  // СООБЩЕНИЕ О ЗАВЕРШЕНИИ
  .desktop-completion-message {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: $spacing-xl;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-large;
    box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
    border: 2px solid rgba(76, 175, 80, 0.4);
    
    .completion-icon {
      font-size: 3em;
    }
    
    .completion-text {
      font-size: 1.4em;
      font-weight: 700;
      color: #388E3C;
      font-family: $font-family-display;
    }
  }
  
  // КНОПКИ ДЛЯ ДЕСКТОПА
  .desktop-button-area {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    gap: $spacing-large;
    flex-wrap: wrap;
    margin-top: $spacing-xl;
  }
}

// === МОДАЛЬНЫЕ ОКНА ===
.report-modal-overlay, .subscribe-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  padding: $spacing-small;
}

.report-modal, .subscribe-modal {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-large;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  .report-title {
    font-size: 1.5em;
    font-weight: 700;
    color: $primary-color;
    margin: 0;
    font-family: $font-family-display;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: $text-color;
    opacity: 0.7;
    padding: $spacing-xs;
    border-radius: 50%;
    transition: all 0.2s ease;
    
    &:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}

.report-content {
  padding: $spacing-large;
  max-height: 50vh;
  overflow-y: auto;
  
  .report-intro {
    margin-bottom: $spacing-large;
    
    p {
      line-height: 1.5;
      margin-bottom: $spacing-small;
      color: $text-color;
    }
  }
  
  .report-summary {
    h3 {
      color: $primary-color;
      font-weight: 700;
      margin-bottom: $spacing-medium;
      font-family: $font-family-display;
    }
  }
  
  .task-report {
    margin-bottom: $spacing-medium;
    padding: $spacing-medium;
    border-radius: 12px;
    background: rgba($primary-color, 0.05);
    border-left: 4px solid transparent;
    
    h4 {
      color: $primary-color;
      font-weight: 600;
      margin: 0 0 $spacing-small 0;
    }
    
    .task-success {
      border-left-color: #4CAF50;
      
      p {
        color: #388E3C;
        margin: 0;
        font-weight: 500;
      }
    }
    
    .task-fail {
      border-left-color: #FF9800;
      
      p {
        color: #F57C00;
        margin: 0;
        font-weight: 500;
      }
    }
  }
  
  .report-next-steps {
    margin-top: $spacing-large;
    padding-top: $spacing-large;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    
    h3 {
      color: $primary-color;
      font-weight: 700;
      margin-bottom: $spacing-medium;
      font-family: $font-family-display;
    }
    
    p {
      line-height: 1.5;
      margin-bottom: $spacing-small;
      color: $text-color;
    }
  }
}

.report-actions {
  padding: $spacing-large;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: $spacing-medium;
  justify-content: center;
}

.subscribe-content {
  padding: $spacing-xl;
  text-align: center;
  
  .subscribe-title {
    font-size: 1.8em;
    font-weight: 700;
    color: $primary-color;
    margin: 0 0 $spacing-medium 0;
    font-family: $font-family-display;
  }
  
  .subscribe-text {
    font-size: 1.1em;
    color: $text-color;
    line-height: 1.5;
    margin-bottom: $spacing-large;
  }
  
  .subscribe-form {
    display: flex;
    flex-direction: column;
    gap: $spacing-medium;
    align-items: center;
    
    .email-input {
      width: 100%;
      max-width: 300px;
      padding: $spacing-medium;
      border: 2px solid rgba($primary-color, 0.3);
      border-radius: 12px;
      font-size: 1em;
      outline: none;
      transition: border-color 0.2s ease;
      
      &:focus {
        border-color: $primary-color;
      }
      
      &::placeholder {
        color: rgba($text-color, 0.6);
      }
    }
  }
}

// === АНИМАЦИИ ===
@keyframes bounce-arrow {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes pulse-arrow {
  0% {
    opacity: 0.7;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

// === RESPONSIVE ===
@media (max-width: 768px) {
  .desktop-layout {
    .desktop-task-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-medium;
    }
    
    .desktop-task-card {
      min-height: 100px;
      padding: $spacing-medium;
      
      .task-number {
        font-size: 2em;
      }
      
      .task-name {
        font-size: 1em;
      }
    }
    
    .desktop-completion-message {
      flex-direction: column;
      gap: $spacing-medium;
      
      .completion-text {
        font-size: 1.2em;
      }
    }
    
    .desktop-button-area {
      flex-direction: column;
      align-items: center;
    }
  }
  
  .mobile-layout {
    .task-result-item {
      font-size: 12px;
      min-height: 32px;
      padding: 6px 4px;
      
      .task-icon {
        font-size: 12px;
      }
    }
  }
  
  .report-modal, .subscribe-modal {
    margin: $spacing-small;
    max-height: 90vh;
  }
  
  .report-content {
    max-height: 60vh;
  }
  
  .report-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .mobile-layout {
    .mobile-title {
      font-size: 1.8em;
    }
    
    .scroll-arrow {
      font-size: 2em;
    }
    
    .content-sections {
      padding: $spacing-medium;
      gap: $spacing-large;
    }
    
    .section-title {
      font-size: 14px;
    }
    
    .task-result-item {
      .task-name {
        font-size: 12px;
      }
      
      .task-status {
        font-size: 10px;
      }
    }
  }
}

// Убираем outline со всех элементов
* {
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  outline: none !important;
}

// Улучшаем прокрутку на мобильных устройствах
.scrollable-content {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.report-content {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba($primary-color, 0.3);
    border-radius: 2px;
    
    &:hover {
      background: rgba($primary-color, 0.5);
    }
  }
}
</style>