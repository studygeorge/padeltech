<template>
    <div class="players-manager">
      <div class="players-header">
        <label>Игроки ({{ players.length }}/{{ maxPlayers }})</label>
        <div class="players-info">
          <span class="info-text" :class="getInfoClass()">{{ getPlayersInfoText() }}</span>
        </div>
      </div>
      
      <div class="players-list">
        <PlayerInput
          v-for="(player, index) in players" 
          :key="index"
          v-model="players[index]"
          :placeholder="`Игрок ${index + 1}`"
          :removable="players.length > minPlayers"
          @remove="removePlayer(index)"
        />
      </div>
      
      <div class="players-actions">
        <Button 
          variant="secondary"
          @click="addPlayer" 
          :disabled="players.length >= maxPlayers"
          v-if="players.length < maxPlayers"
        >
          Добавить игрока
        </Button>
      </div>
      
      <div class="helper-text">
        {{ getHelperText() }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import PlayerInput from './PlayerInput.vue'
  import Button from '@/components/ui/Button.vue'
  
  const props = defineProps({
    players: {
      type: Array,
      required: true
    },
    minPlayers: {
      type: Number,
      default: 4
    },
    maxPlayers: {
      type: Number,
      default: 24
    }
  })
  
  const emit = defineEmits(['update:players'])
  
  const players = computed({
    get: () => props.players,
    set: (value) => emit('update:players', value)
  })
  
  const addPlayer = () => {
    if (players.value.length < props.maxPlayers) {
      const newPlayers = [...players.value, '']
      emit('update:players', newPlayers)
    }
  }
  
  const removePlayer = (index) => {
    if (players.value.length > props.minPlayers) {
      const newPlayers = players.value.filter((_, i) => i !== index)
      emit('update:players', newPlayers)
    }
  }
  
  const getPlayersInfoText = () => {
    const count = players.value.length
    if (count < 4) return 'Недостаточно игроков'
    if (count >= 4 && count <= 16) return 'Подходящее количество'
    if (count === 20 || count === 24) return 'Подходящее количество'
    return 'Неподходящее количество'
  }
  
  const getInfoClass = () => {
    const count = players.value.length
    if (count < 4) return 'error'
    if ((count >= 4 && count <= 16) || count === 20 || count === 24) return 'success'
    return 'warning'
  }
  
  const getHelperText = () => {
    return 'Игра может быть организована при количестве участников 4–16, либо ровно 20 или 24 игрока'
  }
  
  const isValidPlayerCount = computed(() => {
    const count = players.value.length
    return (count >= 4 && count <= 16) || count === 20 || count === 24
  })
  
  defineExpose({
    isValidPlayerCount
  })
  </script>
  
  <style scoped>
  .players-manager {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .players-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .players-header label {
    font-weight: 500;
    color: #222;
  }
  
  .players-info {
    display: flex;
    align-items: center;
  }
  
  .info-text {
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
  }
  
  .info-text.success {
    color: #22c55e;
    background: rgba(34, 197, 94, 0.1);
  }
  
  .info-text.error {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }
  
  .info-text.warning {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
  }
  
  .players-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .players-actions {
    display: flex;
    gap: 8px;
  }
  
  .helper-text {
    color: #666;
    font-size: 14px;
    line-height: 1.4;
  }
  
  @media (max-width: 600px) {
    .players-list {
      gap: 12px;
    }
  }
  </style>