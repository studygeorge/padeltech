<template>
    <div>
      <div id="telegram-login-widget" class="telegram-login"></div>
      <p class="modal-note">
        Нажимая кнопку входа, вы соглашаетесь с условиями использования сервиса
      </p>
    </div>
  </template>
  
  <script setup>
  import { onMounted, nextTick } from 'vue'
  import { createTelegramLoginButton } from '@/utils/telegram'
  
  const props = defineProps({
    botUsername: {
      type: String,
      required: true
    }
  })
  
  const emit = defineEmits(['auth', 'error'])
  
  const initWidget = async () => {
    try {
      await nextTick()
      await createTelegramLoginButton('telegram-login-widget', props.botUsername, (telegramData) => {
        emit('auth', telegramData)
      })
    } catch (err) {
      emit('error', err.message || 'Не удалось загрузить виджет Telegram')
    }
  }
  
  onMounted(initWidget)
  </script>