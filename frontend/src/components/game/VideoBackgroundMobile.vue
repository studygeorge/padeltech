<template>
  <div class="vb-mobile-container">
    <!-- ВИДЕО НА ВЕСЬ ЭКРАН -->
    <div class="vb-mobile-video-section">
      <div class="mobile-video-frame">
        <VideoPlayer 
          :videoName="videoName"
          @video-ready="$emit('video-ready')"
        />
      </div>
    </div>
    
    <!-- КОНТЕНТ СНИЗУ С ДИНАМИЧЕСКОЙ ВЫСОТОЙ -->
    <div class="vb-mobile-content-section" :class="contentSizeClass">
      <ContentOverlayMobile>
        <slot></slot>
      </ContentOverlayMobile>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import VideoPlayer from './VideoPlayer.vue'
import ContentOverlayMobile from './ContentOverlayMobile.vue'

export default {
  name: 'VideoBackgroundMobile',
  components: {
    VideoPlayer,
    ContentOverlayMobile
  },
  props: {
    videoName: {
      type: String,
      required: true
    }
  },
  emits: ['video-ready'],
  setup() {
    const route = useRoute()
    const store = useStore()
    
    // Определяем размер контентной области в зависимости от страницы
    const contentSizeClass = computed(() => {
      const routeName = route.name
      const routePath = route.path
      
      // Маленький размер для Home и ComicReader
      if (routeName === 'Home' || routePath === '/' || routePath.includes('/comic')) {
        return 'content-small'
      }
      
      // Для игровых уровней проверяем номер текущего задания
      if (routeName === 'MathGame' || routePath.includes('/math')) {
        const currentTaskNumber = store.getters.currentTaskNumber || 1
        
        // Маленький размер для уровней 1, 2, 6 (20vh)
        if ([1, 2, 6].includes(currentTaskNumber)) {
          return 'content-small'
        }
        
        // Большой размер для уровней 3, 4, 5 (30vh)
        if ([3, 4, 5].includes(currentTaskNumber)) {
          return 'content-large'
        }
      }
      
      // Большой размер для других игровых страниц (rewards и остальные level компоненты)
      if (routePath.includes('/level') || routePath.includes('/rewards')) {
        return 'content-large'
      }
      
      // По умолчанию средний размер
      return 'content-medium'
    })
    
    return {
      contentSizeClass
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.vb-mobile-container {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  height: calc(var(--vh, 1vh) * 100) !important;
  overflow: hidden;
  font-family: $font-family-primary;
  background: #f9f9f9 !important;
  
  .vb-mobile-video-section {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    height: calc(var(--vh, 1vh) * 100) !important;
    z-index: 1 !important;
    background: #f9f9f9 !important;
    
    .mobile-video-frame {
      width: 100%;
      height: 100%;
    }
  }
  
  .vb-mobile-content-section {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    z-index: 10 !important;
    
    // === МАЛЕНЬКИЙ РАЗМЕР (Home, ComicReader, Уровни 1,2,6) ===
    &.content-small {
      height: 20vh !important;
    }
    
    // === СРЕДНИЙ РАЗМЕР (по умолчанию) ===
    &.content-medium {
      height: 25vh !important;
    }
    
    // === БОЛЬШОЙ РАЗМЕР (Уровни 3,4,5, rewards) ===
    &.content-large {
      height: 30vh !important;
    }
  }
}

// === АДАПТАЦИИ ДЛЯ РАЗНЫХ МОБИЛЬНЫХ РАЗМЕРОВ ===

// Маленькие экраны (≤360px)
@media (max-width: 360px) {
  .vb-mobile-container .vb-mobile-content-section {
    &.content-small {
      height: 22vh !important;
    }
    
    &.content-medium {
      height: 28vh !important;
    }
    
    &.content-large {
      height: 32vh !important;
    }
  }
}

// Низкие экраны (≤600px)
@media (max-height: 600px) {
  .vb-mobile-container .vb-mobile-content-section {
    &.content-small {
      height: 25vh !important;
    }
    
    &.content-medium {
      height: 30vh !important;
    }
    
    &.content-large {
      height: 35vh !important;
    }
  }
}

// Альбомная ориентация на низких экранах
@media (orientation: landscape) and (max-height: 500px) {
  .vb-mobile-container .vb-mobile-content-section {
    &.content-small {
      height: 30vh !important;
    }
    
    &.content-medium {
      height: 35vh !important;
    }
    
    &.content-large {
      height: 40vh !important;
    }
  }
}

// Высокие экраны (≥800px)
@media (min-height: 800px) {
  .vb-mobile-container .vb-mobile-content-section {
    &.content-small {
      height: 18vh !important;
    }
    
    &.content-medium {
      height: 22vh !important;
    }
    
    &.content-large {
      height: 28vh !important;
    }
  }
}

// Очень высокие экраны (≥900px)
@media (min-height: 900px) {
  .vb-mobile-container .vb-mobile-content-section {
    &.content-small {
      height: 16vh !important;
    }
    
    &.content-medium {
      height: 20vh !important;
    }
    
    &.content-large {
      height: 25vh !important;
    }
  }
}
</style>