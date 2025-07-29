<template>
    <div class="court-selector">
      <label class="court-label">Выберите корт</label>
      <div class="courts-grid">
        <button
          v-for="n in courtsCount" 
          :key="n"
          type="button"
          :class="['court-btn', { active: modelValue === n }]"
          @click="$emit('update:modelValue', n)"
        >
          № {{ n }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    modelValue: {
      type: Number,
      default: null
    },
    courtsCount: {
      type: Number,
      default: 11
    }
  })
  
  defineEmits(['update:modelValue'])
  </script>
  
  <style scoped>
  .court-selector {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .court-label {
    font-weight: 500;
    color: #222;
  }
  
  .courts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 8px;
  }
  
  .court-btn {
    padding: 12px 8px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.15s;
  }
  
  .court-btn:hover {
    border-color: #1976d2;
    background: #f8f9ff;
  }
  
  .court-btn.active {
    background: #1976d2;
    color: white;
    border-color: #1976d2;
  }
  
  @media (max-width: 600px) {
    .courts-grid {
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    }
  }
  </style>