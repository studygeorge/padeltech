<template>
  <div class="desktop-content-overlay">
    <div class="desktop-content-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentOverlayDesktop'
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.desktop-content-overlay {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 100;
  overflow: hidden;
  background: transparent !important;
  border-radius: 32px;
}

.desktop-content-container {
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
  border-radius: 32px;
}

// === ИГРОВОЙ КОНТЕНТ - БЕЛАЯ КАРТОЧКА ===
:deep(.math-game-content) {
  width: 100%;
  max-width: 800px;
  background: #ffffff !important;
  border-radius: 32px;
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.12),
    0 20px 40px rgba(0, 0, 0, 0.08);
  padding: 60px 50px;
  position: relative;
  border: none;
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    height: 6px;
    background: linear-gradient(90deg, $primary-color 0%, $accent-color 100%);
    border-radius: 16px;
  }
}

// === КОНТЕНТ КОМИКСА - БЕЛАЯ КАРТОЧКА ===
:deep(.cr-desktop-comic-content) {
  width: 100%;
  max-width: 800px;
  background: #ffffff !important;
  border-radius: 32px;
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.12),
    0 20px 40px rgba(0, 0, 0, 0.08);
  padding: 60px 50px;
  position: relative;
  border: none;
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    height: 6px;
    background: linear-gradient(90deg, $primary-color 0%, $accent-color 100%);
    border-radius: 16px;
  }
}

// ПРОГРЕСС БАР - большой и красивый
:deep(.mg-progress-bar) {
  background: #f5f5f5 !important;
  border-radius: 25px !important;
  height: 20px !important;
  margin-bottom: 40px !important;
  width: 100% !important;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #eeeeee;
  
  .mg-progress-fill {
    background: linear-gradient(90deg, $primary-color 0%, $accent-color 100%) !important;
    border-radius: 25px !important;
    height: 100% !important;
    position: relative;
    box-shadow: 
      0 6px 12px rgba($primary-color, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.4);
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -50%;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent,
        rgba(255, 255, 255, 0.5),
        transparent
      );
      border-radius: 25px;
      animation: shine 2.5s infinite;
    }
  }
  
  .mg-progress-text {
    position: absolute !important;
    top: -35px !important;
    right: 0 !important;
    font-size: 22px !important;
    font-weight: 900 !important;
    color: $primary-color !important;
    text-shadow: 0 3px 6px rgba($primary-color, 0.2) !important;
    letter-spacing: 1px !important;
  }
}

// === ТЕКСТ ВОПРОСА - ЧЕРНЫЙ И КРУПНЫЙ, ЦЕНТРИРОВАННЫЙ ===
:deep(.level-question-text) {
  font-size: 32px !important;
  line-height: 1.2 !important;
  font-weight: 800 !important;
  color: #1a1a1a !important;
  text-align: center !important;
  margin: 0 auto 40px auto !important;
  text-shadow: none !important;
  max-width: 700px !important;
  letter-spacing: -0.5px !important;
  width: 100% !important;
  
  &.desktop-question {
    font-size: 36px !important;
    color: #2c2c2c !important;
    font-weight: 900 !important;
    margin: 0 auto 50px auto !important;
  }
}

:deep(.mg-question-text) {
  font-size: 38px !important;
  line-height: 1.1 !important;
  font-weight: 900 !important;
  color: #1a1a1a !important;
  text-align: center !important;
  margin: 0 auto 50px auto !important;
  text-shadow: none !important;
  max-width: 700px !important;
  letter-spacing: -1px !important;
  width: 100% !important;
}

// КОНТЕЙНЕР КНОПОК - ЦЕНТРИРОВАННЫЙ
:deep(.mg-options-container),
:deep(.level-options-container) {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 25px !important;
  width: 100% !important;
  max-width: 650px !important;
  margin: 0 auto !important;
  padding: 0 !important;
}

