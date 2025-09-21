import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Settings from '../views/Settings.vue'
import AIConfig from '../views/AIConfig.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/ai-config',
    name: 'AIConfig',
    component: AIConfig
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router