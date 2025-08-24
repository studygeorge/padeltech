<template>
  <div class="level4-coloring" :class="{ 'mobile': isMobile, 'desktop': !isMobile }">
    <!-- МОБИЛЬНАЯ ВЕРСИЯ - ГОРИЗОНТАЛЬНАЯ КОМПОНОВКА -->
    <template v-if="isMobile">
      <div class="mobile-horizontal-layout">
        <!-- ЛЕВЫЕ ЦВЕТА (1, 2) -->
        <div class="left-colors-section">
          <div 
            v-for="color in leftColors" 
            :key="color.id"
            class="color-item-mobile"
            :class="{ 
              'used': color.used, 
              'active': color.id === nextColorId,
              'disabled': color.id !== nextColorId && !color.used,
              'dragging': touchState.draggedItem && touchState.draggedItem.id === color.id,
              'floating': touchState.isDragging && touchState.draggedItem && touchState.draggedItem.id === color.id
            }"
            :style="{ ...getDraggableStyle(color), backgroundColor: color.hex }"
            :draggable="color.id === nextColorId"
            @dragstart="handleDragStart($event, color)"
            @dragend="handleDragEnd"
            @touchstart="onTouchStart($event, color)"
            @touchmove="onTouchMove($event)"
            @touchend="onTouchEnd($event)"
          >
            <span class="color-number">{{ color.number }}</span>
            <!-- ИНДИКАТОР СЛЕДУЮЩЕГО ЦВЕТА -->
            <div v-if="color.id === nextColorId && !color.used" class="next-indicator">
              <div class="pulse-ring"></div>
              <div class="pulse-ring pulse-ring-2"></div>
            </div>
          </div>
        </div>
        
        <!-- ЦЕНТРАЛЬНАЯ СЕКЦИЯ С КАРТИНКОЙ -->
        <div class="center-image-section">
          <div class="image-title">Paint by numbers</div>
          <div class="coloring-image-wrapper">
            <img 
              :src="currentImageSrc" 
              alt="Coloring image"
              class="coloring-image-mobile"
              @dragover="handleDragOver"
              @drop="handleDrop"
            />
            
            <!-- ОБЛАСТЬ ДЛЯ ДРОПА -->
            <div 
              class="drop-zone"
              @dragover="handleDragOver"
              @drop="handleDrop"
            ></div>
          </div>
          
          <!-- ПРОГРЕСС ПОД КАРТИНКОЙ -->
          <div class="progress-text-mobile">
            {{ currentStep }}/{{ totalSteps }} - {{ progressText }}
          </div>
        </div>
        
        <!-- ПРАВЫЕ ЦВЕТА (3, 4, 5) -->
        <div class="right-colors-section">
          <div 
            v-for="color in rightColors" 
            :key="color.id"
            class="color-item-mobile"
            :class="{ 
              'used': color.used, 
              'active': color.id === nextColorId,
              'disabled': color.id !== nextColorId && !color.used,
              'dragging': touchState.draggedItem && touchState.draggedItem.id === color.id,
              'floating': touchState.isDragging && touchState.draggedItem && touchState.draggedItem.id === color.id
            }"
            :style="{ ...getDraggableStyle(color), backgroundColor: color.hex }"
            :draggable="color.id === nextColorId"
            @dragstart="handleDragStart($event, color)"
            @dragend="handleDragEnd"
            @touchstart="onTouchStart($event, color)"
            @touchmove="onTouchMove($event)"
            @touchend="onTouchEnd($event)"
          >
            <span class="color-number">{{ color.number }}</span>
            <!-- ИНДИКАТОР СЛЕДУЮЩЕГО ЦВЕТА -->
            <div v-if="color.id === nextColorId && !color.used" class="next-indicator">
              <div class="pulse-ring"></div>
              <div class="pulse-ring pulse-ring-2"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- ДЕСКТОП ВЕРСИЯ БЕЗ ИЗМЕНЕНИЙ -->
    <template v-else>
      <!-- ЗАГОЛОВОК ЗАДАНИЯ С БОЛЬШИМ ШРИФТОМ -->
      <div class="level-question-text desktop-question">
        Paint by dragging colors in order from 1 to 5
      </div>
      
      <!-- КАРТИНКА ДЛЯ РАСКРАШИВАНИЯ -->
      <div class="desktop-image-section">
        <div class="coloring-image-wrapper">
          <img 
            :src="currentImageSrc" 
            alt="Coloring image"
            class="coloring-image-desktop"
            @dragover="handleDragOver"
            @drop="handleDrop"
          />
          
          <!-- ОБЛАСТЬ ДЛЯ ДРОПА (вся картинка) -->
          <div 
            class="drop-zone"
            @dragover="handleDragOver"
            @drop="handleDrop"
          ></div>
        </div>
      </div>
      
      <!-- ПАЛИТРА ЦВЕТОВ -->
      <div class="desktop-colors-section">
        <div 
          v-for="color in availableColors" 
          :key="color.id"
          class="color-item-desktop"
          :class="{ 
            'used': color.used, 
            'active': color.id === nextColorId,
            'disabled': color.id !== nextColorId && !color.used
          }"
          :style="{ backgroundColor: color.hex }"
          :draggable="color.id === nextColorId"
          @dragstart="handleDragStart($event, color)"
          @dragend="handleDragEnd"
        >
          <span class="color-number">{{ color.number }}</span>
          <!-- ИНДИКАТОР СЛЕДУЮЩЕГО ЦВЕТА -->
          <div v-if="color.id === nextColorId && !color.used" class="next-indicator">
            <div class="pulse-ring"></div>
            <div class="pulse-ring pulse-ring-2"></div>
          </div>
        </div>
      </div>
      
      <!-- ПРОГРЕСС ДЛЯ ДЕСКТОПА -->
      <div class="progress-text-desktop">
        Step {{ currentStep }}/{{ totalSteps }} - {{ progressText }}
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Level4Coloring',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  emits: ['task-completed'],
  setup(props, { emit }) {
    // СОСТОЯНИЕ РАСКРАШИВАНИЯ
    const currentStep = ref(0) // 0-5 шагов (0 = начало, 5 = конец)
    const draggedColor = ref(null)
    
    // ДОСТУПНЫЕ ЦВЕТА В СТРОГОМ ПОРЯДКЕ
    const availableColors = ref([
      { id: 1, number: '1', hex: '#8B4513', name: 'brown', used: false },
      { id: 2, number: '2', hex: '#FFD700', name: 'yellow', used: false },
      { id: 3, number: '3', hex: '#FF0000', name: 'red', used: false },
      { id: 4, number: '4', hex: '#0000FF', name: 'blue', used: false },
      { id: 5, number: '5', hex: '#87CEEB', name: 'lightblue', used: false }
    ])
    
    // РАЗДЕЛЕНИЕ ЦВЕТОВ ДЛЯ МОБИЛЬНОЙ ВЕРСИИ
    const leftColors = computed(() => {
      return availableColors.value.slice(0, 2) // Цвета 1, 2
    })
    
    const rightColors = computed(() => {
      return availableColors.value.slice(2, 5) // Цвета 3, 4, 5
    })
    
    // TOUCH STATE ДЛЯ МОБИЛЬНОГО
    const touchState = ref({
      isDragging: false,
      draggedItem: null,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      hoveredTarget: null,
      initialRect: null
    })
    
    // ВЫЧИСЛЯЕМЫЕ СВОЙСТВА
    const currentImageSrc = computed(() => {
      const stageMap = {
        0: '/assets/images/0000.png',
        1: '/assets/images/1111.png',
        2: '/assets/images/2222.png',
        3: '/assets/images/3333.png',
        4: '/assets/images/4444.png',
        5: '/assets/images/5555.png'
      }
      return stageMap[currentStep.value] || stageMap[0]
    })
    
    const nextColorId = computed(() => {
      return currentStep.value + 1 // Следующий цвет для применения
    })
    
    const totalSteps = computed(() => {
      return availableColors.value.length
    })
    
    const isCompleted = computed(() => {
      return currentStep.value >= totalSteps.value
    })
    
    const progressText = computed(() => {
      if (isCompleted.value) {
        return "Completed!"
      }
      const colorNames = ['', 'Brown', 'Yellow', 'Red', 'Blue', 'Light Blue']
      return `Next: ${colorNames[nextColorId.value] || ''}`
    })
    
    // СТИЛИ ДЛЯ ПЕРЕТАСКИВАЕМЫХ ЭЛЕМЕНТОВ
    const getDraggableStyle = (color) => {
      if (!touchState.value.isDragging || 
          !touchState.value.draggedItem || 
          touchState.value.draggedItem.id !== color.id) {
        return {}
      }
      
      const deltaX = touchState.value.currentX - touchState.value.startX
      const deltaY = touchState.value.currentY - touchState.value.startY
      
      return {
        position: 'fixed',
        left: `${touchState.value.initialRect.left + deltaX}px`,
        top: `${touchState.value.initialRect.top + deltaY}px`,
        width: `${touchState.value.initialRect.width}px`,
        height: `${touchState.value.initialRect.height}px`,
        zIndex: '9999',
        pointerEvents: 'none',
        transform: 'scale(1.3) rotate(8deg)',
        transition: 'none'
      }
    }
    
    // МЕТОДЫ DRAG & DROP
    const handleDragStart = (event, color) => {
      // МОЖНО ПЕРЕТАСКИВАТЬ ТОЛЬКО СЛЕДУЮЩИЙ ПО ПОРЯДКУ ЦВЕТ
      if (color.id !== nextColorId.value) {
        event.preventDefault()
        return
      }
      
      draggedColor.value = color
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', color.id)
    }
    
    const handleDragEnd = () => {
      draggedColor.value = null
    }
    
    const handleDragOver = (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    }
    
    const handleDrop = (event) => {
      event.preventDefault()
      
      if (!draggedColor.value) return
      
      // ПРОВЕРЯЕМ ЧТО ЭТО ПРАВИЛЬНЫЙ ЦВЕТ ПО ПОРЯДКУ
      if (draggedColor.value.id === nextColorId.value) {
        // ПРИМЕНЯЕМ ЦВЕТ МГНОВЕННО!
        draggedColor.value.used = true
        currentStep.value += 1
        
        // ПРОВЕРЯЕМ ЗАВЕРШЕНИЕ
        if (isCompleted.value) {
          setTimeout(() => {
            emit('task-completed', true)
          }, 500)
        }
      }
      
      draggedColor.value = null
    }
    
    // TOUCH EVENTS ДЛЯ МОБИЛЬНОГО
    const onTouchStart = (event, color) => {
      if (color.used || color.id !== nextColorId.value) return
      
      event.preventDefault()
      const touch = event.touches[0]
      const element = event.currentTarget
      const rect = element.getBoundingClientRect()
      
      touchState.value.isDragging = true
      touchState.value.draggedItem = color
      touchState.value.startX = touch.clientX
      touchState.value.startY = touch.clientY
      touchState.value.currentX = touch.clientX
      touchState.value.currentY = touch.clientY
      touchState.value.hoveredTarget = null
      touchState.value.initialRect = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      }
      
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }
    
    const onTouchMove = (event) => {
      if (!touchState.value.isDragging || !touchState.value.draggedItem) return
      
      event.preventDefault()
      const touch = event.touches[0]
      
      touchState.value.currentX = touch.clientX
      touchState.value.currentY = touch.clientY
      
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
      const dropZone = elementBelow?.closest('.drop-zone')
      
      if (dropZone) {
        touchState.value.hoveredTarget = 'image'
      } else {
        touchState.value.hoveredTarget = null
      }
    }
    
    const onTouchEnd = (event) => {
      if (!touchState.value.isDragging || !touchState.value.draggedItem) return
      
      const touch = event.changedTouches[0]
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
      const dropZone = elementBelow?.closest('.drop-zone')
      
      if (dropZone && touchState.value.draggedItem.id === nextColorId.value) {
        // ПРИМЕНЯЕМ ЦВЕТ!
        touchState.value.draggedItem.used = true
        currentStep.value += 1
        
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100])
        }
        
        if (isCompleted.value) {
          setTimeout(() => {
            emit('task-completed', true)
          }, 500)
        }
      } else {
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200])
        }
      }
      
      // Сброс состояния
      touchState.value.isDragging = false
      touchState.value.draggedItem = null
      touchState.value.currentX = 0
      touchState.value.currentY = 0
      touchState.value.hoveredTarget = null
      touchState.value.initialRect = null
      
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    
    const resetTask = () => {
      currentStep.value = 0
      availableColors.value.forEach(color => {
        color.used = false
      })
      
      touchState.value.isDragging = false
      touchState.value.draggedItem = null
      touchState.value.hoveredTarget = null
      touchState.value.initialRect = null
      
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    
    return {
      currentImageSrc,
      availableColors,
      leftColors,
      rightColors,
      currentStep,
      totalSteps,
      nextColorId,
      progressText,
      touchState,
      getDraggableStyle,
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDrop,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      resetTask
    }
  }
}
</script>

