<template>
  <div class="level3-drag-drop" :class="{ 'mobile': isMobile, 'desktop': !isMobile }">
    <!-- КОМПАКТНАЯ КОМПОНОВКА ДЛЯ МОБИЛЬНОГО -->
    <template v-if="isMobile">
      <!-- ВЕРХНЯЯ СЕКЦИЯ: ВКУСНЯШКИ ДЛЯ ПЕРЕТАСКИВАНИЯ -->
      <div class="mobile-shapes-section">
        <div class="shapes-title">Drag the cookies:</div>
        <div class="draggable-shapes-row">
          <div 
            v-for="food in availableFood" 
            :key="food.id"
            class="draggable-food-mobile"
            :class="[food.shape, { 
              'placed': food.placed,
              'dragging': touchState.draggedItem && touchState.draggedItem.id === food.id,
              'floating': touchState.isDragging && touchState.draggedItem && touchState.draggedItem.id === food.id
            }]"
            :style="getDraggableStyle(food)"
            :draggable="!food.placed"
            @dragstart="onDragStart($event, food)"
            @touchstart="onTouchStart($event, food)"
            @touchmove="onTouchMove($event)"
            @touchend="onTouchEnd($event)"
          >
            <img 
              :src="getFoodImage(food.shape)" 
              :alt="getFoodName(food.shape)"
              class="food-image-mobile"
              draggable="false"
            />
          </div>
        </div>
      </div>
      
      <!-- НИЖНЯЯ СЕКЦИЯ: КОРЗИНКИ -->
      <div class="mobile-targets-section">
        <div class="targets-title">Into matching baskets:</div>
        <div class="target-bowls-row">
          <div 
            v-for="shape in basketOrder" 
            :key="shape"
            class="target-basket-mobile"
            :class="[`basket-${shape}`, {
              'has-item': droppedItems[shape].length > 0
            }]"
            @drop="onDrop($event, shape)"
            @dragover.prevent
            @dragenter.prevent
          >
            <img 
              :src="getBasketImage(shape)" 
              :alt="getBasketName(shape)"
              class="basket-image-mobile"
              draggable="false"
            />
            <!-- ЗЕЛЕНАЯ ГАЛОЧКА ПРИ УСПЕХЕ -->
            <div class="success-checkmark-mobile" v-if="droppedItems[shape].length > 0">
              <div class="checkmark-circle">
                <div class="checkmark-stem"></div>
                <div class="checkmark-kick"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- ДЕСКТОП ВЕРСИЯ С БОЛЬШИМ ТЕКСТОМ КАК В ПРИМЕРЕ -->
    <template v-else>
      <!-- ЗАГОЛОВОК ЗАДАНИЯ С БОЛЬШИМ ШРИФТОМ -->
      <div class="level-question-text desktop-question">
        Drag the cookies into matching baskets
      </div>
      
      <!-- ВКУСНЯШКИ СВЕРХУ - С ОТСТУПАМИ -->
      <div class="geometric-shapes-section">
        <div 
          v-for="food in availableFood" 
          :key="food.id"
          class="draggable-food-desktop"
          :class="[food.shape, { 'placed': food.placed }]"
          :draggable="!food.placed"
          @dragstart="onDragStart($event, food)"
        >
          <img 
            :src="getFoodImage(food.shape)" 
            :alt="getFoodName(food.shape)"
            class="food-image-desktop"
            draggable="false"
          />
        </div>
      </div>
      
      <!-- КОРЗИНКИ СНИЗУ - С ОТСТУПАМИ, ДРУГОЙ ПОРЯДОК -->
      <div class="bowls-section">
        <div 
          v-for="shape in basketOrder" 
          :key="shape"
          class="target-basket-desktop"
          :class="[`basket-${shape}`, { 'has-item': droppedItems[shape].length > 0 }]"
          @drop="onDrop($event, shape)"
          @dragover.prevent
          @dragenter.prevent
        >
          <img 
            :src="getBasketImage(shape)" 
            :alt="getBasketName(shape)"
            class="basket-image-desktop"
            draggable="false"
          />
          <!-- ЗЕЛЕНАЯ ГАЛОЧКА ПРИ УСПЕХЕ -->
          <div class="success-checkmark-desktop" v-if="droppedItems[shape].length > 0">
            <div class="checkmark-circle">
              <div class="checkmark-stem"></div>
              <div class="checkmark-kick"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue'

