// Улучшенные функции для определения устройств
export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  const height = window.innerHeight
  
  if (width <= 480) {
    return 'mobile'
  } else if (width <= 768) {
    return 'tablet'
  } else if (width <= 1024) {
    return 'desktop-small'
  } else {
    return 'desktop'
  }
}

export const getViewportInfo = () => {
  if (typeof window === 'undefined') {
    return {
      width: 1024,
      height: 768,
      deviceType: 'desktop',
      isPortrait: false,
      isLandscape: true,
      pixelRatio: 1
    }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    deviceType: getDeviceType(),
    isPortrait: window.innerHeight > window.innerWidth,
    isLandscape: window.innerWidth > window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  }
}

export const isPortrait = () => {
  if (typeof window === 'undefined') return false
  return window.innerHeight > window.innerWidth
}

export const isMobileDevice = () => {
  return getDeviceType() === 'mobile'
}

export const isTabletDevice = () => {
  return getDeviceType() === 'tablet'
}

export const isDesktopDevice = () => {
  const deviceType = getDeviceType()
  return deviceType === 'desktop' || deviceType === 'desktop-small'
}

// Функция для адаптивного размера шрифта
export const adjustFontSize = (baseSize) => {
  const deviceType = getDeviceType()
  
  switch (deviceType) {
    case 'mobile':
      return baseSize * 0.8
    case 'tablet':
      return baseSize * 0.9
    case 'desktop-small':
      return baseSize * 1.0
    default:
      return baseSize * 1.1
  }
}

// Функция для определения макета
export const getLayoutType = () => {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  
  if (width <= 768) {
    return 'mobile' // Мобильный макет (видео сверху, контент снизу)
  } else {
    return 'desktop' // Десктопный макет (контент слева, видео справа)
  }
}

// Функция для определения размеров видео
export const getVideoSize = () => {
  const viewport = getViewportInfo()
  
  if (viewport.deviceType === 'mobile') {
    return {
      width: '100%',
      height: '65vh', // 65% высоты экрана
      objectFit: 'cover'
    }
  } else {
    return {
      width: '40%',
      height: '100vh',
      objectFit: 'cover'
    }
  }
}

// Дополнительные утилиты

export const getBreakpoint = () => {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  
  if (width <= 360) return 'xs'
  if (width <= 480) return 'sm'
  if (width <= 768) return 'md'
  if (width <= 1024) return 'lg'
  if (width <= 1366) return 'xl'
  if (width <= 1920) return 'xxl'
  return 'xxxl'
}

export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export const getScreenDensity = () => {
  if (typeof window === 'undefined') return 1
  return window.devicePixelRatio || 1
}

export const isHighDensityScreen = () => {
  return getScreenDensity() >= 2
}

// Функция для получения оптимальных размеров контента
export const getContentDimensions = () => {
  const viewport = getViewportInfo()
  const layoutType = getLayoutType()
  
  if (layoutType === 'mobile') {
    return {
      contentHeight: '20vh',
      videoHeight: '80vh',
      contentWidth: '100vw',
      videoWidth: '100vw'
    }
  } else {
    // Десктоп
    switch (viewport.deviceType) {
      case 'tablet':
        return {
          contentWidth: '55%',
          videoWidth: '45%',
          contentHeight: '100vh',
          videoHeight: '100vh'
        }
      case 'desktop-small':
        return {
          contentWidth: '58%',
          videoWidth: '42%', 
          contentHeight: '100vh',
          videoHeight: '100vh'
        }
      default: // desktop
        return {
          contentWidth: '60%',
          videoWidth: '40%',
          contentHeight: '100vh',
          videoHeight: '100vh'
        }
    }
  }
}

// Функция для определения нужно ли использовать компактный интерфейс
export const shouldUseCompactUI = () => {
  const viewport = getViewportInfo()
  return viewport.height < 600 || viewport.deviceType === 'mobile'
}

// Функция для получения безопасной области (safe area) для устройств с выемками
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined' || !CSS.supports('padding', 'env(safe-area-inset-top)')) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }

  const style = getComputedStyle(document.documentElement)
  
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0
  }
}

// Функция для оптимизации производительности на слабых устройствах
export const shouldReduceAnimations = () => {
  if (typeof window === 'undefined') return false
  
  // Проверяем настройки пользователя
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return true
  
  // Для очень маленьких или старых устройств
  const viewport = getViewportInfo()
  return viewport.deviceType === 'mobile' && viewport.pixelRatio < 2
}

// Экспорт всех функций по умолчанию
export default {
  getDeviceType,
  getViewportInfo,
  isPortrait,
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
  adjustFontSize,
  getLayoutType,
  getVideoSize,
  getBreakpoint,
  isTouchDevice,
  getScreenDensity,
  isHighDensityScreen,
  getContentDimensions,
  shouldUseCompactUI,
  getSafeAreaInsets,
  shouldReduceAnimations
}