<template>
  <VideoBackground :videoName="videoName" @video-ready="onVideoReady">
    <!-- БЛЮРЕННЫЙ КОНТЕНТ-ОВЕРЛЕЙ С АНИМАЦИЕЙ -->
    <div 
      class="content-overlay-slide"
      :class="{ 
        'slide-up': contentVisible && !(showHappyTransition && isMobile),
        'slide-down': !contentVisible || (showHappyTransition && isMobile),
        'mobile-overlay': isMobile,
        'desktop-overlay': !isMobile
      }"
    >
      <div class="comic-content" :class="{ 'cr-mobile-layout': isMobile, 'cr-desktop-layout': !isMobile }">
        
        <!-- MOBILE VERSION -->
        <template v-if="isMobile">
          <div class="cr-mobile-content-wrapper">
            <div class="cr-content-area">
              <h2 class="cr-comic-title cr-mobile-title">{{ currentComic.title }}</h2>
              
              <div class="cr-text-area">
                <transition name="cr-text-fade" mode="out-in">
                  <p 
                    :key="currentPanel.id"
                    class="cr-panel-text"
                  >
                    {{ currentPanel.text }}
                  </p>
                </transition>
              </div>
            </div>
            
            <div class="cr-button-area" v-if="!showHappyTransition">
              <AppButton 
                v-if="currentPanelIndex < currentComic.panels.length" 
                type="primary"
                fullWidth
                @click="showNextPanel"
                :disabled="!videoReady"
              >
                {{ videoReady ? 'Next' : 'Loading...' }}
              </AppButton>
              <AppButton 
                v-else 
                type="accent"
                fullWidth
                @click="startMathTask"
                :disabled="!pageReady || isTransitioning"
              >
                {{ isTransitioning ? 'Starting...' : (pageReady ? 'Help Fluffy' : 'Loading...') }}
              </AppButton>
            </div>
          </div>
        </template>
        
        <!-- DESKTOP VERSION - КАК В HOME, НО БЕЗ ЛИШНЕГО КОНТЕЙНЕРА -->
        <template v-else>
          <div class="cr-desktop-comic-container">
            <h2 class="cr-comic-title cr-desktop-title">{{ currentComic.title }}</h2>
            
            <div class="cr-desktop-content-area">
              <div class="cr-content-area">
                <div class="cr-text-panels">
                  <div 
                    v-for="(panel, index) in visiblePanels" 
                    :key="panel.id"
                    class="cr-text-panel cr-fade-in"
                    :style="{ animationDelay: `${index * 0.3}s` }"
                  >
                    {{ panel.text }}
                  </div>
                </div>
              </div>
              
              <div class="cr-button-area" v-if="!showHappyTransition">
                <AppButton 
                  v-if="currentPanelIndex < currentComic.panels.length" 
                  type="primary"
                  large
                  @click="showNextPanel"
                  :disabled="!videoReady"
                  class="cr-desktop-button"
                >
                  {{ videoReady ? 'Next' : 'Loading...' }}
                </AppButton>
                <AppButton 
                  v-else 
                  type="accent"
                  large
                  @click="startMathTask"
                  :disabled="!pageReady || isTransitioning"
                  class="cr-desktop-button"
                >
                  {{ isTransitioning ? 'Starting...' : (pageReady ? 'Help Fluffy' : 'Loading...') }}
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AppButton from '@/components/common/AppButton.vue'
import VideoBackground from '@/components/game/VideoBackground.vue'
import { getDeviceType } from '@/utils/responsive'

