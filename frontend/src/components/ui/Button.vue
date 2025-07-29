<template>
    <button 
      :class="buttonClasses" 
      :disabled="disabled"
      :type="type"
      @click="$emit('click', $event)"
    >
      <slot />
    </button>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'secondary', 'small', 'icon'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'button'
    }
  })
  
  const emit = defineEmits(['click'])
  
  const buttonClasses = computed(() => [
    'btn',
    {
      'primary': props.variant === 'primary',
      'secondary': props.variant === 'secondary',
      'small': props.variant === 'small',
      'icon': props.variant === 'icon'
    }
  ])
  </script>