<style lang="scss" scoped>
.level4-coloring {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: visible !important;
  padding: 4px;
  position: relative;
  
  &.mobile {
    padding: 8px 4px;
    
    // ГОРИЗОНТАЛЬНАЯ КОМПОНОВКА: ЛЕВЫЕ ЦВЕТА - КАРТИНКА - ПРАВЫЕ ЦВЕТА
    .mobile-horizontal-layout {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      gap: 8px;
      padding: 4px;
    }
    
    // ЛЕВАЯ КОЛОНКА С ЦВЕТАМИ (1, 2)
    .left-colors-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex-shrink: 0;
      align-items: center;
      width: 60px;
    }
    
    // ЦЕНТРАЛЬНАЯ СЕКЦИЯ С КАРТИНКОЙ
    .center-image-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      gap: 8px;
      max-width: 200px;
      
      .image-title {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.95);
        font-weight: 700;
        text-align: center;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
        white-space: nowrap;
      }
      
      .coloring-image-wrapper {
        position: relative;
        width: 140px;
        height: 140px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 3px dashed rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.05);
        flex-shrink: 0;
        
        &:hover {
          border-color: rgba(255, 255, 255, 0.6);
        }
        
        .coloring-image-mobile {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 8px;
          user-select: none;
          pointer-events: none;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
        
        .drop-zone {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10;
          border-radius: 8px;
        }
      }
      
      .progress-text-mobile {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
        font-weight: 600;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        white-space: nowrap;
      }
    }
    
    // ПРАВАЯ КОЛОНКА С ЦВЕТАМИ (3, 4, 5)
    .right-colors-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex-shrink: 0;
      align-items: center;
      width: 60px;
    }
    
    // ОБЩИЕ СТИЛИ ДЛЯ ЦВЕТОВ НА МОБИЛЬНОМ
    .color-item-mobile {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      border: 3px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      position: relative;
      flex-shrink: 0;
      
      &.disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: scale(0.85);
      }
      
      &.active {
        cursor: grab;
        transform: scale(1.1);
        border-color: #10b981;
        border-width: 4px;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
        
        &:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3), 0 0 25px rgba(16, 185, 129, 0.7);
        }
        
        &:active {
          cursor: grabbing;
        }
      }
      
      // ОБЫЧНОЕ ПЕРЕТАСКИВАНИЕ
      &.dragging:not(.floating) {
        opacity: 0.5 !important;
        transform: scale(0.8) !important;
        
        .color-number {
          animation: sourcePulse 0.8s ease-in-out infinite alternate;
          filter: grayscale(0.6);
        }
      }

      // FLOATING СОСТОЯНИЕ - ЭЛЕМЕНТ ЛЕТАЕТ
      &.floating {
        opacity: 1 !important;
        box-shadow: 
          0 25px 50px rgba(0, 0, 0, 0.3),
          0 10px 25px rgba(255, 107, 107, 0.4) !important;
        border-color: #ff6b6b !important;
        
        .color-number {
          animation: floatGlow 0.5s ease-in-out infinite alternate;
        }
      }
      
      &.used {
        opacity: 0.3;
        cursor: default;
        transform: scale(0.75);
        
        &::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 18px;
          font-weight: bold;
          text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
        }
      }
      
      .color-number {
        color: white;
        font-weight: bold;
        font-size: 16px;
        text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
        pointer-events: none;
      }
      
      .next-indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        
        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          border: 3px solid #10b981;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s infinite;
          
          &.pulse-ring-2 {
            animation-delay: 1s;
          }
        }
      }
    }
  }
  
  &.desktop {
    gap: 15px;
    justify-content: center;
    
    // ЗАГОЛОВОК КАК В ПРИМЕРЕ - БОЛЬШОЙ ШРИФТ
    .level-question-text {
      text-align: center;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.92);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
      margin: 0;
      
      &.desktop-question {
        font-size: 18px;
        line-height: 1.3;
        max-width: 450px;
        margin-bottom: 8px;
      }
    }
    
    .desktop-image-section {
      display: flex;
      justify-content: center;
      width: 100%;
      flex-shrink: 0;
    }
    
    .coloring-image-wrapper {
      position: relative;
      width: 250px;
      height: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 4px dashed rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.05);
      
      &:hover {
        border-color: rgba(0, 0, 0, 0.4);
      }
      
      .coloring-image-desktop {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 12px;
        user-select: none;
        pointer-events: none;
        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2));
      }
      
      .drop-zone {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        border-radius: 12px;
      }
    }
    
    .desktop-colors-section {
      display: flex;
      gap: 12px;
      justify-content: center;
      width: 100%;
      flex-shrink: 0;
    }
    
    .color-item-desktop {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      border: 4px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      position: relative;
      
      &.disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: scale(0.9);
      }
      
      &.active {
        cursor: grab;
        transform: scale(1.15);
        border-color: #10b981;
        border-width: 5px;
        box-shadow: 0 0 25px rgba(16, 185, 129, 0.5);
        
        &:hover {
          transform: scale(1.25);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3), 0 0 30px rgba(16, 185, 129, 0.7);
        }
        
        &:active {
          cursor: grabbing;
        }
      }
      
      &.used {
        opacity: 0.3;
        cursor: default;
        transform: scale(0.8);
        
        &::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 28px;
          font-weight: bold;
          text-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
        }
      }
      
      .color-number {
        color: white;
        font-weight: bold;
        font-size: 24px;
        text-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
        pointer-events: none;
      }
      
      .next-indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        
        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 80px;
          height: 80px;
          border: 4px solid #10b981;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s infinite;
          
          &.pulse-ring-2 {
            animation-delay: 1s;
          }
        }
      }
    }
    
    .progress-text-desktop {
      font-size: 18px;
      color: #2c2c2c;
      text-align: center;
      font-weight: 600;
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.4);
  }
}

