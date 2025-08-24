<template>
  <div class="level5-slider" :class="{ 'mobile': isMobile, 'desktop': !isMobile }">
    <!-- ДЕСЕРТ С ЛИНИЕЙ РАЗРЕЗА -->
    <div class="dessert-section">
      <div class="triangle-dessert-container">
        <div class="triangle-dessert">
          <!-- КАРТИНКА ТРЕУГОЛЬНОГО ПЕЧЕНЬЯ -->
          <img 
            src="/assets/images/treugolnik.webp" 
            alt="Triangle cookie"
            class="triangle-cookie-image"
          />
          <!-- ЛИНИЯ РАЗРЕЗА -->
          <div 
            class="cut-line"
            :style="{ left: `${sliderPosition}%` }"
          ></div>
        </div>
        
        <!-- ПОДСКАЗКА -->
        <div class="cut-instruction">
          Wow, I’m full … but I still want a cookie. Can you split it for me?
        </div>
      </div>
    </div>
    
    <!-- СЛАЙДЕР УПРАВЛЕНИЯ -->
    <div class="slider-section">
      <div class="slider-container">
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="sliderPosition"
          class="dessert-slider"
          @mouseup="checkPosition"
          @touchend="checkPosition"
        >
        
        <!-- МЕТКИ НА СЛАЙДЕРЕ -->
        <div class="slider-markers">
          <span class="marker start">0</span>
          <span class="marker middle" :class="{ 'highlight': isNearMiddle }">1/2</span>
          <span class="marker end">1</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Level5Slider',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  emits: ['task-completed'],
  setup(props, { emit }) {
    const sliderPosition = ref(0)
    const showSuccess = ref(false)
    
    const isNearMiddle = computed(() => {
      return Math.abs(sliderPosition.value - 50) <= 10
    })
    
    const isCompleted = computed(() => {
      return Math.abs(sliderPosition.value - 50) <= 8
    })
    
    const checkPosition = () => {
      if (isCompleted.value) {
        showSuccess.value = true
        setTimeout(() => {
          emit('task-completed', true)
        }, 1200)
      }
    }
    
    const resetTask = () => {
      sliderPosition.value = 0
      showSuccess.value = false
    }
    
    return {
      sliderPosition,
      showSuccess,
      isNearMiddle,
      checkPosition,
      resetTask
    }
  }
}
</script>

