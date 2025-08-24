<template>
  <div class="video-player" :class="{ 'is-desktop': !isMobile }">
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
    </div>
    
    <video
      ref="videoRef"
      class="video-element"
      :class="{ 'mobile-video': isMobile, 'desktop-video': !isMobile }"
      preload="auto"
      autoplay
      muted
      loop
      playsinline
      @loadeddata="onVideoLoaded"
      @error="onVideoError"
    >
      <source :src="videoPath" type="video/mp4">
      Ваш браузер не поддерживает HTML5 видео.
    </video>
    
    <div class="content-area">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HtmlVideoPlayer',
  props: {
    src: {
      type: String,
      required: true
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: true,
      error: false,
      videoPath: `/assets/images/characters/cat/${this.src}.mp4`
    }
  },
  mounted() {
    this.initVideo();
    console.log('Путь к видео:', this.videoPath);
  },
  methods: {
    initVideo() {
      const video = this.$refs.videoRef;
      
      if (!video) return;
      
      // Принудительно начинаем загрузку
      video.load();
      
      // Пробуем воспроизвести
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Автоматическое воспроизведение запрещено:', error);
          
          // Для мобильных устройств - попытка воспроизведения по клику
          document.addEventListener('click', () => {
            video.play().catch(e => console.error('Ошибка воспроизведения по клику:', e));
          }, { once: true });
        });
      }
    },
    onVideoLoaded() {
      this.loading = false;
      this.$emit('loaded');
      console.log('Видео загружено:', this.src);
    },
    onVideoError(error) {
      this.loading = false;
      this.error = true;
      console.error('Ошибка загрузки видео:', error);
      this.$emit('error', error);
    }
  },
  watch: {
    src(newSrc) {
      this.videoPath = `/assets/images/characters/cat/${newSrc}.mp4`;
      this.loading = true;
      this.error = false;
      
      // При изменении источника даем немного времени для обновления DOM
      this.$nextTick(() => {
        this.initVideo();
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.video-player {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.loading-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 126, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ff7e00;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.video-element {
  position: fixed;
  min-width: 100%;
  min-height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  object-fit: cover;
}

.mobile-video {
  width: 100%;
  height: 100vh;
}

.desktop-video {
  width: 40%;
  right: 0;
  left: auto;
  transform: translateY(-50%);
}

.content-area {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  // Полупрозрачный фон для лучшей читаемости контента на мобильных
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: -1;
  }
}

.is-desktop .content-area {
  width: 60%;
  align-items: flex-start;
  
  &::before {
    width: 60%;
  }
}
</style>
