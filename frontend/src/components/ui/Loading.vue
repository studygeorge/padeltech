<template>
    <div class="loading" :class="{ 'loading-overlay': overlay }">
      <div class="spinner"></div>
      <p v-if="text">{{ text }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    text: {
      type: String,
      default: ''
    },
    overlay: {
      type: Boolean,
      default: false
    }
  })
  </script>