import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Match from '@/views/Match.vue';
import FastMatch from '@/views/FastMatch.vue';
import Rating from '@/views/Rating.vue';
import Profile from '@/views/Profile.vue';
import Tournament from '@/views/Tournament.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/match',
      name: 'match',
      component: Match
    },
    {
      path: '/fast-match/:id',
      name: 'fast-match',
      component: FastMatch
    },
    {
      path: '/tournament/:id',
      name: 'tournament',
      component: Tournament
    },
    {
      path: '/rating',
      name: 'rating',
      component: Rating
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    }
  ]
});

// Только профиль требует авторизацию
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { useAuthStore } = await import('@/stores/auth');
    const authStore = useAuthStore();
    
    if (!authStore.isInitialized) {
      await authStore.initializeAuth();
    }
    
    if (!authStore.isAuthenticated) {
      next('/');
      return;
    }
  }
  
  next();
});

export default router;