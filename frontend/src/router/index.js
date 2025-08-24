import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/comic',
    name: 'ComicReader',
    component: () => import(/* webpackChunkName: "comic" */ '@/views/ComicReader.vue')
  },
  {
    path: '/game',
    name: 'MathGame', 
    component: () => import(/* webpackChunkName: "game" */ '@/views/MathGame.vue')
  },
  {
    path: '/rewards',
    name: 'Rewards',
    component: () => import(/* webpackChunkName: "rewards" */ '@/views/Rewards.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Простые navigation guards без загрузочных экранов - ТОЛЬКО для логирования
router.beforeEach((to, from, next) => {
  console.log(`Router: Мгновенный переход с ${from.name} на ${to.name}`)
  next()
})

router.afterEach((to, from) => {
  console.log(`Router: Переход завершен на ${to.name} - видео уже загружены!`)
})

export default router