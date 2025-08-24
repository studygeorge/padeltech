

<template>
  <div class="video-player-container">
    <video 
      ref="video1"
      class="video-element"
      :class="{ 'active': activeVideo === 1, 'inactive': activeVideo !== 1 }"
      muted 
      playsinline 
      autoplay 
      loop
      @loadeddata="onVideoLoaded"
      @error="onVideoError"
      @canplaythrough="onVideoReady"
    />
    
    <video 
      ref="video2"
      class="video-element"
      :class="{ 'active': activeVideo === 2, 'inactive': activeVideo !== 2 }"
      muted 
      playsinline 
      autoplay 
      loop
      @loadeddata="onVideoLoaded"
      @error="onVideoError"
      @canplaythrough="onVideoReady"
    />
  </div>
</template>

<script>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'VideoPlayer',
  props: {
    videoName: {
      type: String,
      required: true
    }
  },
  emits: ['video-loaded', 'video-error', 'all-videos-loaded', 'video-ready'],
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const video1 = ref(null)
    const video2 = ref(null)
    const activeVideo = ref(1)
    const isTransitioning = ref(false)
    const currentVideoName = ref('')
    
    const getVideoPath = (videoName) => {
      const currentTaskNumber = store.getters.currentTaskNumber || 1
      const currentRoute = route.path
      
      console.log('VideoPlayer: Получаем путь для videoName:', videoName, 'задание:', currentTaskNumber, 'роут:', currentRoute)
      
      if (videoName === 'question') {
        const questionVideos = {
          1: 'на кассе стоит 1 уровень_в1.mp4',
          2: 'возле двери стоит 2 уровень.mp4', 
          3: 'стол смотри 3 уровень.mp4',
          4: 'смотрит на миску думает 4 уровень.mp4',
          5: 'улыбается смотриит на тарелочку 5 уровень.mp4',
          6: 'ставит печенье в печку 6 уровень конец .mp4'
        }
        
        const filename = questionVideos[currentTaskNumber] || questionVideos[1]
        const path = `/assets/images/characters/cat/${filename}`
        console.log('VideoPlayer: Question видео для задания', currentTaskNumber, ':', path)
        return path
      }
      
      if (videoName === 'happy') {
        if (currentRoute === '/game') {
          if (currentTaskNumber === 1) {
            const path = '/assets/images/characters/cat/держит покупку 1 уровень.mp4'
            console.log('VideoPlayer: Специальное Happy видео для 1 уровня в игре:', path)
            return path
          }
          
          if (currentTaskNumber === 4) {
            const path = '/assets/images/characters/cat/ест еду_хеппи для 4 уровень.mp4'
            console.log('VideoPlayer: Специальное Happy видео для 4 уровня в игре:', path)
            return path
          }
          
          if (currentTaskNumber === 6) {
            const path = '/assets/images/characters/cat/завершение 6 уровня духовка.mp4'
            console.log('VideoPlayer: Специальное Happy видео для 6 уровня (духовка):', path)
            return path
          }
        }
        
        const path = '/assets/images/characters/cat/просто машет ручками мило.mp4'
        console.log('VideoPlayer: Обычное Happy видео:', path)
        return path
      }
      
      if (videoName === 'sad') {
        const path = '/assets/images/characters/cat/грустная эмоция.mp4'
        console.log('VideoPlayer: Sad видео:', path)
        return path
      }
      
      if (videoName === 'показывает рузльтаты 7 этап') {
        const path = '/assets/images/characters/cat/показывает рузльтаты 7 этап.mp4'
        console.log('VideoPlayer: Results видео:', path)
        return path
      }
      
      if (videoName === 'storytelling') {
        const path = '/assets/images/characters/cat/storytelling.mp4'
        console.log('VideoPlayer: Storytelling видео для комиксов:', path)
        return path
      }
      
      const path = `/assets/images/characters/cat/welcome.mp4`
      console.log('VideoPlayer: Запасной путь (welcome):', path)
      return path
    }
    
    const switchVideo = async (newVideoName) => {
      if (isTransitioning.value || currentVideoName.value === newVideoName) {
        return
      }
      
      console.log('VideoPlayer: 🎬 Плавная смена с', currentVideoName.value, 'на', newVideoName)
      isTransitioning.value = true
      
      const nextVideoIndex = activeVideo.value === 1 ? 2 : 1
      const nextVideo = nextVideoIndex === 1 ? video1.value : video2.value
      const currentVideo = activeVideo.value === 1 ? video1.value : video2.value
      
      const videoPath = getVideoPath(newVideoName)
      console.log('VideoPlayer: Загружаем видео по пути:', videoPath)
      
      nextVideo.src = videoPath
      
      await new Promise((resolve) => {
        let resolved = false
        
        const onCanPlay = () => {
          if (resolved) return
          resolved = true
          nextVideo.removeEventListener('canplaythrough', onCanPlay)
          nextVideo.removeEventListener('loadeddata', onCanPlay)
          nextVideo.removeEventListener('error', onError)
          console.log('VideoPlayer: ✅ Новое видео загружено:', videoPath)
          resolve()
        }
        
        const onError = (error) => {
          if (resolved) return
          resolved = true
          nextVideo.removeEventListener('canplaythrough', onCanPlay)
          nextVideo.removeEventListener('loadeddata', onCanPlay)
          nextVideo.removeEventListener('error', onError)
          console.error('VideoPlayer: ❌ Ошибка загрузки видео:', error)
          resolve()
        }
        
        nextVideo.addEventListener('canplaythrough', onCanPlay)
        nextVideo.addEventListener('loadeddata', onCanPlay)
        nextVideo.addEventListener('error', onError)
        nextVideo.load()
        
        setTimeout(() => {
          if (!resolved) {
            console.warn('VideoPlayer: ⏰ Таймаут загрузки видео')
            onCanPlay()
          }
        }, 3000)
      })
      
      try {
        await nextVideo.play()
        
        activeVideo.value = nextVideoIndex
        currentVideoName.value = newVideoName
        
        console.log('VideoPlayer: 🎯 Активное видео переключено на:', nextVideoIndex)
        
        await new Promise(resolve => setTimeout(resolve, 300))
        
        if (currentVideo && typeof currentVideo.pause === 'function') {
          currentVideo.pause()
        }
        
        console.log('VideoPlayer: ✅ Плавная смена завершена')
        emit('video-ready')
        
      } catch (error) {
        console.error('VideoPlayer: ❌ Ошибка воспроизведения:', error)
        emit('video-error', error)
      }
      
      isTransitioning.value = false
    }
    
    const initializeFirstVideo = async () => {
      console.log('VideoPlayer: 🚀 Инициализация первого видео для:', props.videoName)
      
      const firstVideo = video1.value
      const videoPath = getVideoPath(props.videoName)
      
      console.log('VideoPlayer: Первое видео:', videoPath)
      firstVideo.src = videoPath
      
      try {
        await new Promise((resolve, reject) => {
          let resolved = false
          
          const onCanPlay = () => {
            if (resolved) return
            resolved = true
            firstVideo.removeEventListener('canplaythrough', onCanPlay)
            firstVideo.removeEventListener('loadeddata', onCanPlay)
            firstVideo.removeEventListener('error', onError)
            resolve()
          }
          
          const onError = (error) => {
            if (resolved) return
            resolved = true
            firstVideo.removeEventListener('canplaythrough', onCanPlay)
            firstVideo.removeEventListener('loadeddata', onCanPlay)
            firstVideo.removeEventListener('error', onError)
            reject(error)
          }
          
          firstVideo.addEventListener('canplaythrough', onCanPlay)
          firstVideo.addEventListener('loadeddata', onCanPlay)
          firstVideo.addEventListener('error', onError)
          firstVideo.load()
          
          setTimeout(() => {
            if (!resolved) {
              console.warn('VideoPlayer: ⏰ Таймаут первого видео')
              resolve()
            }
          }, 5000)
        })
        
        await firstVideo.play()
        activeVideo.value = 1
        currentVideoName.value = props.videoName
        
        console.log('VideoPlayer: ✅ Первое видео готово и воспроизводится')
        emit('video-ready')
        emit('all-videos-loaded')
        
      } catch (error) {
        console.error('VideoPlayer: ❌ Ошибка инициализации:', error)
        emit('video-error', error)
        emit('video-ready')
      }
    }
    
    const onVideoLoaded = () => {
      emit('video-loaded')
    }
    
    const onVideoError = (error) => {
      console.error('VideoPlayer: Ошибка видео элемента:', error)
      emit('video-error', error)
    }
    
    const onVideoReady = () => {
      // Событие обрабатывается в switchVideo и initializeFirstVideo
    }
    
    watch(() => props.videoName, (newVideoName, oldVideoName) => {
      console.log('VideoPlayer: 👀 Смена videoName:', oldVideoName, '→', newVideoName)
      if (newVideoName !== currentVideoName.value) {
        switchVideo(newVideoName)
      }
    })
    
    watch(() => store.getters.currentTaskNumber, (newTaskNumber, oldTaskNumber) => {
      console.log('VideoPlayer: 📋 Смена задания:', oldTaskNumber, '→', newTaskNumber)
      
      if (props.videoName === 'question' && newTaskNumber !== oldTaskNumber) {
        console.log('VideoPlayer: 🔄 Обновляем question видео для нового задания')
        switchVideo('question')
      }
    })
    
    onMounted(() => {
      nextTick(() => {
        initializeFirstVideo()
      })
    })
    
    return {
      video1,
      video2,
      activeVideo,
      onVideoLoaded,
      onVideoError,
      onVideoReady
    }
  }
}
</script>

<style lang="scss" scoped>
.video-player-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #f9f9f9;
}

.video-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: transparent;
  transition: opacity 0.4s ease-in-out;
  
  &.active {
    opacity: 1;
    z-index: 2;
  }
  
  &.inactive {
    opacity: 0;
    z-index: 1;
  }
}
</style>

