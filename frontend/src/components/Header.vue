<template>
  <header>
    <div class="header-title">PadelTech</div>
    <button class="header-profile-btn" @click="$router.push('/profile')" aria-label="Профиль" tabindex="0">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
      </svg>
    </button>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script> 