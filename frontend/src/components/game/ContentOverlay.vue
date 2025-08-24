
<template>
  <div class="content-overlay" :class="layoutClasses">
    <div class="content-container" :style="containerStyles">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { getLayoutType, getDeviceType, shouldUseCompactUI, getSafeAreaInsets } from '@/utils/responsive'

export default {
  name: 'ContentOverlay',
  setup() {
    const layoutType = computed(() => getLayoutType())
    const deviceType = computed(() => getDeviceType())
    const useCompactUI = computed(() => shouldUseCompactUI())
    const safeAreaInsets = computed(() => getSafeAreaInsets())
    
    const layoutClasses = computed(() => ({
      'mobile-content': layoutType.value === 'mobile',
      'desktop-content': layoutType.value === 'desktop',
      [`device-${deviceType.value}`]: true,
      'compact-ui': useCompactUI.value
    }))
    
    const containerStyles = computed(() => {
      const insets = safeAreaInsets.value
      return {
        paddingTop: `${insets.top}px`,
        paddingRight: `${insets.right}px`,
        paddingBottom: `0px`,
        paddingLeft: `${insets.left}px`
      }
    })
    
    return {
      layoutClasses,
      containerStyles
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.content-overlay {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 100;
  overflow: hidden;
  background: transparent !important;
}

.content-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 101;
  overflow: hidden;
  background: transparent !important;
}

// === МОБИЛЬНАЯ ВЕРСИЯ === 
.mobile-content {
  background: rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  position: relative;
  z-index: 200;
  
  .content-container {
    padding: 8px 8px 0px 8px;
    justify-content: flex-start;
    align-items: stretch;
    gap: 0;
    min-height: 100%;
    position: relative;
    z-index: 201;
    overflow: hidden;
  }

  :deep(button), :deep(.btn), :deep(input[type="button"]), :deep(input[type="submit"]) {
    min-height: 48px !important;
    padding: 12px 20px !important;
    font-size: 16px !important;
    border-radius: 12px !important;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  :deep(input[type="text"]), :deep(input[type="email"]), :deep(textarea), :deep(select) {
    min-height: 44px !important;
    padding: 12px 16px !important;
    font-size: 16px !important;
  }
}

// === ДЕСКТОПНАЯ ВЕРСИЯ - БЕЛЫЙ ФОН БЕЗ СЕРОГО! ===
.desktop-content {
  background: transparent !important;
  overflow: hidden;
  position: relative;
  z-index: 150;
  
  .content-container {
    padding: 40px 60px;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    position: relative;
    z-index: 151;
    overflow: hidden;
    height: 100%;
    background: transparent !important;
  }
  
  :deep(.math-game-content) {
    width: 100%;
    max-width: 700px;
    background: #ffffff !important;
    border-radius: 30px;
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.15),
      0 15px 30px rgba(0, 0, 0, 0.1);
    padding: 60px 50px;
    position: relative;
    border: none;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, $primary-color 0%, $accent-color 100%);
      border-radius: 30px 30px 0 0;
    }
  }
  
  :deep(.mg-progress-bar) {
    background: #f8f8f8 !important;
    border-radius: 20px !important;
    height: 16px !important;
    margin-bottom: 50px !important;
    position: relative;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
    
    .mg-progress-fill {
      background: linear-gradient(90deg, $primary-color 0%, $accent-color 100%) !important;
      border-radius: 20px !important;
      height: 100% !important;
      position: relative;
      box-shadow: 
        0 4px 8px rgba($primary-color, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -50%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent,
          rgba(255, 255, 255, 0.4),
          transparent
        );
        border-radius: 20px;
        animation: shine 2s infinite;
      }
    }
    
    .mg-progress-text {
      position: absolute !important;
      top: -40px !important;
      right: 0 !important;
      font-size: 22px !important;
      font-weight: 800 !important;
      color: $primary-color !important;
      text-shadow: 0 2px 4px rgba($primary-color, 0.2) !important;
      letter-spacing: 1px !important;
    }
  }
  
  :deep(.mg-question-text) {
    font-size: 36px !important;
    line-height: 1.2 !important;
    font-weight: 800 !important;
    color: #1a1a1a !important;
    text-align: center !important;
    margin-bottom: 60px !important;
    text-shadow: none !important;
    max-width: 600px !important;
    letter-spacing: -1px !important;
  }
  
  :deep(.mg-options-container) {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 25px !important;
    width: 100% !important;
    max-width: 600px !important;
    margin: 0 auto !important;
  }
  
  :deep(.mg-option-button) {
    padding: 25px 20px !important;
    font-size: 28px !important;
    font-weight: 800 !important;
    border-radius: 20px !important;
    border: 4px solid #f0f0f0 !important;
    background: #ffffff !important;
    color: #333333 !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    position: relative !important;
    overflow: hidden !important;
    min-height: 100px !important;
    box-shadow: 
      0 8px 20px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
    letter-spacing: -0.5px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    
    &:hover:not(:disabled) {
      background: rgba($primary-color, 0.05) !important;
      border-color: $primary-color !important;
      transform: translateY(-5px) scale(1.02) !important;
      box-shadow: 
        0 15px 35px rgba($primary-color, 0.2),
        0 8px 20px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
      color: $primary-color !important;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, 
          rgba($primary-color, 0.1),
          transparent 50%,
          rgba($primary-color, 0.1)
        );
        border-radius: 16px;
        opacity: 0;
        animation: glow 0.3s ease-out forwards;
      }
    }
    
    &:active:not(:disabled) {
      transform: translateY(-2px) scale(0.98) !important;
    }
    
    &.mg-selected {
      background: linear-gradient(135deg, $primary-color 0%, darken($primary-color, 5%) 100%) !important;
      border-color: darken($primary-color, 10%) !important;
      color: white !important;
      transform: translateY(-5px) scale(1.08) !important;
      box-shadow: 
        0 20px 40px rgba($primary-color, 0.4),
        0 10px 25px rgba($primary-color, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
      
      animation: selectedPulse 1.5s ease-in-out infinite;
      
      &::after {
        content: '✓';
        position: absolute;
        top: 8px;
        right: 12px;
        font-size: 20px;
        color: white;
        font-weight: 900;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        opacity: 0;
        animation: checkAppear 0.6s ease-out 0.2s forwards;
      }
    }
    
    &.mg-disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
      pointer-events: none !important;
      filter: grayscale(0.5) !important;
      background: #fafafa !important;
    }
  }
  
  :deep(.mg-mobile-option) {
    display: none !important;
  }
}

