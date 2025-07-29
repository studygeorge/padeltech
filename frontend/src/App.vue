<template>
  <div id="app">
    <Header />
    <main>
      <Loading v-if="!authStore.isInitialized" text="Загрузка..." />
      <router-view v-else />
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Header from './components/Header.vue'
import BottomNav from './components/BottomNav.vue'
import Loading from './components/ui/Loading.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>