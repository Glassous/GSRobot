import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// 初始化主题
const initTheme = () => {
  const savedTheme = localStorage.getItem('gsrobot-theme') || 'system'
  
  if (savedTheme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else {
    document.documentElement.setAttribute('data-theme', savedTheme)
  }

  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('gsrobot-theme') === 'system') {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
    }
  })
}

initTheme()

const app = createApp(App)
app.use(router)
app.mount('#app')