@keyframes sourcePulse {
  0% {
    opacity: 0.5;
    transform: scale(0.8);
  }
  100% {
    opacity: 0.7;
    transform: scale(0.85);
  }
}

@keyframes floatGlow {
  0% {
    filter: brightness(1.2);
    transform: rotate(8deg);
  }
  100% {
    filter: brightness(1.3);
    transform: rotate(5deg);
  }
}

// МЕДИА-ЗАПРОСЫ ДЛЯ АДАПТАЦИИ НА РАЗНЫХ ЭКРАНАХ
@media (max-width: 360px) {
  .level4-coloring.mobile {
    .mobile-horizontal-layout {
      gap: 4px;
      padding: 2px;
    }
    
    .left-colors-section,
    .right-colors-section {
      width: 50px;
      gap: 8px;
    }
    
    .center-image-section {
      max-width: 160px;
      
      .image-title {
        font-size: 12px;
      }
      
      .coloring-image-wrapper {
        width: 120px;
        height: 120px;
      }
      
      .progress-text-mobile {
        font-size: 10px;
      }
    }
    
    .color-item-mobile {
      width: 44px;
      height: 44px;
      
      .color-number {
        font-size: 14px;
      }
      
      .next-indicator .pulse-ring {
        width: 50px;
        height: 50px;
      }
    }
  }
}

@media (max-height: 600px) {
  .level4-coloring.mobile {
    .mobile-horizontal-layout {
      gap: 6px;
    }
    
    .center-image-section {
      .coloring-image-wrapper {
        width: 130px;
        height: 130px;
      }
    }
    
    .color-item-mobile {
      width: 46px;
      height: 46px;
    }
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .level4-coloring.mobile {
    .mobile-horizontal-layout {
      gap: 8px;
      padding: 4px 8px;
    }
    
    .center-image-section {
      .coloring-image-wrapper {
        width: 110px;
        height: 110px;
      }
      
      .image-title {
        font-size: 12px;
      }
      
      .progress-text-mobile {
        font-size: 10px;
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