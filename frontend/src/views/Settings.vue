<template>
  <VideoBackground videoName="reward">
    <div class="rewards-content" :class="{ 'mobile-layout': isMobile, 'desktop-layout': !isMobile }">
      
      <!-- MOBILE VERSION -->
      <template v-if="isMobile">
        <div class="mobile-header">
          <h2 class="rewards-title mobile-title">My Rewards</h2>
        </div>
        
        <div class="mobile-actions">
          <div class="content-area">
            <div class="stats-container">
              <div class="stat-item">
                <div class="stat-value">{{ points }}</div>
                <div class="stat-label">Points</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ completedTasks }}</div>
                <div class="stat-label">Tasks</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ currentLevel }}</div>
                <div class="stat-label">Level</div>
              </div>
            </div>
            
            <div class="rewards-container">
              <div 
                v-for="i in 5" 
                :key="i"
                class="reward-item"
                :class="{ 'unlocked': i <= completedTasks }"
              >
                <div class="reward-icon">
                  {{ i <= completedTasks ? '⭐' : '🔒' }}
                </div>
                <div class="reward-name">
                  {{ i <= completedTasks ? `Reward ${i}` : 'Locked' }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="button-area">
            <AppButton 
              type="primary" 
              fullWidth
              @click="$router.push('/')"
            >
              Home
            </AppButton>
            <AppButton 
              v-if="completedTasks < 5" 
              type="secondary" 
              fullWidth
              @click="$router.push('/comic')"
            >
              Continue Adventure
            </AppButton>
          </div>
        </div>
      </template>
      
      <!-- DESKTOP VERSION -->
      <template v-else>
        <div class="desktop-content">
          <h2 class="rewards-title desktop-title">My Rewards</h2>
          
          <div class="desktop-content-area">
            <div class="content-area">
              <div class="stats-container">
                <div class="stat-item">
                  <div class="stat-value">{{ points }}</div>
                  <div class="stat-label">Points</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ completedTasks }}</div>
                  <div class="stat-label">Tasks Completed</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ currentLevel }}</div>
                  <div class="stat-label">Current Level</div>
                </div>
              </div>
              
              <div class="rewards-container">
                <div 
                  v-for="i in 5" 
                  :key="i"
                  class="reward-item"
                  :class="{ 'unlocked': i <= completedTasks }"
                >
                  <div class="reward-icon">
                    {{ i <= completedTasks ? '⭐' : '🔒' }}
                  </div>
                  <div class="reward-name">
                    {{ i <= completedTasks ? `Achievement ${i}` : 'Locked' }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="button-area">
              <AppButton 
                type="primary" 
                large
                @click="$router.push('/')"
              >
                Home
              </AppButton>
              <AppButton 
                v-if="completedTasks < 5" 
                type="secondary" 
                large
                @click="$router.push('/comic')"
              >
                Continue Adventure
              </AppButton>
            </div>
          </div>
        </div>
      </template>
      
    </div>
  </VideoBackground>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
import VideoBackground from '@/components/game/VideoBackground.vue'
import { getDeviceType } from '@/utils/responsive'

export default {
  name: 'RewardsPage',
  components: {
    AppButton,
    VideoBackground
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const isMobile = computed(() => {
      const deviceType = getDeviceType()
      return deviceType === 'mobile' || deviceType === 'tablet'
    })
    
    const points = computed(() => store.getters.points)
    const completedTasks = computed(() => store.getters.completedTasks)
    const currentLevel = computed(() => store.getters.currentLevel)
    
    return {
      points,
      completedTasks,
      currentLevel,
      isMobile,
      router
    }
  }
}
</script>

<style lang="scss" scoped>
.rewards-content {
  width: 100%;
  height: 100%;
  font-family: $font-family-primary;
}

// === MOBILE VERSION ===
.mobile-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  
  .mobile-header {
    text-align: center;
    margin-bottom: $spacing-xs;
    flex-shrink: 0;
  }
  
  .mobile-title {
    font-size: 1.2em;
    font-weight: 700;
    color: $primary-color;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: $font-family-display;
  }
  
  .mobile-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    min-height: 0;
  }
  
  .content-area {
    display: flex;
    flex-direction: column;
    gap: $spacing-small;
    flex: 1;
    padding: 0 $spacing-small;
    min-height: 0;
  }
  
  .stats-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-xs;
    flex-shrink: 0;
  }
  
  .stat-item {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: $spacing-xs;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .stat-value {
    font-size: 1em;
    font-weight: 800;
    color: $primary-color;
    font-family: $font-family-display;
  }
  
  .stat-label {
    font-size: 0.6em;
    color: $text-color;
    opacity: 0.8;
    margin-top: $spacing-xs;
    font-weight: 500;
  }
  
  .rewards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: $spacing-xs;
    flex: 1;
  }
  
  .reward-item {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: $spacing-xs;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &.unlocked {
      background: rgba(255, 249, 196, 0.9);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
    }
  }
  
  .reward-icon {
    font-size: 1.2em;
    margin-bottom: $spacing-xs;
  }
  
  .reward-name {
    font-size: 0.6em;
    color: $text-color;
    font-weight: 600;
  }
  
  .button-area {
    width: 100%;
    padding: 0 $spacing-small;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    flex-shrink: 0;
  }
}

