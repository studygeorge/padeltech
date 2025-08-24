<template>
  <div class="vb-desktop-container">
    <!-- ЛЕВАЯ ЧАСТЬ: ВИДЕО -->
    <div class="vb-desktop-video-section">
      <div class="desktop-video-frame">
        <VideoPlayer 
          :videoName="videoName"
          @video-ready="$emit('video-ready')"
        />
      </div>
    </div>
    
    <!-- ПРАВАЯ ЧАСТЬ: КОНТЕНТ -->
    <div class="vb-desktop-content-section">
      <ContentOverlayDesktop>
        <slot></slot>
      </ContentOverlayDesktop>
    </div>
  </div>
</template>

<script>
import VideoPlayer from './VideoPlayer.vue'
import ContentOverlayDesktop from './ContentOverlayDesktop.vue'

export default {
  name: 'VideoBackgroundDesktop',
  components: {
    VideoPlayer,
    ContentOverlayDesktop
  },
  props: {
    videoName: {
      type: String,
      required: true
    }
  },
  emits: ['video-ready']
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.vb-desktop-container {
  display: flex;
  flex-direction: row;
  background: #ffffff !important;
  align-items: stretch;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  font-family: $font-family-primary;
  
  // ЛЕВАЯ ЧАСТЬ: ВИДЕО
  .vb-desktop-video-section {
    flex: 0 0 45%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff !important;
    padding: 40px;
    
    .desktop-video-frame {
      width: 100%;
      max-width: 420px;
      height: 85vh;
      max-height: 700px;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      background: #ffffff !important;
      
      // Красивая тень в оранжевых тонах
      box-shadow: 
        0 20px 40px rgba($primary-color, 0.15),
        0 10px 20px rgba(0, 0, 0, 0.08);
      
      // Тонкая оранжевая рамка
      border: 3px solid rgba($primary-color, 0.1);
      
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 
          0 25px 50px rgba($primary-color, 0.2),
          0 15px 25px rgba(0, 0, 0, 0.1);
        border-color: rgba($primary-color, 0.2);
      }
    }
  }
  
  // ПРАВАЯ ЧАСТЬ: КОНТЕНТ
  .vb-desktop-content-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff !important;
    position: relative;
  }
}

// === АДАПТАЦИИ ДЛЯ РАЗНЫХ РАЗМЕРОВ ПК ===

// Планшеты в альбомной ориентации (768px - 1024px)
@media (min-width: 768px) and (max-width: 1024px) {
  .vb-desktop-container .vb-desktop-video-section {
    flex: 0 0 42%;
    padding: 30px;
    
    .desktop-video-frame {
      max-width: 350px;
      height: 80vh;
      max-height: 550px;
      border-radius: 16px;
      border-width: 2px;
    }
  }
}

// Средние десктопы (1024px - 1366px)
@media (min-width: 1024px) and (max-width: 1366px) {
  .vb-desktop-container .vb-desktop-video-section {
    padding: 35px;
    
    .desktop-video-frame {
      max-width: 390px;
      height: 83vh;
      max-height: 650px;
    }
  }
}

// Большие экраны (1366px - 1600px)
@media (min-width: 1367px) and (max-width: 1600px) {
  .vb-desktop-container .vb-desktop-video-section {
    padding: 45px;
    
    .desktop-video-frame {
      max-width: 450px;
      height: 87vh;
      max-height: 750px;
      border-radius: 22px;
    }
  }
}

// Очень большие экраны (1600px+)
@media (min-width: 1601px) {
  .vb-desktop-container {
    max-width: 1800px;
    margin: 0 auto;
    
    .vb-desktop-video-section {
      padding: 50px;
      
      .desktop-video-frame {
        max-width: 480px;
        height: 88vh;
        max-height: 800px;
        border-radius: 25px;
      }
    }
  }
}

// 4K экраны и больше
@media (min-width: 2560px) {
  .vb-desktop-container {
    max-width: 2200px;
    
    .vb-desktop-video-section {
      .desktop-video-frame {
        max-width: 550px;
        max-height: 900px;
      }
    }
  }
}
</style>
