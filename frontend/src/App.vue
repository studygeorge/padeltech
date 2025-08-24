<template>
  <div id="app">
    <!-- Глобальный лоадер ТОЛЬКО при первом запуске -->
    <LoadingScreen 
      v-if="showInitialLoader"
      :loaded="allVideosPreloaded"
      :loadingText="currentLoadingText"
      :previewVideo="'/assets/images/characters/cat/welcome.mp4'"
      :minLoadTime="2000"
      :waitForTargetVideo="false"
      @ready="hideInitialLoader"
    />
    
    <!-- Основной контент - показывается ТОЛЬКО когда все готово -->
    <div class="app-content" :class="{ 'content-visible': !showInitialLoader }">
      <router-view v-if="!showInitialLoader" v-slot="{ Component, route }">
        <transition 
          name="page-fade" 
          mode="out-in"
          :duration="{ enter: 50, leave: 50 }"
        >
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import LoadingScreen from '@/components/common/LoadingScreen.vue'

export default {
  name: 'App',
  components: {
    LoadingScreen
  },
  setup() {
    const showInitialLoader = ref(true)
    const allVideosPreloaded = ref(false)
    const currentLoadingText = ref('Loading AdaptSmart...')
    const emergencyHideTimeout = ref(null)
    
    // Инициализация мобильного viewport
    const setMobileViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    
    // Скрыть лоадер когда ВСЕ готово
    const hideInitialLoader = () => {
      console.log('App: ВСЕ ГОТОВО - скрываем лоадер навсегда')
      showInitialLoader.value = false
      
      if (emergencyHideTimeout.value) {
        clearTimeout(emergencyHideTimeout.value)
        emergencyHideTimeout.value = null
      }
    }
    
    // Принудительное скрытие лоадера по таймауту
    const forceHideLoader = () => {
      console.warn('App: Принудительное скрытие лоадера по аварийному таймауту')
      allVideosPreloaded.value = true
      showInitialLoader.value = false
    }
    
    // ПРЕДЗАГРУЗКА ВСЕХ ОСНОВНЫХ ВИДЕО при старте приложения
    const preloadAllGameVideos = async () => {
      console.log('App: Предзагрузка ВСЕХ игровых видео...')
      currentLoadingText.value = 'Loading all videos...'
      
      const allGameVideos = [
        // Основные видео
        '/assets/images/characters/cat/welcome.mp4',
        '/assets/images/characters/cat/storytelling.mp4',
        '/assets/images/characters/cat/просто машет ручками мило.mp4',
        '/assets/images/characters/cat/показывает рузльтаты 7 этап.mp4',
        
        // Видео заданий
        '/assets/images/characters/cat/на кассе стоит 1 уровень_в1.mp4',
        '/assets/images/characters/cat/возле двери стоит 2 уровень.mp4',
        '/assets/images/characters/cat/стол смотри 3 уровень.mp4',
        '/assets/images/characters/cat/смотрит на миску думает 4 уровень.mp4',
        '/assets/images/characters/cat/улыбается смотриит на тарелочку 5 уровень.mp4',
        '/assets/images/characters/cat/ставит печенье в печку 6 уровень конец .mp4'
      ]
      
      let loadedCount = 0
      const totalVideos = allGameVideos.length
      
      const loadVideo = (src, index) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const video = document.createElement('video')
            video.src = src
            video.preload = 'auto'
            video.muted = true
            video.playsInline = true
            
            const fileName = src.split('/').pop()
            let resolved = false
            
            const onSuccess = () => {
              if (resolved) return
              resolved = true
              
              loadedCount++
              console.log(`App: ✅ Видео загружено [${loadedCount}/${totalVideos}]:`, fileName)
              currentLoadingText.value = `Loading videos... ${loadedCount}/${totalVideos}`
              cleanup()
              resolve(true)
            }
            
            const onError = (error) => {
              if (resolved) return
              resolved = true
              
              loadedCount++
              console.warn(`App: ❌ Ошибка видео [${loadedCount}/${totalVideos}]:`, fileName, error)
              currentLoadingText.value = `Loading videos... ${loadedCount}/${totalVideos}`
              cleanup()
              resolve(false)
            }
            
            const cleanup = () => {
              video.removeEventListener('loadeddata', onSuccess)
              video.removeEventListener('canplaythrough', onSuccess)
              video.removeEventListener('loadedmetadata', onSuccess)
              video.removeEventListener('error', onError)
            }
            
            video.addEventListener('loadeddata', onSuccess, { once: true })
            video.addEventListener('canplaythrough', onSuccess, { once: true })
            video.addEventListener('loadedmetadata', onSuccess, { once: true })
            video.addEventListener('error', onError, { once: true })
            
            video.load()
            
            // Таймаут для конкретного видео
            setTimeout(() => {
              if (!resolved) {
                console.warn(`App: ⏰ Таймаут видео:`, fileName)
                onError(new Error('timeout'))
              }
            }, 6000) // 6 секунд на видео
            
          }, index * 100) // УСКОРЕНО до 100мс между видео
        })
      }
      
      try {
        // Загружаем все видео параллельно для скорости
        await Promise.all(
          allGameVideos.map((src, index) => loadVideo(src, index))
        )
        
        console.log('App: 🎬 ВСЕ ВИДЕО ЗАГРУЖЕНЫ! Теперь переходы будут мгновенными')
        allVideosPreloaded.value = true
        currentLoadingText.value = 'Ready to play!'
        
      } catch (error) {
        console.error('App: Критическая ошибка загрузки видео:', error)
        // Все равно продолжаем
        allVideosPreloaded.value = true
      }
    }
    
    onMounted(() => {
      console.log('App: 🚀 ЗАПУСК ПРИЛОЖЕНИЯ - загружаем ВСЕ видео сразу')
      
      setMobileViewportHeight()
      window.addEventListener('resize', setMobileViewportHeight)
      window.addEventListener('orientationchange', () => {
        setTimeout(setMobileViewportHeight, 100)
      })
      
      // Устанавливаем аварийный таймаут
      emergencyHideTimeout.value = setTimeout(forceHideLoader, 12000) // УСКОРЕНО до 12 секунд
      
      // НАЧИНАЕМ предзагрузку ВСЕХ видео сразу
      preloadAllGameVideos()
    })
    
    onUnmounted(() => {
      if (emergencyHideTimeout.value) {
        clearTimeout(emergencyHideTimeout.value)
      }
      window.removeEventListener('resize', setMobileViewportHeight)
      window.removeEventListener('orientationchange', setMobileViewportHeight)
    })
    
    return {
      showInitialLoader,
      allVideosPreloaded,
      currentLoadingText,
      hideInitialLoader
    }
  }
}
</script>

