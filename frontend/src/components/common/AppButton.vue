<template>
  <button 
    class="btn"
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
import { computed } from 'vue'
import { getDeviceType } from '@/utils/responsive'

export default {
  name: 'AppButton',
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'accent'].includes(value)
    },
    large: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props) {
    const deviceType = computed(() => getDeviceType())
    
    const buttonClasses = computed(() => ({
      [`btn-${props.type}`]: true,
      'btn-large': props.large,
      'btn-full-width': props.fullWidth,
      [`btn-${deviceType.value}`]: true,
      'btn-disabled': props.disabled
    }))
    
    return {
      buttonClasses
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  border: none;
  font-size: $font-size-normal;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  font-family: $font-family-primary;
  outline: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  
  // === MOBILE VERSION (compact buttons) ===
  &.btn-mobile, &.btn-tablet {
    padding: $spacing-small $spacing-medium;
    font-size: 0.9em;
    min-height: 40px;
    min-width: 100px;
    border-radius: 20px;
  }
  
  // === DESKTOP VERSION (large buttons) ===
  &.btn-desktop, &.btn-desktop-small {
    padding: $spacing-medium $spacing-xl;
    font-size: $font-size-lg;
    min-height: 56px;
    min-width: 180px;
    border-radius: 28px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &.btn-large {
    // Mobile version large button
    &.btn-mobile, &.btn-tablet {
      padding: $spacing-medium $spacing-large;
      font-size: 1em;
      min-height: 44px;
      min-width: 120px;
      border-radius: 22px;
    }
    
    // Desktop version large button
    &.btn-desktop, &.btn-desktop-small {
      padding: $spacing-large $spacing-xxl;
      font-size: $font-size-xl;
      min-height: 68px;
      min-width: 220px;
      border-radius: 34px;
      font-weight: 700;
    }
  }
  
  &.btn-full-width {
    width: 100%;
    min-width: auto;
  }
  
  // === DISABLED STATE ===
  &:disabled, &.btn-disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    }
  }
  
  // === BUTTON TYPES ===
  &.btn-primary {
    background: linear-gradient(135deg, $primary-color, darken($primary-color, 10%));
    color: $white;
    box-shadow: 0 4px 15px rgba($primary-color, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, darken($primary-color, 5%), darken($primary-color, 15%));
      box-shadow: 0 6px 25px rgba($primary-color, 0.4);
    }
  }
  
  &.btn-secondary {
    background: linear-gradient(135deg, $secondary-color, darken($secondary-color, 10%));
    color: $white;
    box-shadow: 0 4px 15px rgba($secondary-color, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, darken($secondary-color, 5%), darken($secondary-color, 15%));
      box-shadow: 0 6px 25px rgba($secondary-color, 0.4);
    }
  }
  
  &.btn-accent {
    background: linear-gradient(135deg, $accent-color, darken($accent-color, 10%));
    color: $text-color;
    box-shadow: 0 4px 15px rgba($accent-color, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, darken($accent-color, 5%), darken($accent-color, 15%));
      box-shadow: 0 6px 25px rgba($accent-color, 0.4);
    }
  }
  
  &:focus {
    outline: none !important;
    box-shadow: 0 0 0 3px rgba($primary-color, 0.3) !important;
  }
  
  &:active {
    outline: none !important;
  }
}
</style>