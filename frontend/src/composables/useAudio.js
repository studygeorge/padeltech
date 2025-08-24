import { ref } from 'vue'

export function useAudio() {
  const audioPlayer = ref(null)
  const isPlaying = ref(false)
  const currentAudio = ref('')
  
  const playAudio = async (audioFileName, volume = 1.0) => {
    if (!audioPlayer.value) {
      console.warn('useAudio: Аудио плеер не найден')
      return false
    }
    
    try {
      // Останавливаем текущий звук если играет
      if (isPlaying.value) {
        audioPlayer.value.pause()
        audioPlayer.value.currentTime = 0
      }
      
      const audioPath = `/assets/images/characters/cat/${audioFileName}`
      console.log('useAudio: Воспроизводим звук:', audioPath)
      
      audioPlayer.value.src = audioPath
      audioPlayer.value.volume = Math.max(0, Math.min(1, volume))
      audioPlayer.value.currentTime = 0
      
      // Ждем готовности аудио
      await new Promise((resolve, reject) => {
        let resolved = false
        
        const onCanPlay = () => {
          if (resolved) return
          resolved = true
          cleanup()
          resolve()
        }
        
        const onError = (error) => {
          if (resolved) return
          resolved = true
          cleanup()
          reject(error)
        }
        
        const cleanup = () => {
          audioPlayer.value.removeEventListener('canplaythrough', onCanPlay)
          audioPlayer.value.removeEventListener('error', onError)
        }
        
        audioPlayer.value.addEventListener('canplaythrough', onCanPlay)
        audioPlayer.value.addEventListener('error', onError)
        audioPlayer.value.load()
        
        // Таймаут на случай проблем с загрузкой
        setTimeout(() => {
          if (!resolved) {
            console.warn('useAudio: Таймаут загрузки аудио')
            cleanup()
            resolve()
          }
        }, 3000)
      })
      
      await audioPlayer.value.play()
      isPlaying.value = true
      currentAudio.value = audioFileName
      
      console.log('useAudio: ✅ Звук воспроизводится:', audioFileName)
      return true
      
    } catch (error) {
      console.error('useAudio: ❌ Ошибка воспроизведения звука:', error)
      isPlaying.value = false
      currentAudio.value = ''
      return false
    }
  }
  
  const stopAudio = () => {
    if (audioPlayer.value && isPlaying.value) {
      audioPlayer.value.pause()
      audioPlayer.value.currentTime = 0
      isPlaying.value = false
      currentAudio.value = ''
      console.log('useAudio: Звук остановлен')
    }
  }
  
  const pauseAudio = () => {
    if (audioPlayer.value && isPlaying.value) {
      audioPlayer.value.pause()
      isPlaying.value = false
      console.log('useAudio: Звук приостановлен')
    }
  }
  
  const resumeAudio = async () => {
    if (audioPlayer.value && !isPlaying.value && currentAudio.value) {
      try {
        await audioPlayer.value.play()
        isPlaying.value = true
        console.log('useAudio: Звук возобновлен')
      } catch (error) {
        console.error('useAudio: Ошибка возобновления:', error)
      }
    }
  }
  
  const setVolume = (volume) => {
    if (audioPlayer.value) {
      audioPlayer.value.volume = Math.max(0, Math.min(1, volume))
    }
  }
  
  const onAudioEnded = () => {
    isPlaying.value = false
    currentAudio.value = ''
    console.log('useAudio: Звук завершен')
  }
  
  const onAudioError = (error) => {
    isPlaying.value = false
    currentAudio.value = ''
    console.error('useAudio: Ошибка аудио:', error)
  }
  
  return {
    audioPlayer,
    isPlaying,
    currentAudio,
    playAudio,
    stopAudio,
    pauseAudio,
    resumeAudio,
    setVolume,
    onAudioEnded,
    onAudioError
  }
}