// КНОПКИ ВЫБОРА - ОГРОМНЫЕ И КРАСИВЫЕ
:deep(.mg-option-button),
:deep(.level-option-button) {
  padding: 30px 20px !important;
  font-size: 28px !important;
  font-weight: 800 !important;
  border-radius: 22px !important;
  border: 4px solid #e0e0e0 !important;
  background: #ffffff !important;
  color: #2c2c2c !important;
  cursor: pointer !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  position: relative !important;
  min-height: 100px !important;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
  letter-spacing: -0.5px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  
  &:hover:not(:disabled) {
    background: rgba($primary-color, 0.08) !important;
    border-color: $primary-color !important;
    transform: translateY(-6px) scale(1.02) !important;
    box-shadow: 
      0 15px 40px rgba($primary-color, 0.25),
      0 8px 20px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
    color: $primary-color !important;
    z-index: 10 !important;
    
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: radial-gradient(circle, 
        rgba($primary-color, 0.15) 0%,
        transparent 70%
      );
      border-radius: 24px;
      opacity: 0;
      animation: glow 0.3s ease-out forwards;
      z-index: -1;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(-3px) scale(1.01) !important;
  }
  
  &.selected,
  &.mg-selected {
    background: linear-gradient(135deg, $primary-color 0%, darken($primary-color, 8%) 100%) !important;
    border-color: darken($primary-color, 15%) !important;
    color: white !important;
    transform: translateY(-6px) scale(1.05) !important;
    box-shadow: 
      0 20px 50px rgba($primary-color, 0.4),
      0 10px 30px rgba($primary-color, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
    z-index: 20 !important;
    
    animation: selectedPulse 2s ease-in-out infinite;
    
    &::after {
      content: '✓';
      position: absolute;
      top: 8px;
      right: 12px;
      font-size: 20px;
      color: white;
      font-weight: 900;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      opacity: 0;
      animation: checkAppear 0.8s ease-out 0.3s forwards;
      z-index: 1;
    }
  }
  
  &.correct {
    background: linear-gradient(135deg, #4CAF50 0%, darken(#4CAF50, 8%) 100%) !important;
    border-color: darken(#4CAF50, 15%) !important;
    color: white !important;
    transform: translateY(-6px) scale(1.08) !important;
    box-shadow: 
      0 20px 50px rgba(#4CAF50, 0.4),
      0 10px 30px rgba(#4CAF50, 0.3) !important;
    
    &::after {
      content: '✓';
      position: absolute;
      top: 8px;
      right: 12px;
      font-size: 24px;
      color: white;
      font-weight: 900;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }
  }
  
  &.incorrect {
    background: linear-gradient(135deg, #f44336 0%, darken(#f44336, 8%) 100%) !important;
    border-color: darken(#f44336, 15%) !important;
    color: white !important;
    transform: translateY(-6px) scale(1.08) !important;
    box-shadow: 
      0 20px 50px rgba(#f44336, 0.4),
      0 10px 30px rgba(#f44336, 0.3) !important;
    
    &::after {
      content: '✗';
      position: absolute;
      top: 8px;
      right: 12px;
      font-size: 24px;
      color: white;
      font-weight: 900;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }
  }
  
  &.disabled,
  &.mg-disabled {
    opacity: 0.4 !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
    filter: grayscale(0.8) !important;
    background: #f8f8f8 !important;
  }
}

// === АНИМАЦИИ ===
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
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes selectedPulse {
  0%, 100% {
    box-shadow: 
      0 20px 50px rgba($primary-color, 0.4),
      0 10px 30px rgba($primary-color, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    transform: translateY(-6px) scale(1.05);
  }
  50% {
    box-shadow: 
      0 25px 60px rgba($primary-color, 0.5),
      0 15px 40px rgba($primary-color, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    transform: translateY(-8px) scale(1.07);
  }
}

@keyframes checkAppear {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-45deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.3) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

// === АДАПТАЦИИ ДЛЯ РАЗНЫХ РАЗМЕРОВ ПК ===

@media (min-width: 768px) and (max-width: 1024px) {
  .desktop-content-overlay {
    border-radius: 28px;
  }
  
  .desktop-content-container {
    padding: 30px 40px;
    border-radius: 28px;
  }
  
  :deep(.math-game-content),
  :deep(.cr-desktop-comic-content) {
    max-width: 650px;
    padding: 40px 35px;
    border-radius: 28px;
    
    &::before {
      top: 15px;
      left: 15px;
      right: 15px;
      height: 5px;
    }
  }
  
  :deep(.level-question-text) {
    font-size: 26px !important;
    color: #2c2c2c !important;
    margin: 0 auto 35px auto !important;
    
    &.desktop-question {
      font-size: 30px !important;
      margin: 0 auto 40px auto !important;
    }
  }
  
  :deep(.mg-question-text) {
    font-size: 28px !important;
    color: #1a1a1a !important;
    margin: 0 auto 40px auto !important;
  }
  
  :deep(.mg-option-button),
  :deep(.level-option-button) {
    padding: 22px 16px !important;
    font-size: 20px !important;
    min-height: 80px !important;
    border-radius: 18px !important;
    color: #2c2c2c !important;
  }
}

@media (min-width: 1024px) and (max-width: 1366px) {
  .desktop-content-overlay {
    border-radius: 30px;
  }
  
  .desktop-content-container {
    padding: 35px 50px;
    border-radius: 30px;
  }
  
  :deep(.math-game-content),
  :deep(.cr-desktop-comic-content) {
    padding: 50px 40px;
    border-radius: 30px;
    
    &::before {
      top: 18px;
      left: 18px;
      right: 18px;
    }
  }
  
  :deep(.level-question-text) {
    font-size: 30px !important;
    color: #2c2c2c !important;
    margin: 0 auto 38px auto !important;
    
    &.desktop-question {
      font-size: 34px !important;
      margin: 0 auto 45px auto !important;
    }
  }
  
  :deep(.mg-question-text) {
    font-size: 34px !important;
    color: #1a1a1a !important;
    margin: 0 auto 45px auto !important;
  }
  
  :deep(.mg-option-button),
  :deep(.level-option-button) {
    padding: 26px 18px !important;
    font-size: 24px !important;
    min-height: 90px !important;
    color: #2c2c2c !important;
  }
}

@media (min-width: 1367px) and (max-width: 1600px) {
  .desktop-content-overlay {
    border-radius: 32px;
  }
  
  .desktop-content-container {
    padding: 50px 70px;
    border-radius: 32px;
  }
  
  :deep(.math-game-content),
  :deep(.cr-desktop-comic-content) {
    max-width: 750px;
    padding: 70px 60px;
    border-radius: 32px;
    
    &::before {
      top: 22px;
      left: 22px;
      right: 22px;
      height: 7px;
    }
  }
  
  :deep(.level-question-text) {
    font-size: 38px !important;
    color: #2c2c2c !important;
    margin: 0 auto 45px auto !important;
    
    &.desktop-question {
      font-size: 42px !important;
      margin: 0 auto 55px auto !important;
    }
  }
  
  :deep(.mg-question-text) {
    font-size: 44px !important;
    color: #1a1a1a !important;
    margin: 0 auto 55px auto !important;
  }
  
  :deep(.mg-option-button),
  :deep(.level-option-button) {
    font-size: 32px !important;
    min-height: 110px !important;
    padding: 32px 24px !important;
    color: #2c2c2c !important;
  }
}

@media (min-width: 1601px) {
  .desktop-content-overlay {
    border-radius: 36px;
  }
  
  .desktop-content-container {
    padding: 60px 80px;
    border-radius: 36px;
  }
  
  :deep(.math-game-content),
  :deep(.cr-desktop-comic-content) {
    max-width: 800px;
    padding: 80px 70px;
    border-radius: 36px;
    
    &::before {
      top: 25px;
      left: 25px;
      right: 25px;
      height: 8px;
    }
  }
  
  :deep(.level-question-text) {
    font-size: 42px !important;
    color: #2c2c2c !important;
    margin: 0 auto 50px auto !important;
    
    &.desktop-question {
      font-size: 48px !important;
      margin: 0 auto 60px auto !important;
    }
  }
  
  :deep(.mg-question-text) {
    font-size: 48px !important;
    color: #1a1a1a !important;
    margin: 0 auto 60px auto !important;
  }
  
  :deep(.mg-option-button),
  :deep(.level-option-button) {
    font-size: 36px !important;
    min-height: 120px !important;
    padding: 35px 26px !important;
    color: #2c2c2c !important;
  }
}

* {
  outline: none !important;
  -webkit-tap-highlight-color: transparent !important;
}
</style>
