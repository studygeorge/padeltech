

<template>
  <div class="mobile-content-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ContentOverlayMobile'
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.mobile-content-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 101;
  overflow: visible !important;
  padding: 8px 8px 0px 8px;
  justify-content: flex-start;
  align-items: stretch;
  gap: 0;
  min-height: 100%;
  background: transparent !important;
  
  touch-action: manipulation;
  -webkit-overflow-scrolling: touch;
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

:deep(.food-item), :deep(.bowl), :deep(.control-btn) {
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
}

:deep(.custom-slider) {
  touch-action: pan-x;
}

@media (max-width: 360px) {
  .mobile-content-container {
    padding: 4px 6px 0px 6px;
  }
}

@media (max-height: 600px) {
  .mobile-content-container {
    padding: 6px 8px 0px 8px;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .mobile-content-container {
    padding: 2px 4px 0px 4px;
  }
}

@media (min-height: 800px) {
  .mobile-content-container {
    padding: 10px 12px 0px 12px;
  }
}

@media (min-height: 900px) {
  .mobile-content-container {
    padding: 12px 16px 0px 16px;
  }
}

* {
  outline: none !important;
  -webkit-tap-highlight-color: transparent !important;
}
</style>