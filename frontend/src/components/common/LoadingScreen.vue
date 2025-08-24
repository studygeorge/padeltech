<template>
  <div class="loading-screen" :class="{ 'fade-out': shouldHide }">
    <div class="loading-content">
      <div class="logo">AdaptSmart</div>
      
      <!-- Превью видео -->
      <div v-if="previewVideo" class="video-preview">
        <video
          ref="previewVideoRef"
          :src="previewVideo"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          @loadeddata="onVideoLoaded"
          @canplay="onVideoLoaded"
          @error="onVideoError"
        />
      </div>
      
      <!-- Paw prints анимация -->
      <div class="paw-prints-container">
        <div class="paw paw1"></div>
        <div class="paw paw2"></div>
        <div class="paw paw3"></div>
        <div class="paw paw4"></div>
        <div class="paw paw5"></div>
      </div>
      
      <div class="loading-text">{{ currentLoadingText }}</div>
      
      <div class="tip-container">
        <p class="tip-title">Tip of the Day:</p>
        <p class="tip-text">{{ currentTip }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export default {
  name: 'LoadingScreen',
  props: {
    loaded: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: 'Loading...'
    },
    previewVideo: {
      type: String,
      default: null
    },
    minLoadTime: {
      type: Number,
      default: 2000
    },
    waitForTargetVideo: {
      type: Boolean,
      default: false
    }
  },
  emits: ['video-loaded', 'ready'],
  setup(props, { emit }) {
    const tips = [
      'Small steps lead to big knowledge!',
      'Mathematics is everywhere around us - notice it every day!',
      'Regular math practice develops logical thinking.',
      "Don't be afraid to make mistakes - we learn from them!",
      'If a problem seems difficult, break it into smaller parts.'
    ]
    
    const currentTip = ref(tips[Math.floor(Math.random() * tips.length)])
    const previewVideoRef = ref(null)
    const previewVideoLoaded = ref(false)
    const targetVideoReady = ref(false)
    const minTimeElapsed = ref(false)
    const interval = ref(null)
    const emergencyTimeout = ref(null)
    
    // УПРОЩЕННАЯ логика для быстрых переходов
    const currentLoadingText = computed(() => {
      if (!previewVideoLoaded.value && props.previewVideo) {
        return 'Loading preview...'
      }
      if (props.waitForTargetVideo && !targetVideoReady.value) {
        return 'Preparing content...'
      }
      if (!minTimeElapsed.value) {
        return props.loadingText
      }
      return 'Almost ready...'
    })
    
    const shouldHide = computed(() => {
      const previewReady = previewVideoLoaded.value || !props.previewVideo
      const targetReady = targetVideoReady.value || !props.waitForTargetVideo
      const timeReady = minTimeElapsed.value
      
      // Для быстрых переходов - минимум условий
      return previewReady && targetReady && timeReady && (props.loaded || props.waitForTargetVideo)
    })
    
    const onVideoLoaded = () => {
      console.log('LoadingScreen: Preview video loaded')
      previewVideoLoaded.value = true
      emit('video-loaded')
      checkIfReady()
    }
    
    const onVideoError = () => {
      console.warn('LoadingScreen: Preview video error - продолжаем без него')
      previewVideoLoaded.value = true
      checkIfReady()
    }
    
    const checkIfReady = () => {
      if (shouldHide.value) {
        console.log('LoadingScreen: ✅ Готово - скрываем лоадер')
        
        if (emergencyTimeout.value) {
          clearTimeout(emergencyTimeout.value)
          emergencyTimeout.value = null
        }
        
        emit('ready')
      }
    }
    
    const forceHide = () => {
      console.warn('LoadingScreen: ⏰ Принудительное скрытие')
      previewVideoLoaded.value = true
      targetVideoReady.value = true
      minTimeElapsed.value = true
      emit('ready')
    }
    
    const startMinTimer = () => {
      setTimeout(() => {
        console.log('LoadingScreen: Минимальное время прошло')
        minTimeElapsed.value = true
        checkIfReady()
      }, props.minLoadTime)
    }
    
    watch(() => props.loaded, () => {
      checkIfReady()
    })
    
    onMounted(() => {
      // Смена подсказок
      interval.value = setInterval(() => {
        currentTip.value = tips[Math.floor(Math.random() * tips.length)]
      }, 5000)
      
      startMinTimer()
      
      // Аварийный таймаут
      emergencyTimeout.value = setTimeout(forceHide, 6000) // Уменьшено до 6 секунд
      
      // Быстрая инициализация
      if (!props.previewVideo) {
        previewVideoLoaded.value = true
      }
      
      if (!props.waitForTargetVideo) {
        targetVideoReady.value = true
      }
      
      checkIfReady()
    })
    
    onUnmounted(() => {
      if (interval.value) clearInterval(interval.value)
      if (emergencyTimeout.value) clearTimeout(emergencyTimeout.value)
    })
    
    return {
      currentTip,
      previewVideoRef,
      currentLoadingText,
      shouldHide,
      onVideoLoaded,
      onVideoError
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f9f9f9 0%, #e8f4f8 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  transition: opacity 0.8s ease; // Быстрее переход
  opacity: 1;
  font-family: $font-family-primary;
  
  &.fade-out {
    opacity: 0;
    pointer-events: none;
  }
}

.loading-content {
  width: 80%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo {
  font-size: 36px;
  font-weight: 900;
  color: $primary-color;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  font-family: $font-family-display;
  letter-spacing: -0.02em;
}

.video-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 3px solid rgba($primary-color, 0.3);
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.paw-prints-container {
  position: relative;
  width: 200px;
  height: 50px;
  margin-bottom: 20px;
}

.paw {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: $primary-color;
  border-radius: 50%;
  opacity: 0;
  
  &::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: $primary-color;
    border-radius: 50%;
    top: -10px;
    left: -5px;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: $primary-color;
    border-radius: 50%;
    top: -10px;
    right: -5px;
  }
}

.paw1 { left: 0; animation: paw-appear 2.5s infinite; }
.paw2 { left: 45px; animation: paw-appear 2.5s infinite 0.5s; }
.paw3 { left: 90px; animation: paw-appear 2.5s infinite 1s; }
.paw4 { left: 135px; animation: paw-appear 2.5s infinite 1.5s; }
.paw5 { left: 180px; animation: paw-appear 2.5s infinite 2s; }

@keyframes paw-appear {
  0% { opacity: 0; transform: scale(0.5); }
  20% { opacity: 1; transform: scale(1); }
  40%, 100% { opacity: 0; transform: scale(0.5); }
}

.loading-text {
  color: $primary-color;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 20px;
  opacity: 0.8;
}

.tip-container {
  background-color: rgba($primary-color, 0.1);
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(5px);
  max-width: 100%;
  border: 1px solid rgba($primary-color, 0.2);
}

.tip-title {
  color: $primary-color;
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 18px;
  font-family: $font-family-display;
}

.tip-text {
  color: $text-color;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
}

@media (max-width: $breakpoint-mobile) {
  .logo {
    font-size: 28px;
    margin-bottom: 15px;
  }
  
  .video-preview {
    width: 100px;
    height: 100px;
    margin-bottom: 15px;
  }
  
  .paw-prints-container {
    width: 160px;
    margin-bottom: 15px;
  }
  
  .loading-text {
    font-size: 14px;
    margin-bottom: 15px;
  }
  
  .tip-container {
    padding: 15px;
  }
  
  .tip-title {
    font-size: 16px;
  }
  
  .tip-text {
    font-size: 14px;
  }
}
</style>
