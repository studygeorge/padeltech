<template>
    <Modal :show="show" title="Вход в PadelTech" @close="$emit('close')">
      <ErrorAlert :error="error" />
      
      <Loading v-if="isLoading" text="Выполняется вход..." overlay />
      
      <div v-else>
        <TelegramLoginWidget 
          :bot-username="botUsername"
          @auth="handleAuth"
          @error="error = $event"
        />
      </div>
    </Modal>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Modal from '@/components/ui/Modal.vue'
  import Loading from '@/components/ui/Loading.vue'
  import ErrorAlert from '@/components/ui/ErrorAlert.vue'
  import TelegramLoginWidget from './TelegramLoginWidget.vue'
  import { useAuthStore } from '@/stores/auth'
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    botUsername: {
      type: String,
      default: 'padeltech_bot'
    }
  })
  
  const emit = defineEmits(['close', 'success'])
  
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const error = ref(null)
  
  const handleAuth = async (telegramData) => {
    try {
      isLoading.value = true
      error.value = null
      await authStore.loginWithTelegram(telegramData)
      emit('success')
      emit('close')
    } catch (err) {
      error.value = err.message || 'Ошибка входа'
    } finally {
      isLoading.value = false
    }
  }
  </script>
  