export default {
  name: 'Level3DragDrop',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  emits: ['task-completed'],
  setup(props, { emit }) {
    const droppedItems = ref({
      circle: [],
      square: [],
      triangle: []
    })
    
    // ПЕЧЕНЬКИ В ОДНОМ ПОРЯДКЕ: круг, квадрат, треугольник
    const availableFood = ref([
      { id: 1, shape: 'circle', placed: false },
      { id: 2, shape: 'square', placed: false },
      { id: 3, shape: 'triangle', placed: false }
    ])
    
    // КОРЗИНКИ В ДРУГОМ ПОРЯДКЕ: треугольник, круг, квадрат
    const basketOrder = ref(['triangle', 'circle', 'square'])
    
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
    
    const isCompleted = computed(() => {
      return availableFood.value.every(food => food.placed)
    })

    // ФУНКЦИИ ДЛЯ ПОЛУЧЕНИЯ ПУТЕЙ К ИЗОБРАЖЕНИЯМ
    const getFoodImage = (shape) => {
      const foodImages = {
        circle: '/assets/images/krug.webp',           // Круглая еда
        square: '/assets/images/kvadrat.webp',       // Квадратная еда
        triangle: '/assets/images/treugolnik.webp'   // Треугольная еда
      }
      return foodImages[shape] || '/assets/images/krug.webp'
    }
    
    const getBasketImage = (shape) => {
      const basketImages = {
        circle: '/assets/images/miska_krug.webp',       // Круглая корзинка
        square: '/assets/images/miska_kvadrat.webp',    // Квадратная корзинка  
        triangle: '/assets/images/miska_treugolnik.webp' // Треугольная корзинка
      }
      return basketImages[shape] || '/assets/images/miska_krug.webp'
    }
    
    const getFoodName = (shape) => {
      const foodNames = {
        circle: 'Round cookie',
        square: 'Square cookie',
        triangle: 'Triangle cookie'
      }
      return foodNames[shape] || 'Cookie'
    }
    
    const getBasketName = (shape) => {
      const basketNames = {
        circle: 'Round basket',
        square: 'Square basket',
        triangle: 'Triangle basket'
      }
      return basketNames[shape] || 'Basket'
    }

    // СТИЛИ ДЛЯ ПЕРЕТАСКИВАЕМЫХ ЭЛЕМЕНТОВ
    const getDraggableStyle = (food) => {
      if (!touchState.value.isDragging || 
          !touchState.value.draggedItem || 
          touchState.value.draggedItem.id !== food.id) {
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
    
    const onDragStart = (event, food) => {
      event.dataTransfer.setData('application/json', JSON.stringify(food))
    }
    
    const onDrop = (event, targetShape) => {
      event.preventDefault()
      const food = JSON.parse(event.dataTransfer.getData('application/json'))
      
      if (food.shape === targetShape && !food.placed) {
        droppedItems.value[targetShape].push(food)
        const foodIndex = availableFood.value.findIndex(f => f.id === food.id)
        if (foodIndex !== -1) {
          availableFood.value[foodIndex].placed = true
        }
        
        nextTick(() => {
          if (isCompleted.value) {
            setTimeout(() => emit('task-completed', true), 800)
          }
        })
      }
    }
    
    const onTouchStart = (event, food) => {
      if (food.placed) return
      
      event.preventDefault()
      const touch = event.touches[0]
      const element = event.currentTarget
      const rect = element.getBoundingClientRect()
      
      touchState.value.isDragging = true
      touchState.value.draggedItem = food
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
      const basket = elementBelow?.closest('.target-basket-mobile')
      
      if (basket) {
        const targetShape = basket.classList.contains('basket-circle') ? 'circle' :
                          basket.classList.contains('basket-square') ? 'square' :
                          basket.classList.contains('basket-triangle') ? 'triangle' : null
        touchState.value.hoveredTarget = targetShape
      } else {
        touchState.value.hoveredTarget = null
      }
    }
    
    const onTouchEnd = (event) => {
      if (!touchState.value.isDragging || !touchState.value.draggedItem) return
      
      const touch = event.changedTouches[0]
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
      const basket = elementBelow?.closest('.target-basket-mobile')
      
      if (basket) {
        const targetShape = basket.classList.contains('basket-circle') ? 'circle' :
                          basket.classList.contains('basket-square') ? 'square' :
                          basket.classList.contains('basket-triangle') ? 'triangle' : null
        
        if (targetShape && targetShape === touchState.value.draggedItem.shape) {
          droppedItems.value[targetShape].push(touchState.value.draggedItem)
          const foodIndex = availableFood.value.findIndex(f => f.id === touchState.value.draggedItem.id)
          if (foodIndex !== -1) {
            availableFood.value[foodIndex].placed = true
          }
          
          if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100])
          }
          
          nextTick(() => {
            if (isCompleted.value) {
              setTimeout(() => emit('task-completed', true), 800)
            }
          })
        } else {
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200])
          }
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
      droppedItems.value = {
        circle: [],
        square: [],
        triangle: []
      }
      
      availableFood.value = [
        { id: 1, shape: 'circle', placed: false },
        { id: 2, shape: 'square', placed: false },
        { id: 3, shape: 'triangle', placed: false }
      ]

      touchState.value.isDragging = false
      touchState.value.draggedItem = null
      touchState.value.hoveredTarget = null
      touchState.value.initialRect = null
      
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    
    return {
      droppedItems,
      availableFood,
      basketOrder,
      touchState,
      getDraggableStyle,
      onDragStart,
      onDrop,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      resetTask,
      getFoodImage,
      getBasketImage,
      getFoodName,
      getBasketName
    }
  }
}
</script>