@keyframes shine {
  0% {
    left: -50%;
  }
  100% {
    left: 100%;
  }
}

@keyframes glow {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes selectedPulse {
  0%, 100% {
    box-shadow: 
      0 20px 40px rgba($primary-color, 0.4),
      0 10px 25px rgba($primary-color, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 
      0 25px 50px rgba($primary-color, 0.5),
      0 15px 35px rgba($primary-color, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

@keyframes checkAppear {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-45deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.device-tablet.desktop-content {
  .content-container {
    padding: 30px 40px;
    background: transparent !important;
  }
  
  :deep(.math-game-content) {
    max-width: 600px;
    padding: 40px 35px;
    border-radius: 24px;
    background: #ffffff !important;
  }
  
  :deep(.mg-question-text) {
    font-size: 28px !important;
    margin-bottom: 40px !important;
  }
  
  :deep(.mg-option-button) {
    padding: 20px 15px !important;
    font-size: 24px !important;
    min-height: 85px !important;
    border-radius: 16px !important;
    background: #ffffff !important;
    border-color: #f0f0f0 !important;
  }
  
  :deep(.mg-progress-bar) {
    background: #f8f8f8 !important;
  }
}

.device-desktop-small.desktop-content {
  .content-container {
    padding: 35px 50px;
    background: transparent !important;
  }
  
  :deep(.math-game-content) {
    max-width: 650px;
    padding: 50px 40px;
    background: #ffffff !important;
  }
  
  :deep(.mg-option-button) {
    background: #ffffff !important;
    border-color: #f0f0f0 !important;
  }
  
  :deep(.mg-progress-bar) {
    background: #f8f8f8 !important;
  }
}

.device-desktop.desktop-content {
  .content-container {
    padding: 40px 60px;
    background: transparent !important;
  }
  
  :deep(.math-game-content) {
    background: #ffffff !important;
  }
  
  :deep(.mg-option-button) {
    background: #ffffff !important;
    border-color: #f0f0f0 !important;
  }
  
  :deep(.mg-progress-bar) {
    background: #f8f8f8 !important;
  }
}

@media (min-width: 1367px) and (max-width: 1600px) {
  .desktop-content .content-container {
    padding: 50px 80px;
    background: transparent !important;
  }
  
  :deep(.math-game-content) {
    background: #ffffff !important;
  }
  
  :deep(.mg-option-button) {
    background: #ffffff !important;
    border-color: #f0f0f0 !important;
  }
  
  :deep(.mg-progress-bar) {
    background: #f8f8f8 !important;
  }
}

@media (min-width: 1601px) {
  .desktop-content .content-container {
    padding: 60px 100px;
    background: transparent !important;
  }
  
  :deep(.math-game-content) {
    background: #ffffff !important;
  }
  
  :deep(.mg-option-button) {
    background: #ffffff !important;
    border-color: #f0f0f0 !important;
  }
  
  :deep(.mg-progress-bar) {
    background: #f8f8f8 !important;
  }
}

.device-mobile {
  &.mobile-content {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    
    .content-container {
      padding: 6px 8px 0px 8px;
    }
  }
}

@media (max-width: 360px) {
  .mobile-content {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    
    .content-container {
      padding: 4px 6px 0px 6px;
    }
  }
}

@media (max-height: 600px) and (max-width: 768px) {
  .mobile-content .content-container {
    padding: 6px 8px 0px 8px;
  }
}

@media (max-width: 768px) and (orientation: landscape) and (max-height: 500px) {
  .mobile-content {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    
    .content-container {
      padding: 2px 4px 0px 4px;
    }
  }
}

@media (min-height: 800px) and (max-width: 768px) {
  .mobile-content {
    border-top-left-radius: 28px;
    border-top-right-radius: 28px;
    
    .content-container {
      padding: 10px 12px 0px 12px;
    }
  }
}

@media (min-height: 900px) and (max-width: 768px) {
  .mobile-content {
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
    
    .content-container {
      padding: 12px 16px 0px 16px;
    }
  }
}

@supports (padding: max(0px)) {
  .mobile-content .content-container {
    padding-left: max(8px, env(safe-area-inset-left));
    padding-right: max(8px, env(safe-area-inset-right));
    padding-bottom: 0px;
  }
}

* {
  outline: none !important;
  -webkit-tap-highlight-color: transparent !important;
}
</style>