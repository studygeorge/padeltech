
<template>
  <!-- Основной контент Home БЕЗ дополнительных лоадеров -->
  <VideoBackground videoName="welcome" @video-ready="onVideoReady">
    <!-- БЛЮРЕННЫЙ КОНТЕНТ-ОВЕРЛЕЙ С АНИМАЦИЕЙ -->
    <div 
      class="content-overlay-slide"
      :class="{ 
        'slide-up': contentVisible,
        'slide-down': !contentVisible,
        'mobile-overlay': isMobile,
        'desktop-overlay': !isMobile
      }"
    >
      <div class="home-content" :class="{ 'mobile-layout': isMobile, 'desktop-layout': !isMobile }">
        
        <!-- МОБИЛЬНАЯ ВЕРСИЯ - АДАПТИРОВАНА ПОД 20% ЭКРАНА -->
        <template v-if="isMobile">
          <div class="mobile-content-wrapper">
            <div class="mobile-form-section">
              <p class="game-description mobile-description">
                An exciting journey into mathematics!
              </p>
              
              <div class="player-form">
                <AppButton 
                  type="primary" 
                  fullWidth
                  @click="startAdventure"
                  :disabled="isStarting || !videoReady"
                  class="start-button"
                >
                  {{ isStarting ? 'Starting...' : !videoReady ? 'Loading...' : 'Start Adventure' }}
                </AppButton>
              </div>
            </div>
          </div>
        </template>
        
        <!-- ДЕСКТОПНАЯ ВЕРСИЯ - НОВАЯ АДАПТИВНАЯ СТРУКТУРА -->
        <template v-else>
          <div class="desktop-home-content">
            <div class="desktop-home-container">
              <h1 class="game-title desktop-title">AdaptSmart</h1>
              <p class="game-description desktop-description">
                An exciting journey into the world of mathematics with Fluffy the kitten!
              </p>
              
              <div class="player-form desktop-form">
                <AppButton 
                  type="primary" 
                  large 
                  @click="startAdventure"
                  :disabled="isStarting || !videoReady"
                  class="desktop-start-button"
                >
                  {{ isStarting ? 'Starting...' : !videoReady ? 'Loading...' : 'Start Adventure' }}
                </AppButton>
              </div>
            </div>
          </div>
        </template>
        
      </div>
    </div>
  </VideoBackground>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
import VideoBackground from '@/components/game/VideoBackground.vue'
import { getDeviceType } from '@/utils/responsive'

export default {
  name: 'HomePage',
  components: {
    AppButton,
    VideoBackground
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const isStarting = ref(false)
    const videoReady = ref(false)
    const contentVisible = ref(false)
    
    const isMobile = computed(() => {
      const deviceType = getDeviceType()
      return deviceType === 'mobile' || deviceType === 'tablet'
    })
    
    const onVideoReady = () => {
      videoReady.value = true
      console.log('Home: Видео welcome готово - все видео уже предзагружены в App.vue!')
      
      // ПОКАЗЫВАЕМ контент с задержкой
      setTimeout(() => {
        contentVisible.value = true
      }, 100)
    }
    
    const startAdventure = async () => {
      if (isStarting.value || !videoReady.value) return
      
      console.log('Home: Начинаем приключение...')
      isStarting.value = true
      
      try {
        const playerName = 'Friend'
        console.log('Home: Устанавливаем имя игрока:', playerName)
        await store.dispatch('setPlayerName', playerName)
        
        console.log('Home: Устанавливаем уровень 1')
        await store.dispatch('setCurrentLevel', 1)
        
        // ПРЯМОЙ переход БЕЗ лоадеров - все видео уже загружены!
        console.log('Home: Мгновенный переход к комиксу - БЕЗ лоадеров!')
        router.push('/comic')
        
      } catch (error) {
        console.error('Home: Ошибка при запуске:', error)
        isStarting.value = false
      }
    }
    
    onMounted(() => {
      console.log('Home: Компонент загружен - все видео уже предзагружены в App.vue!')
    })
    
    return {
      isStarting,
      videoReady,
      contentVisible,
      startAdventure,
      onVideoReady,
      isMobile
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

// === БЛЮРЕННЫЙ ОВЕРЛЕЙ (КАК В ИГРЕ) ===
.content-overlay-slide {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateY(100%);
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &.slide-up {
    transform: translateY(0);
  }
  
  &.slide-down {
    transform: translateY(100%);
  }
  
  &.mobile-overlay {
    background: rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.1);
  }
  
  &.desktop-overlay {
    background: rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  }
}

.home-content {
  width: 100%;
  height: 100%;
  font-family: $font-family-primary;
  position: relative;
  z-index: 300;
  overflow: hidden !important;
  
  // БЕЗ БЛЮРА НА КОНТЕНТЕ!
  filter: none !important;
  -webkit-filter: none !important;
}

// === МОБИЛЬНАЯ ВЕРСИЯ ===
.mobile-layout {
  .mobile-content-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 6px 12px 12px 12px;
    position: relative;
    z-index: 301;
    overflow: hidden !important;
  }
  
  .mobile-form-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    max-width: 300px;
    height: 100%;
  }
  
  .mobile-description {
    font-size: 14px;
    line-height: 1.3;
    color: rgba(255, 255, 255, 0.95);
    margin: 0;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    text-align: center;
    
    filter: none !important;
    -webkit-filter: none !important;
  }
  
  .player-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    
    :deep(.btn.btn-primary.btn-fullWidth) {
      font-size: 14px !important;
      font-weight: 600 !important;
      min-height: 40px !important;
      border-radius: 20px !important;
      padding: 10px 16px !important;
      transition: all 0.3s ease;
      
      filter: none !important;
      -webkit-filter: none !important;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($primary-color, 0.4);
      }
      
      &:active:not(:disabled) {
        transform: translateY(-1px);
      }
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
        animation: pulse 1.5s ease-in-out infinite;
      }
    }
  }
}

