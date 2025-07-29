<template>
    <Modal :show="show" title="Введите счет" @close="$emit('close')">
      <div class="score-modal">
        <div class="teams-display">
          <div class="team">
            <div class="team-name">Команда 1</div>
            <div class="players">
              <div class="player">{{ match?.team1?.player1 }}</div>
              <div class="player">{{ match?.team1?.player2 }}</div>
            </div>
          </div>
          
          <div class="vs">VS</div>
          
          <div class="team">
            <div class="team-name">Команда 2</div>
            <div class="players">
              <div class="player">{{ match?.team2?.player1 }}</div>
              <div class="player">{{ match?.team2?.player2 }}</div>
            </div>
          </div>
        </div>
  
        <div class="score-inputs">
          <div class="score-group">
            <label>Очки команды 1</label>
            <input 
              type="number" 
              v-model.number="team1Score"
              @input="updateTeam2Score"
              :max="maxPoints"
              min="0"
              class="score-input"
            />
          </div>
          
          <div class="score-separator">:</div>
          <div class="score-group">
          <label>Очки команды 2</label>
          <input 
            type="number" 
            v-model.number="team2Score"
            @input="updateTeam1Score"
            :max="maxPoints"
            min="0"
            class="score-input"
          />
        </div>
      </div>

      <div class="score-info">
        <p>Максимум {{ maxPoints }} очков за сет</p>
        <p class="auto-fill-hint">При вводе очков одной команды, очки другой команды рассчитаются автоматически</p>
      </div>

      <div class="modal-actions">
        <Button variant="primary" @click="saveScore" :disabled="!isValidScore">
          Сохранить счет
        </Button>
        <Button @click="$emit('close')">
          Отмена
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  match: {
    type: Object,
    default: null
  },
  maxPoints: {
    type: Number,
    default: 21
  }
})

const emit = defineEmits(['close', 'save'])

const team1Score = ref(0)
const team2Score = ref(0)
const isAutoFilling = ref(false)

const isValidScore = computed(() => {
  const total = team1Score.value + team2Score.value
  return total === props.maxPoints && team1Score.value >= 0 && team2Score.value >= 0
})

const updateTeam2Score = () => {
  if (isAutoFilling.value) return
  isAutoFilling.value = true
  
  if (team1Score.value >= 0 && team1Score.value <= props.maxPoints) {
    team2Score.value = props.maxPoints - team1Score.value
  }
  
  setTimeout(() => {
    isAutoFilling.value = false
  }, 100)
}

const updateTeam1Score = () => {
  if (isAutoFilling.value) return
  isAutoFilling.value = true
  
  if (team2Score.value >= 0 && team2Score.value <= props.maxPoints) {
    team1Score.value = props.maxPoints - team2Score.value
  }
  
  setTimeout(() => {
    isAutoFilling.value = false
  }, 100)
}

const saveScore = () => {
  if (!isValidScore.value) return
  
  emit('save', {
    matchId: props.match?.id,
    team1Score: team1Score.value,
    team2Score: team2Score.value
  })
}

// Сброс значений при открытии модального окна
watch(() => props.show, (newValue) => {
  if (newValue && props.match) {
    team1Score.value = props.match.team1Score || 0
    team2Score.value = props.match.team2Score || 0
  }
})
</script>

<style scoped>
.score-modal {
  padding: 8px;
}

.teams-display {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  gap: 24px;
}

.team {
  text-align: center;
  min-width: 140px;
}

.team-name {
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 16px;
  color: #333;
}

.players {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player {
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
}

.vs {
  font-size: 20px;
  font-weight: bold;
  color: #666;
}

.score-inputs {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
}

.score-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.score-group label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.score-input {
  width: 80px;
  height: 60px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.15s;
}

.score-input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.score-separator {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.score-info {
  text-align: center;
  margin-bottom: 24px;
}

.score-info p {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}

.auto-fill-hint {
  font-style: italic;
  color: #888 !important;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

@media (max-width: 600px) {
  .teams-display {
    flex-direction: column;
    gap: 16px;
  }
  
  .vs {
    font-size: 16px;
  }
  
  .score-inputs {
    gap: 16px;
  }
  
  .score-input {
    width: 70px;
    height: 50px;
    font-size: 20px;
  }
  
  .score-separator {
    font-size: 24px;
  }
}
</style>