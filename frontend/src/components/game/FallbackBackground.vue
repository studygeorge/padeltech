<template>
  <div class="fallback-background" :class="{ 'is-desktop': !isMobile }">
    <div class="cat-icon">
      <div class="cat-face"></div>
    </div>
    
    <div class="content-area">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FallbackBackground',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.fallback-background {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: $primary-color;
  overflow: hidden;
}

.cat-icon {
  position: fixed;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: darken($primary-color, 10%);
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  z-index: -1;
  
  @media (max-width: $breakpoint-tablet) {
    right: 50%;
    transform: translate(50%, -50%);
  }
  
  @media (min-width: $breakpoint-tablet + 1) {
    right: 20%;
    transform: translateY(-50%);
  }
}

.cat-face {
  width: 100px;
  height: 100px;
  position: relative;
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    top: 30px;
  }
  
  &:before {
    left: 20px;
  }
  
  &:after {
    right: 20px;
  }
  
  // Добавляем улыбку
  &::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 20px;
    border-bottom: 4px solid white;
    border-radius: 0 0 20px 20px;
    bottom: 20px;
    left: 30px;
    top: auto;
    right: auto;
  }
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