export default {
  name: 'ComicReader',
  components: {
    AppButton,
    VideoBackground
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const currentPanelIndex = ref(1)
    const videoReady = ref(false)
    const pageReady = ref(true)
    const contentVisible = ref(false)
    const isTransitioning = ref(false)
    const showHappyTransition = ref(false)
    
    const isMobile = computed(() => {
      const deviceType = getDeviceType()
      return deviceType === 'mobile' || deviceType === 'tablet'
    })
    
    const currentLevel = computed(() => store.getters.currentLevel)
    
    const comicData = [
      {
        id: 1,
        title: "Meet Fluffy",
        panels: [
          {
            id: 1,
            text: "Hi, I'm Fluffy."
          },
          {
            id: 2,
            text: "I'm little and don't know a lot of things yet."
          },
          {
            id: 3,
            text: "Can you take care of me?"
          }
        ]
      }
    ]
    
    const currentComic = computed(() => {
      return comicData.find(comic => comic.id === currentLevel.value) || comicData[0]
    })
    
    const currentPanel = computed(() => {
      return currentComic.value.panels[currentPanelIndex.value - 1] || currentComic.value.panels[0]
    })
    
    const visiblePanels = computed(() => {
      return currentComic.value.panels.slice(0, currentPanelIndex.value)
    })
    
    const videoName = computed(() => {
      if (showHappyTransition.value) {
        return 'happy'
      }
      return 'storytelling'
    })
    
    const showNextPanel = () => {
      if (currentPanelIndex.value < currentComic.value.panels.length && videoReady.value) {
        currentPanelIndex.value++
        console.log('ComicReader: Показана панель', currentPanelIndex.value)
      }
    }
    
    const onVideoReady = () => {
      if (showHappyTransition.value) {
        console.log('ComicReader: Видео happy готово - начинаем переход к игре')
        videoReady.value = true
        
        setTimeout(() => {
          console.log('ComicReader: Переходим к MathGame после happy видео')
          router.push('/game')
        }, 3000)
        
      } else {
        console.log('ComicReader: Видео storytelling готово - все игровые видео уже загружены в App.vue!')
        videoReady.value = true
        pageReady.value = true
        
        setTimeout(() => {
          contentVisible.value = true
        }, 100)
      }
    }
    
    const startMathTask = () => {
      if (pageReady.value && videoReady.value && !isTransitioning.value) {
        console.log('ComicReader: Начинаем переход к игре через happy видео')
        
        isTransitioning.value = true
        
        if (isMobile.value) {
          setTimeout(() => {
            showHappyTransition.value = true
            videoReady.value = false
            console.log('ComicReader: Переключились на happy видео (мобильный)')
          }, 600)
        } else {
          setTimeout(() => {
            showHappyTransition.value = true
            videoReady.value = false
            console.log('ComicReader: Переключились на happy видео (десктоп)')
          }, 100)
        }
      }
    }
    
    onMounted(() => {
      console.log('ComicReader: Компонент загружен - все видео уже предзагружены в App.vue!')
    })
    
    return {
      currentComic,
      currentPanel,
      currentPanelIndex,
      visiblePanels,
      videoReady,
      pageReady,
      contentVisible,
      isTransitioning,
      showHappyTransition,
      videoName,
      showNextPanel,
      startMathTask,
      onVideoReady,
      isMobile
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

// === БЛЮРЕННЫЙ ОВЕРЛЕЙ (ТОЧНО КАК В HOME) ===
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
    border-radius: 20px; // ⭐ ВСЕ УГЛЫ СКРУГЛЕНЫ
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  }
}

.comic-content {
  width: 100%;
  height: 100%;
  font-family: $font-family-primary;
  position: relative;
  z-index: 300;
  overflow: hidden !important;
  
  filter: none !important;
  -webkit-filter: none !important;
}

// === MOBILE VERSION ===
.cr-mobile-layout {
  .cr-mobile-content-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 6px 12px 10px 12px;
    position: relative;
    z-index: 301;
    overflow: hidden !important;
  }
  
  .cr-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 10px;
    overflow: hidden !important;
  }
  
  .cr-mobile-title {
    font-size: 18px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    font-family: $font-family-display;
  }
  
  .cr-text-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 320px;
  }
  
  .cr-panel-text {
    font-size: 16px;
    line-height: 1.2;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.92);
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    max-width: 320px;
  }
  
  .cr-button-area {
    flex-shrink: 0;
    width: 100%;
    max-width: 280px;
    align-self: center;
    
    :deep(.btn) {
      padding: 10px 16px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      min-height: 36px !important;
      border-radius: 18px !important;
      
      &:disabled {
        opacity: 0.7 !important;
        cursor: not-allowed !important;
        
        &:not(.btn-accent) {
          animation: pulse 1.5s ease-in-out infinite;
        }
      }
    }
  }
}

