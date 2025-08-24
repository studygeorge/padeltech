// Хранилище загруженных видео
const videoCache = {}

/**
 * Предзагружает видео один раз и кэширует его
 * @param {string} videoName - Имя видео без расширения
 * @returns {Promise<HTMLVideoElement>} - Промис, который резолвится, когда видео загружено
 */
export const preloadVideo = (videoName) => {
  // Если видео уже было загружено, возвращаем его из кэша
  if (videoCache[videoName]) {
    return Promise.resolve(videoCache[videoName])
  }
  
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.muted = true
    video.src = `/assets/images/characters/cat/${videoName}.mp4`
    
    // Обработчик успешной загрузки
    video.addEventListener('canplaythrough', () => {
      console.log(`Видео ${videoName} предзагружено`)
      videoCache[videoName] = video
      resolve(video)
    }, { once: true })
    
    // Обработчик ошибки
    video.addEventListener('error', (err) => {
      console.error(`Ошибка предзагрузки видео ${videoName}:`, err)
      reject(err)
    }, { once: true })
    
    // Начинаем загрузку
    video.load()
  })
}

/**
 * Загружает несколько видео одновременно
 * @param {string[]} videoNames - Массив имен видео без расширения
 * @returns {Promise<HTMLVideoElement[]>} - Промис, который резолвится, когда все видео загружены
 */
export const preloadVideos = (videoNames) => {
  const promises = videoNames.map(name => preloadVideo(name))
  return Promise.all(promises)
}

/**
 * Получает элемент видео из кэша
 * @param {string} videoName - Имя видео без расширения
 * @returns {HTMLVideoElement|null} - Элемент видео или null, если видео не загружено
 */
export const getVideoFromCache = (videoName) => {
  return videoCache[videoName] || null
}

/**
 * Проверяет, загружено ли видео
 * @param {string} videoName - Имя видео без расширения
 * @returns {boolean} - true, если видео загружено
 */
export const isVideoLoaded = (videoName) => {
  return !!videoCache[videoName]
}

/**
 * Создает клон элемента видео для использования на странице
 * @param {string} videoName - Имя видео без расширения
 * @returns {HTMLVideoElement|null} - Клон элемента видео или null, если видео не загружено
 */
export const getVideoClone = (videoName) => {
  const cachedVideo = getVideoFromCache(videoName)
  if (!cachedVideo) return null
  
  // Создаем клон видео для использования на странице
  const videoClone = document.createElement('video')
  videoClone.src = cachedVideo.src
  videoClone.muted = true
  videoClone.loop = true
  videoClone.autoplay = true
  videoClone.playsInline = true
  
  return videoClone
}

/**
 * НОВЫЙ МЕТОД: Предзагружает следующее видео заранее для бесшовного перехода
 * @param {string} currentVideoName - Текущее видео
 * @param {string} nextVideoName - Следующее видео для предзагрузки
 */
export const preloadNextVideo = async (currentVideoName, nextVideoName) => {
  if (nextVideoName && !isVideoLoaded(nextVideoName)) {
    try {
      await preloadVideo(nextVideoName)
      console.log(`Следующее видео ${nextVideoName} предзагружено`)
    } catch (error) {
      console.error(`Ошибка предзагрузки следующего видео ${nextVideoName}:`, error)
    }
  }
}

/**
 * НОВЫЙ МЕТОД: Получает готовый к воспроизведению источник видео
 * @param {string} videoName - Имя видео
 * @returns {string} - URL источника видео
 */
export const getVideoSource = (videoName) => {
  const cachedVideo = getVideoFromCache(videoName)
  if (cachedVideo) {
    return cachedVideo.src
  }
  return `/assets/images/characters/cat/${videoName}.mp4`
}

export default {
  preloadVideo,
  preloadVideos,
  getVideoFromCache,
  isVideoLoaded,
  getVideoClone,
  preloadNextVideo,
  getVideoSource
}