<style lang="scss" scoped>
.level5-slider {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: visible !important;
  padding: 15px;
  gap: 20px;
  
  &.mobile {
    gap: 18px;
    padding: 12px 8px;
    
    .dessert-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      width: 100%;
      max-width: 300px;
    }
    
    .triangle-dessert-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    
    .triangle-dessert {
      position: relative;
      width: 120px;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .triangle-cookie-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        user-select: none;
        pointer-events: none;
      }
      
      .cut-line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(to bottom, #ff4444, #cc0000);
        z-index: 10;
        transition: left 0.2s ease;
        box-shadow: 0 0 8px rgba(255, 68, 68, 0.6);
        border-radius: 2px;
        
        &::before {
          content: '';
          position: absolute;
          top: -3px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 6px solid #ff4444;
        }
      }
    }
    
    .cut-instruction {
      font-size: 16px; // УВЕЛИЧИЛИ С 11px ДО 16px!
      color: rgba(255, 255, 255, 0.9);
      text-align: center;
      font-weight: 600;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      background: rgba(0, 0, 0, 0.2);
      padding: 8px 12px; // УВЕЛИЧИЛИ ОТСТУПЫ
      border-radius: 8px;
      line-height: 1.3;
      max-width: 320px; // УВЕЛИЧИЛИ max-width
    }
    
    .slider-section {
      width: 100%;
      max-width: 280px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex-shrink: 0;
    }
    
    .slider-container {
      position: relative;
      width: 100%;
    }
    
    .dessert-slider {
      width: 100%;
      height: 12px;
      border-radius: 6px;
      background: linear-gradient(to right, #e5e5e5, #b0b0b0);
      outline: none;
      -webkit-appearance: none;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 28px; // УМЕНЬШИЛИ С 32px ДО 28px
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(99, 102, 241, 0.4);
        transition: all 0.3s ease;
        border: 3px solid rgba(255, 255, 255, 0.9);
        
        &:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(99, 102, 241, 0.6);
        }
        
        &:active {
          transform: scale(1.15);
        }
      }
      
      &::-moz-range-thumb {
        width: 28px; // УМЕНЬШИЛИ С 32px ДО 28px
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        cursor: pointer;
        border: 3px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 4px 8px rgba(99, 102, 241, 0.4);
        transition: all 0.3s ease;
        
        &:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(99, 102, 241, 0.6);
        }
        
        &:active {
          transform: scale(1.15);
        }
      }
    }
    
    .slider-markers {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 14px; // ОСТАВИЛИ КАК ЕСТЬ ДЛЯ ЦИФР
      color: rgba(255, 255, 255, 0.9);
      font-weight: 600;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      
      .marker {
        &.start {
          padding-left: 4px;
        }
        
        &.end {
          padding-right: 4px;
        }
        
        &.middle {
          color: #6366f1;
          font-weight: bold;
          font-size: 18px; // ОСТАВИЛИ КАК ЕСТЬ ДЛЯ 1/2
          transition: all 0.3s ease;
          
          &.highlight {
            color: #10b981;
            text-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
            transform: scale(1.2);
          }
        }
      }
    }
  }
  
  &.desktop {
    gap: 30px;
    padding: 20px;
    
    .dessert-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      flex-shrink: 0;
      width: 100%;
      max-width: 450px;
    }
    
    .triangle-dessert-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    
    .triangle-dessert {
      position: relative;
      width: 180px;
      height: 180px;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .triangle-cookie-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2));
        user-select: none;
        pointer-events: none;
      }
      
      .cut-line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 6px;
        background: linear-gradient(to bottom, #ff4444, #cc0000);
        z-index: 10;
        transition: left 0.2s ease;
        box-shadow: 0 0 12px rgba(255, 68, 68, 0.6);
        border-radius: 3px;
        
        &::before {
          content: '';
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 8px solid #ff4444;
        }
      }
    }
    
    .cut-instruction {
      font-size: 24px; // УВЕЛИЧИЛИ ДО 24px КАК В ПРИМЕРЕ!
      color: #2c2c2c; // ЧЕРНЫЙ ЦВЕТ ВМЕСТО БЕЛОГО КАК В ПРИМЕРЕ!
      text-align: center;
      font-weight: 700; // СДЕЛАЛИ ЖИРНЕЕ КАК В ПРИМЕРЕ!
      text-shadow: none; // УБРАЛИ ТЕНЬ КАК В ПРИМЕРЕ!
      background: none; // УБРАЛИ ФОН
      padding: 0; // УБРАЛИ ОТСТУПЫ
      border-radius: 0; // УБРАЛИ РАДИУС
      line-height: 1.3;
      max-width: 400px;
    }
    
    .slider-section {
      width: 100%;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      flex-shrink: 0;
    }
    
    .slider-container {
      position: relative;
      width: 100%;
    }
    
    .dessert-slider {
      width: 100%;
      height: 16px;
      border-radius: 8px;
      background: linear-gradient(to right, #e5e5e5, #b0b0b0);
      outline: none;
      -webkit-appearance: none;
      box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 36px; // УМЕНЬШИЛИ С 40px ДО 36px
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        cursor: pointer;
        box-shadow: 0 6px 12px rgba(99, 102, 241, 0.4);
        transition: all 0.3s ease;
        border: 4px solid rgba(255, 255, 255, 0.9);
        
        &:hover {
          transform: scale(1.25);
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.6);
        }
        
        &:active {
          transform: scale(1.2);
        }
      }
      
      &::-moz-range-thumb {
        width: 36px; // УМЕНЬШИЛИ С 40px ДО 36px
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        cursor: pointer;
        border: 4px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 6px 12px rgba(99, 102, 241, 0.4);
        transition: all 0.3s ease;
        
        &:hover {
          transform: scale(1.25);
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.6);
        }
        
        &:active {
          transform: scale(1.2);
        }
      }
    }
    
    .slider-markers {
      display: flex;
      justify-content: space-between;
      margin-top: 12px;
      font-size: 18px; // ОСТАВИЛИ КАК ЕСТЬ ДЛЯ ЦИФР
      color: #2c2c2c; // ИЗМЕНИЛИ НА ЧЕРНЫЙ ЦВЕТ КАК В ПРИМЕРЕ!
      font-weight: 600;
      text-shadow: none; // УБРАЛИ ТЕНЬ КАК В ПРИМЕРЕ!
      
      .marker {
        &.start {
          padding-left: 8px;
        }
        
        &.end {
          padding-right: 8px;
        }
        
        &.middle {
          color: #6366f1;
          font-weight: bold;
          font-size: 24px; // ОСТАВИЛИ КАК ЕСТЬ ДЛЯ 1/2
          transition: all 0.3s ease;
          
          &.highlight {
            color: #10b981;
            text-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
            transform: scale(1.3);
          }
        }
      }
    }
  }
}

// ЗАЩИТА ОТ СЛУЧАЙНОГО ВЫДЕЛЕНИЯ
* {
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
}
</style>