// === ДЕСКТОПНАЯ ВЕРСИЯ ===
.desktop-layout {
  .desktop-home-content {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 100;
    overflow: hidden;
    background: #ffffff !important;
    border-radius: 20px;
    
    // Красивый оранжевый топ
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 8px;
      background: linear-gradient(90deg, $primary-color 0%, $accent-color 100%);
      border-radius: 20px 20px 0 0;
      z-index: 1;
    }
  }
  
  .desktop-home-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 101;
    overflow: hidden;
    padding: 40px 60px;
    justify-content: center;
    align-items: center;
    background: transparent !important;
    box-shadow: 
      0 40px 80px rgba(0, 0, 0, 0.12),
      0 20px 40px rgba(0, 0, 0, 0.08);
  }
  
  .desktop-title {
    font-size: 4.2em !important;
    font-weight: 900 !important;
    color: $primary-color !important;
    margin-bottom: 40px !important;
    line-height: 1.0 !important;
    font-family: $font-family-display !important;
    letter-spacing: -2px !important;
    text-shadow: none !important;
    text-align: center !important;
    margin-top: 20px !important; // Отступ от оранжевой полоски
    
    filter: none !important;
    -webkit-filter: none !important;
  }
  
  .desktop-description {
    font-size: 24px !important;
    line-height: 1.4 !important;
    color: #1a1a1a !important;
    margin-bottom: 60px !important;
    font-weight: 600 !important;
    max-width: 650px !important;
    letter-spacing: -0.5px !important;
    text-align: center !important;
    text-shadow: none !important;
    
    filter: none !important;
    -webkit-filter: none !important;
  }
  
  .desktop-form {
    display: flex;
    flex-direction: column;
    gap: 30px !important;
    align-items: center !important;
    width: 100% !important;
    max-width: 600px !important;
    
    :deep(.btn) {
      padding: 20px 40px !important;
      font-size: 22px !important;
      font-weight: 900 !important;
      border-radius: 25px !important;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      min-height: 70px !important;
      min-width: 280px !important;
      
      filter: none !important;
      -webkit-filter: none !important;
      
      &.btn-primary {
        background: linear-gradient(135deg, $primary-color 0%, darken($primary-color, 8%) 100%) !important;
        border: 4px solid darken($primary-color, 15%) !important;
        color: white !important;
        box-shadow: 
          0 15px 35px rgba($primary-color, 0.3),
          0 8px 20px rgba(0, 0, 0, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        
        &:hover:not(:disabled) {
          transform: translateY(-4px) scale(1.02) !important;
          box-shadow: 
            0 20px 50px rgba($primary-color, 0.4),
            0 12px 30px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        }
        
        &:active:not(:disabled) {
          transform: translateY(-2px) scale(1.01) !important;
        }
      }
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
        animation: pulse 1.5s ease-in-out infinite;
      }
    }
  }
}

// === АДАПТАЦИИ ДЛЯ РАЗНЫХ РАЗМЕРОВ ПК ===

// Планшеты (768px - 1024px)
@media (min-width: 768px) and (max-width: 1024px) {
  .desktop-layout {
    .desktop-overlay {
      border-radius: 18px;
    }
    
    .desktop-home-content {
      border-radius: 18px;
      
      &::before {
        border-radius: 18px 18px 0 0;
      }
    }
    
    .desktop-home-container {
      padding: 30px 40px;
    }
  }
  
  .desktop-title {
    font-size: 3.2em !important;
    margin-bottom: 30px !important;
  }
  
  .desktop-description {
    font-size: 20px !important;
    margin-bottom: 45px !important;
  }
  
  .desktop-form {
    gap: 25px !important;
    
    :deep(.btn) {
      padding: 16px 32px !important;
      font-size: 18px !important;
      min-height: 60px !important;
      min-width: 240px !important;
      border-radius: 20px !important;
    }
  }
}

