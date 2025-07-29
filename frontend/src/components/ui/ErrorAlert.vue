<template>
    <div v-if="error" class="error">
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      {{ error }}
    </div>
  </template>
  
  <script setup>
  defineProps({
    error: {
      type: String,
      default: ''
    }
  })
  </script>