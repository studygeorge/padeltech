<template>
    <div class="player-input">
      <input 
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="player-field"
        required
      />
      <Button
        variant="icon" 
        @click="$emit('remove')"
        v-if="removable"
        class="remove-btn"
        aria-label="Удалить игрока"
      >
        ✕
      </Button>
    </div>
  </template>
  
  <script setup>
  import Button from '@/components/ui/Button.vue'
  
  defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    removable: {
      type: Boolean,
      default: true
    }
  })
  
  defineEmits(['update:modelValue', 'remove'])
  </script>
  
  <style scoped>
  .player-input {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .player-field {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.15s;
  }
  
  .player-field:focus {
    outline: none;
    border-color: #1976d2;
  }
  
  .remove-btn {
    background: #ff4444;
    color: white;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  
  .remove-btn:hover {
    background: #cc0000;
  }
  </style>