// Средние десктопы (1024px - 1366px)
@media (min-width: 1024px) and (max-width: 1366px) {
  .desktop-layout {
    .desktop-overlay {
      border-radius: 20px;
    }
    
    .desktop-home-content {
      border-radius: 20px;
      
      &::before {
        border-radius: 20px 20px 0 0;
      }
    }
    
    .desktop-home-container {
      padding: 35px 50px;
    }
  }
  
  .desktop-title {
    font-size: 3.8em !important;
    margin-bottom: 35px !important;
  }
  
  .desktop-description {
    font-size: 22px !important;
    margin-bottom: 50px !important;
  }
  
  .desktop-form {
    :deep(.btn) {
      padding: 18px 36px !important;
      font-size: 20px !important;
      min-height: 65px !important;
      min-width: 260px !important;
      border-radius: 22px !important;
    }
  }
}

// Большие экраны (1366px - 1600px)
@media (min-width: 1367px) and (max-width: 1600px) {
  .desktop-layout {
    .desktop-overlay {
      border-radius: 22px;
    }
    
    .desktop-home-content {
      border-radius: 22px;
      
      &::before {
        border-radius: 22px 22px 0 0;
      }
    }
    
    .desktop-home-container {
      padding: 50px 70px;
    }
  }
  
  .desktop-title {
    font-size: 4.8em !important;
    margin-bottom: 50px !important;
  }
  
  .desktop-description {
    font-size: 26px !important;
    margin-bottom: 70px !important;
  }
  
  .desktop-form {
    gap: 35px !important;
    
    :deep(.btn) {
      padding: 22px 44px !important;
      font-size: 24px !important;
      min-height: 75px !important;
      min-width: 300px !important;
      border-radius: 28px !important;
    }
  }
}

// Очень большие экраны (1600px+)
@media (min-width: 1601px) {
  .desktop-layout {
    .desktop-overlay {
      border-radius: 24px;
    }
    
    .desktop-home-content {
      border-radius: 24px;
      
      &::before {
        border-radius: 24px 24px 0 0;
      }
    }
    
    .desktop-home-container {
      padding: 60px 80px;
    }
  }
  
  .desktop-title {
    font-size: 5.2em !important;
    margin-bottom: 60px !important;
  }
  
  .desktop-description {
    font-size: 28px !important;
    margin-bottom: 80px !important;
  }
  
  .desktop-form {
    gap: 40px !important;
    
    :deep(.btn) {
      padding: 25px 50px !important;
      font-size: 26px !important;
      min-height: 80px !important;
      min-width: 320px !important;
      border-radius: 30px !important;
    }
  }
}

// Анимация пульсации для состояния загрузки
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

// === МОБИЛЬНЫЕ АДАПТАЦИИ ===
@media (max-width: 360px) {
  .mobile-layout {
    .mobile-form-section {
      max-width: 260px;
      gap: 15px;
    }
    
    .mobile-description {
      font-size: 12px;
    }
    
    :deep(.btn) {
      font-size: 12px !important;
      min-height: 36px !important;
      padding: 8px 12px !important;
      border-radius: 18px !important;
    }
  }
}

@media (max-height: 600px) {
  .mobile-layout {
    .mobile-content-wrapper {
      padding: 4px 10px 10px 10px;
    }
    
    .mobile-form-section {
      gap: 15px;
    }
    
    .mobile-description {
      font-size: 12px;
    }
    
    :deep(.btn) {
      font-size: 12px !important;
      min-height: 34px !important;
      border-radius: 17px !important;
    }
  }
}

@media (max-width: $breakpoint-mobile) and (orientation: landscape) and (max-height: 500px) {
  .mobile-layout {
    .mobile-content-wrapper {
      padding: 2px 8px 8px 8px;
    }
    
    .mobile-form-section {
      gap: 10px;
      max-width: 240px;
    }
    
    .mobile-description {
      font-size: 11px;
    }
    
    :deep(.btn) {
      font-size: 11px !important;
      min-height: 30px !important;
      border-radius: 15px !important;
    }
  }
}

@media (min-height: 800px) and (max-width: $breakpoint-mobile) {
  .mobile-layout {
    .mobile-content-wrapper {
      padding: 8px 15px 15px 15px;
    }
    
    .mobile-form-section {
      max-width: 320px;
      gap: 25px;
    }
    
    .mobile-description {
      font-size: 16px;
    }
    
    :deep(.btn) {
      font-size: 16px !important;
      min-height: 46px !important;
      padding: 12px 20px !important;
      border-radius: 23px !important;
    }
  }
}

// УБИРАЕМ outline и фокусы
* {
  outline: none !important;
  -webkit-tap-highlight-color: transparent !important;
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