// === DESKTOP VERSION - БЛЮРЕННЫЙ ФОН СТАНОВИТСЯ БЕЛЫМ ===
.cr-desktop-layout {
  // ⭐ ВАЖНО: Убираю дополнительные контейнеры, 
  // блюренный фон сам становится белым через CSS
  
  .cr-desktop-comic-container {
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
      
    // ⭐ ОРАНЖЕВАЯ ПОЛОСКА ПРЯМО НА БЛЮРЕННОМ БЛОКЕ
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
  
  .cr-desktop-title {
    font-size: 3.2em !important;
    font-weight: 900 !important;
    color: $primary-color !important;
    margin-bottom: 40px !important;
    line-height: 1.0 !important;
    font-family: $font-family-display !important;
    letter-spacing: -1px !important;
    text-shadow: none !important;
    text-align: center !important;
    margin-top: 20px !important; // Отступ от оранжевой полоски
    position: relative;
    z-index: 2; // ⭐ Поверх полоски
  }
  
  .cr-desktop-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 30px !important;
    width: 100% !important;
    max-width: 700px !important;
    position: relative;
    z-index: 2; // ⭐ Поверх полоски
  }
  
  .cr-content-area {
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .cr-text-panels {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 25px !important;
    padding: 0;
  }
  
  .cr-text-panel {
    font-size: 24px !important;
    line-height: 1.3 !important;
    font-weight: 700 !important;
    color: #2c2c2c !important;
    text-shadow: none !important;
    text-align: center !important;
    max-width: 450px;
    margin: 0 auto;
  }
  
  .cr-button-area {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    
    :deep(.btn) {
      padding: 20px 40px !important;
      font-size: 18px !important;
      font-weight: 900 !important;
      border-radius: 25px !important;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      min-height: 65px !important;
      min-width: 200px !important;
      
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
      
      &.btn-accent {
        background: linear-gradient(135deg, $accent-color 0%, darken($accent-color, 8%) 100%) !important;
        border: 4px solid darken($accent-color, 15%) !important;
        color: white !important;
        box-shadow: 
          0 15px 35px rgba($accent-color, 0.3),
          0 8px 20px rgba(0, 0, 0, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        
        &:hover:not(:disabled) {
          transform: translateY(-4px) scale(1.02) !important;
          box-shadow: 
            0 20px 50px rgba($accent-color, 0.4),
            0 12px 30px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        }
        
        &:active:not(:disabled) {
          transform: translateY(-2px) scale(1.01) !important;
        }
      }
      
      &:disabled {
        opacity: 0.7 !important;
        cursor: not-allowed !important;
        transform: none;
        
        &:not(.btn-accent) {
          animation: pulse 1.5s ease-in-out infinite;
        }
      }
    }
  }
}

// ⭐ КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: БЛЮРЕННЫЙ ФОН НА ДЕСКТОПЕ СТАНОВИТСЯ БЕЛЫМ
.cr-desktop-layout .content-overlay-slide.desktop-overlay {
  background: #ffffff !important; // ⭐ БЕЛЫЙ ФОН ВМЕСТО БЛЮРА
  backdrop-filter: none !important; // ⭐ УБИРАЕМ БЛЮР
  -webkit-backdrop-filter: none !important; // ⭐ УБИРАЕМ БЛЮР
}

// === АДАПТАЦИИ ===

// Планшеты (768px - 1024px)
@media (min-width: 768px) and (max-width: 1024px) {
  .content-overlay-slide.desktop-overlay {
    border-radius: 18px;
    background: #ffffff !important;
    backdrop-filter: none !important;
  }
  
  .cr-desktop-layout {
    .cr-desktop-comic-container {
      padding: 30px 40px;
      
      &::before {
        border-radius: 18px 18px 0 0;
      }
    }
  }
  
  .cr-desktop-title {
    font-size: 2.8em !important;
    margin-bottom: 30px !important;
  }
  
  .cr-text-panel {
    font-size: 22px !important;
  }
  
  .cr-desktop-content-area {
    gap: 25px !important;
  }
  
  .cr-text-panels {
    gap: 20px !important;
  }
  
  .cr-button-area :deep(.btn) {
    padding: 16px 32px !important;
    font-size: 16px !important;
    min-height: 55px !important;
    min-width: 180px !important;
    border-radius: 20px !important;
  }
}

// Средние десктопы (1024px - 1366px)
@media (min-width: 1024px) and (max-width: 1366px) {
  .content-overlay-slide.desktop-overlay {
    border-radius: 20px;
    background: #ffffff !important;
    backdrop-filter: none !important;
  }
  
  .cr-desktop-layout {
    .cr-desktop-comic-container {
      padding: 35px 50px;
      
      &::before {
        border-radius: 20px 20px 0 0;
      }
    }
  }
  
  .cr-desktop-title {
    font-size: 3.0em !important;
    margin-bottom: 35px !important;
  }
  
  .cr-text-panel {
    font-size: 23px !important;
  }
  
  .cr-desktop-content-area {
    gap: 28px !important;
  }
  
  .cr-text-panels {
    gap: 22px !important;
  }
  
  .cr-button-area :deep(.btn) {
    padding: 18px 36px !important;
    font-size: 17px !important;
    min-height: 60px !important;
    min-width: 190px !important;
    border-radius: 22px !important;
  }
}

// Большие экраны (1366px - 1600px)
@media (min-width: 1367px) and (max-width: 1600px) {
  .content-overlay-slide.desktop-overlay {
    border-radius: 22px;
    background: #ffffff !important;
    backdrop-filter: none !important;
  }
  
  .cr-desktop-layout {
    .cr-desktop-comic-container {
      padding: 50px 70px;
      
      &::before {
        border-radius: 22px 22px 0 0;
      }
    }
  }
  
  .cr-desktop-title {
    font-size: 3.6em !important;
    margin-bottom: 50px !important;
  }
  
  .cr-text-panel {
    font-size: 24px !important;
  }
  
  .cr-desktop-content-area {
    gap: 35px !important;
  }
  
  .cr-text-panels {
    gap: 28px !important;
  }
  
  .cr-button-area :deep(.btn) {
    padding: 22px 44px !important;
    font-size: 19px !important;
    min-height: 70px !important;
    min-width: 220px !important;
    border-radius: 28px !important;
  }
}

// Очень большие экраны (1600px+)
@media (min-width: 1601px) {
  .content-overlay-slide.desktop-overlay {
    border-radius: 24px;
    background: #ffffff !important;
    backdrop-filter: none !important;
  }
  
  .cr-desktop-layout {
    .cr-desktop-comic-container {
      padding: 60px 80px;
      
      &::before {
        border-radius: 24px 24px 0 0;
      }
    }
  }
  
  .cr-desktop-title {
    font-size: 4.0em !important;
    margin-bottom: 60px !important;
  }
  
  .cr-text-panel {
    font-size: 26px !important;
  }
  
  .cr-desktop-content-area {
    gap: 40px !important;
  }
  
  .cr-text-panels {
    gap: 30px !important;
  }
  
  .cr-button-area :deep(.btn) {
    padding: 25px 50px !important;
    font-size: 21px !important;
    min-height: 75px !important;
    min-width: 240px !important;
    border-radius: 30px !important;
  }
}

// === МОБИЛЬНЫЕ АДАПТАЦИИ ===
@media (max-width: 360px) {
  .cr-mobile-layout {
    .cr-mobile-title {
      font-size: 15px;
    }
    
    .cr-panel-text {
      font-size: 14px;
      max-width: 280px;
    }
    
    .cr-button-area {
      max-width: 250px;
      
      :deep(.btn) {
        font-size: 12px !important;
        min-height: 32px !important;
        border-radius: 16px !important;
      }
    }
  }
}

@media (max-height: 600px) {
  .cr-mobile-layout {
    .cr-mobile-content-wrapper {
      padding: 4px 10px 8px 10px;
    }
    
    .cr-content-area {
      gap: 8px;
    }
    
    .cr-mobile-title {
      font-size: 15px;
    }
    
    .cr-panel-text {
      font-size: 14px;
    }
    
    :deep(.btn) {
      font-size: 11px !important;
      min-height: 28px !important;
      border-radius: 14px !important;
    }
  }
}

@media (max-width: $breakpoint-mobile) and (orientation: landscape) and (max-height: 500px) {
  .cr-mobile-layout {
    .cr-mobile-content-wrapper {
      padding: 2px 8px 6px 8px;
    }
    
    .cr-content-area {
      gap: 6px;
    }
    
    .cr-mobile-title {
      font-size: 13px;
    }
    
    .cr-panel-text {
      font-size: 12px;
      max-width: 280px;
    }
    
    :deep(.btn) {
      font-size: 10px !important;
      min-height: 24px !important;
      border-radius: 12px !important;
    }
  }
}

@media (min-height: 800px) and (max-width: $breakpoint-mobile) {
  .cr-mobile-layout {
    .cr-mobile-content-wrapper {
      padding: 8px 15px 12px 15px;
    }
    
    .cr-content-area {
      gap: 12px;
    }
    
    .cr-mobile-title {
      font-size: 20px;
    }
    
    .cr-panel-text {
      font-size: 18px;
      max-width: 350px;
    }
    
    .cr-button-area {
      max-width: 320px;
      
      :deep(.btn) {
        font-size: 15px !important;
        min-height: 40px !important;
        border-radius: 20px !important;
      }
    }
  }
}

// Анимации
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.cr-text-fade-enter-active {
  transition: all 0.4s ease;
}

.cr-text-fade-leave-active {
  transition: all 0.3s ease;
}

.cr-text-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.cr-text-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.cr-fade-in {
  animation: cr-fadeIn 0.8s ease forwards;
  opacity: 0;
}

@keyframes cr-fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(15px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

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