<style lang="scss">
@import './styles/variables.scss';

:root {
  --vh: 1vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  background-color: #f9f9f9 !important;
}

body {
  font-family: $font-family-primary;
  background-color: #f9f9f9 !important;
  font-size: 16px;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  overflow: hidden;
  font-family: $font-family-primary;
  background-color: #f9f9f9 !important;
  position: relative;
}

.app-content {
  height: 100%;
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
  overflow: hidden;
  background-color: #f9f9f9 !important;
  position: absolute;
  top: 0;
  left: 0;
  
  &.content-visible {
    opacity: 1;
  }
}

// === МГНОВЕННЫЕ ПЕРЕХОДЫ СТРАНИЦ (БЕЗ белых экранов) ===
.page-fade-enter-active {
  transition: opacity 0.05s ease; // ОЧЕНЬ БЫСТРО
}

.page-fade-leave-active {
  transition: opacity 0.05s ease; // ОЧЕНЬ БЫСТРО
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0.9; // НЕ полностью прозрачный - избегаем белых экранов
}

// === СТИЛИ ДЛЯ КНОПОК ===
.btn-primary {
  background: linear-gradient(135deg, $primary-color, darken($primary-color, 8%));
  color: white;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, darken($primary-color, 5%), darken($primary-color, 12%));
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($primary-color, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

.btn-accent {
  background: linear-gradient(135deg, $accent-color, darken($accent-color, 8%));
  color: white;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, darken($accent-color, 5%), darken($accent-color, 12%));
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($accent-color, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

// === ПРЕДОТВРАЩЕНИЕ ЧЕРНОГО/БЕЛОГО ЭКРАНА ===
*:not(video):not(canvas) {
  background-color: transparent;
}

.router-view {
  background-color: transparent !important;
}

button {
  font-family: $font-family-primary;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  outline: none !important;
  -webkit-tap-highlight-color: transparent !important;
  
  &:focus {
    outline: none !important;
  }
}

input {
  font-family: $font-family-primary;
  outline: none !important;
  
  &:focus {
    outline: none !important;
  }
}

h1, h2, h3, h4, h5, h6 {
  font-family: $font-family-display;
  font-weight: 700;
}

* {
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  outline: none !important;
}

// КРИТИЧНО: ВСЕГДА СВЕТЛЫЙ ФОН
html::before,
body::before,
#app::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
  z-index: -10000;
  pointer-events: none;
}

video {
  background-color: transparent !important;
  
  &::before {
    display: none !important;
  }
}

.home-content,
.comic-content,
.game-content {
  background-color: transparent !important;
}

// ПРИНУДИТЕЛЬНОЕ ПРЕДОТВРАЩЕНИЕ БЕЛЫХ ЭКРАНОВ
.page-fade-enter-active,
.page-fade-leave-active,
.page-fade-enter-from,
.page-fade-leave-to {
  background-color: #f9f9f9 !important;
}
</style>