<style lang="scss" scoped>
.level3-drag-drop {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow: visible !important;
  padding: 4px;
  position: relative;
  
  &.mobile {
    gap: 8px;
    
    // ВЕРХНЯЯ СЕКЦИЯ С ЕДОЙ
    .mobile-shapes-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      flex-shrink: 0;
      gap: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 8px 10px;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      
      .shapes-title {
        font-size: 16px; // УВЕЛИЧИЛИ С 11px ДО 16px!
        color: rgba(255, 255, 255, 0.95);
        font-weight: 700;
        text-align: center;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
        margin-bottom: 4px; // УВЕЛИЧИЛИ ОТСТУП
      }
      
      .draggable-shapes-row {
        display: flex;
        justify-content: center;
        gap: 12px;
        width: 100%;
      }
      
      .draggable-food-mobile {
        width: 60px;
        height: 60px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 16px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        border: 2px solid rgba(255, 255, 255, 0.8);
        
        .food-image-mobile {
          width: 50px;
          height: 50px;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          transition: all 0.3s ease;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
        
        &:hover:not(.placed):not(.floating) {
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          border-color: #ff6b6b;
        }
        
        &:active:not(.placed):not(.floating) {
          transform: scale(1.15);
        }

        // ОБЫЧНОЕ ПЕРЕТАСКИВАНИЕ
        &.dragging:not(.floating) {
          opacity: 0.5 !important;
          transform: scale(0.85) !important;
          
          .food-image-mobile {
            animation: sourcePulse 0.8s ease-in-out infinite alternate;
            filter: grayscale(0.6) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          }
        }

        // FLOATING СОСТОЯНИЕ - ЭЛЕМЕНТ ЛЕТАЕТ
        &.floating {
          opacity: 1 !important;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.3),
            0 10px 25px rgba(255, 107, 107, 0.4) !important;
          border-color: #ff6b6b !important;
          background: rgba(255, 255, 255, 1) !important;
          
          .food-image-mobile {
            animation: floatGlow 0.5s ease-in-out infinite alternate;
            filter: brightness(1.2) drop-shadow(0 0 15px rgba(255, 107, 107, 0.8));
          }
        }
        
        &.placed {
          opacity: 0.3;
          cursor: not-allowed;
          transform: scale(0.75);
          filter: grayscale(1);
          
          .food-image-mobile {
            filter: grayscale(1) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
          }
        }
      }
    }
    
    // НИЖНЯЯ СЕКЦИЯ С КОРЗИНКАМИ - БЕЗ ПОДСВЕТКИ!
    .mobile-targets-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      flex-shrink: 0;
      gap: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 8px 10px;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      
      .targets-title {
        font-size: 16px; // УВЕЛИЧИЛИ С 11px ДО 16px!
        color: rgba(255, 255, 255, 0.95);
        font-weight: 700;
        text-align: center;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
        margin-bottom: 4px; // УВЕЛИЧИЛИ ОТСТУП
      }
      
      .target-bowls-row {
        display: flex;
        justify-content: center;
        gap: 12px;
        width: 100%;
      }
      
      .target-basket-mobile {
        width: 68px;
        height: 68px;
        background: rgba(255, 255, 255, 0.9);
        border: 3px solid #6366f1;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.25);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        
        .basket-image-mobile {
          width: 56px;
          height: 56px;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          transition: all 0.3s ease;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
        
        &:hover {
          transform: scale(1.05);
          border-color: #4f46e5;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.35);
        }
        
        // УСПЕШНО ЗАПОЛНЕННАЯ КОРЗИНКА
        &.has-item {
          border-color: #10b981 !important;
          background: rgba(16, 185, 129, 0.1) !important;
          box-shadow: 
            0 8px 25px rgba(16, 185, 129, 0.3),
            inset 0 0 15px rgba(16, 185, 129, 0.1) !important;
          
          .basket-image-mobile {
            filter: brightness(1.05) drop-shadow(0 0 8px rgba(16, 185, 129, 0.4));
          }
        }
        
        // КРАСИВАЯ ЗЕЛЕНАЯ ГАЛОЧКА
        .success-checkmark-mobile {
          position: absolute;
          top: -12px;
          right: -12px;
          width: 28px;
          height: 28px;
          animation: successAppear 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          
          .checkmark-circle {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 
              0 4px 12px rgba(16, 185, 129, 0.4),
              0 0 0 3px rgba(255, 255, 255, 0.9);
            position: relative;
            
            .checkmark-stem,
            .checkmark-kick {
              position: absolute;
              background: white;
              border-radius: 2px;
            }
            
            .checkmark-stem {
              width: 2px;
              height: 8px;
              top: 6px;
              left: 13px;
              transform: rotate(45deg);
              animation: checkmarkStem 0.3s ease-in-out 0.2s forwards;
              opacity: 0;
            }
            
            .checkmark-kick {
              width: 2px;
              height: 4px;
              top: 10px;
              left: 9px;
              transform: rotate(-45deg);
              animation: checkmarkKick 0.3s ease-in-out 0.4s forwards;
              opacity: 0;
            }
          }
        }
      }
    }
  }
  
  // ДЕСКТОП ВЕРСИЯ - С ОТСТУПАМИ И БОЛЬШИМ ТЕКСТОМ КАК В ПРИМЕРЕ
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
    
    .geometric-shapes-section {
      display: flex;
      justify-content: center;
      gap: 12px;
      width: 100%;
      flex-shrink: 0;
    }
    
    .draggable-food-desktop {
      width: 100px;
      height: 100px;
      cursor: grab;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      border: 3px solid rgba(255, 255, 255, 0.8);
      
      .food-image-desktop {
        width: 80px;
        height: 80px;
        object-fit: contain;
        pointer-events: none;
        user-select: none;
        transition: all 0.3s ease;
        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2));
      }
      
      &:active {
        cursor: grabbing;
      }
      
      &:hover:not(.placed) {
        transform: scale(1.1);
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
        border-color: #ff6b6b;
      }
      
      &.placed {
        opacity: 0.3;
        cursor: not-allowed;
        transform: scale(0.8);
        
        .food-image-desktop {
          filter: grayscale(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
      }
    }
    
    .bowls-section {
      display: flex;
      justify-content: center;
      gap: 12px;
      width: 100%;
      flex-shrink: 0;
    }
    
    .target-basket-desktop {
      width: 110px;
      height: 110px;
      background: rgba(255, 255, 255, 0.9);
      border: 4px solid #6366f1;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.25);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      
      .basket-image-desktop {
        width: 88px;
        height: 88px;
        object-fit: contain;
        pointer-events: none;
        user-select: none;
        transition: all 0.3s ease;
        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2));
      }
      
      &:hover {
        transform: scale(1.05);
        border-color: #4f46e5;
        box-shadow: 0 12px 35px rgba(99, 102, 241, 0.35);
      }
      
      // УСПЕШНО ЗАПОЛНЕННАЯ КОРЗИНКА
      &.has-item {
        border-color: #10b981 !important;
        background: rgba(16, 185, 129, 0.1) !important;
        box-shadow: 
          0 12px 35px rgba(16, 185, 129, 0.3),
          inset 0 0 20px rgba(16, 185, 129, 0.1) !important;
        
        .basket-image-desktop {
          filter: brightness(1.05) drop-shadow(0 0 10px rgba(16, 185, 129, 0.4));
        }
      }
      
      // КРАСИВАЯ ЗЕЛЕНАЯ ГАЛОЧКА ДЛЯ ДЕСКТОПА
      .success-checkmark-desktop {
        position: absolute;
        top: -15px;
        right: -15px;
        width: 34px;
        height: 34px;
        animation: successAppear 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        
        .checkmark-circle {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 6px 18px rgba(16, 185, 129, 0.4),
            0 0 0 4px rgba(255, 255, 255, 0.9);
          position: relative;
          
          .checkmark-stem,
          .checkmark-kick {
            position: absolute;
            background: white;
            border-radius: 2px;
          }
          
          .checkmark-stem {
            width: 3px;
            height: 10px;
            top: 7px;
            left: 16px;
            transform: rotate(45deg);
            animation: checkmarkStem 0.3s ease-in-out 0.2s forwards;
            opacity: 0;
          }
          
          .checkmark-kick {
            width: 3px;
            height: 5px;
            top: 12px;
            left: 11px;
            transform: rotate(-45deg);
            animation: checkmarkKick 0.3s ease-in-out 0.4s forwards;
            opacity: 0;
          }
        }
      }
    }
  }
}