// === DESKTOP VERSION ===
.desktop-layout {
  .desktop-content {
    max-width: 800px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .desktop-title {
    font-size: 2.8em;
    font-weight: 800;
    color: $primary-color;
    margin-bottom: $spacing-large;
    font-family: $font-family-display;
    letter-spacing: -0.02em;
  }
  
  .desktop-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-large;
  }
  
  .stats-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-large;
  }
  
  .stat-item {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(15px);
    border-radius: 16px;
    padding: $spacing-large;
    text-align: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .stat-value {
    font-size: 2.5em;
    font-weight: 900;
    color: $primary-color;
    font-family: $font-family-display;
  }
  
  .stat-label {
    font-size: 1em;
    color: $text-color;
    opacity: 0.8;
    margin-top: $spacing-small;
    font-weight: 500;
  }
  
  .rewards-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: $spacing-medium;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .reward-item {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(15px);
    border-radius: 16px;
    padding: $spacing-medium;
    text-align: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transition: all 0.3s ease;
    
    &.unlocked {
      background: rgba(255, 249, 196, 0.9);
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
    }
  }
  
  .reward-icon {
    font-size: 2.5em;
    margin-bottom: $spacing-small;
  }
  
  .reward-name {
    font-size: 0.9em;
    color: $text-color;
    font-weight: 600;
  }
  
  .button-area {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    gap: $spacing-large;
  }
}

// Убираем outline со всех элементов
* {
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
}

:deep(.btn) {
  outline: none !important;
  -webkit-tap-highlight-color: transparent !important;
  
  &:focus {
    outline: none !important;
    box-shadow: 0 0 0 3px rgba($primary-color, 0.3) !important;
  }
}

// Responsive adjustments
@media (max-width: $breakpoint-xs) {
  .mobile-layout {
    .mobile-title {
      font-size: 1.1em;
    }
    
    .stat-value {
      font-size: 0.9em;
    }
    
    .stat-label {
      font-size: 0.55em;
    }
    
    .reward-icon {
      font-size: 1em;
    }
    
    .reward-name {
      font-size: 0.55em;
    }
  }
}

@media (min-width: $breakpoint-lg) {
  .desktop-layout {
    .desktop-content {
      max-width: 900px;
    }
    
    .desktop-title {
      font-size: 3.2em;
    }
    
    .stat-value {
      font-size: 3em;
    }
    
    .reward-icon {
      font-size: 3em;
    }
  }
}
</style>