// АНИМАЦИИ
@keyframes successAppear {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes checkmarkStem {
  0% {
    height: 0;
    opacity: 0;
  }
  100% {
    height: 8px;
    opacity: 1;
  }
}

@keyframes checkmarkKick {
  0% {
    height: 0;
    opacity: 0;
  }
  100% {
    height: 4px;
    opacity: 1;
  }
}

@keyframes sourcePulse {
  0% {
    opacity: 0.5;
    transform: scale(0.85);
  }
  100% {
    opacity: 0.7;
    transform: scale(0.9);
  }
}

@keyframes floatGlow {
  0% {
    filter: brightness(1.2) drop-shadow(0 0 15px rgba(255, 107, 107, 0.8));
    transform: rotate(8deg);
  }
  100% {
    filter: brightness(1.3) drop-shadow(0 0 20px rgba(255, 107, 107, 1));
    transform: rotate(5deg);
  }
}

// ОБНОВЛЕННЫЕ МЕДИА-ЗАПРОСЫ
@media (max-width: 360px) {
  .level3-drag-drop.mobile {
    gap: 6px;
    
    .mobile-shapes-section .shapes-title,
    .mobile-targets-section .targets-title {
      font-size: 14px; // УМЕНЬШИЛИ ДЛЯ МАЛЫХ ЭКРАНОВ
    }
    
    .draggable-food-mobile {
      width: 55px;
      height: 55px;
      
      .food-image-mobile {
        width: 45px;
        height: 45px;
      }
    }
    
    .target-basket-mobile {
      width: 60px;
      height: 60px;
      
      .basket-image-mobile {
        width: 48px;
        height: 48px;
      }
      
      .success-checkmark-mobile {
        width: 24px;
        height: 24px;
        top: -10px;
        right: -10px;
      }
    }
  }
}

@media (max-height: 600px) {
  .level3-drag-drop.mobile {
    gap: 5px;
    
    .mobile-shapes-section .shapes-title,
    .mobile-targets-section .targets-title {
      font-size: 14px; // УМЕНЬШИЛИ ДЛЯ НИЗКИХ ЭКРАНОВ
    }
    
    .draggable-food-mobile {
      width: 58px;
      height: 58px;
      
      .food-image-mobile {
        width: 48px;
        height: 48px;
      }
    }
    
    .target-basket-mobile {
      width: 62px;
      height: 62px;
      
      .basket-image-mobile {
        width: 50px;
        height: 50px;
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