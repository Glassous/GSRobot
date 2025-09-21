import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import backButtonService from './services/backButtonService'

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

// 初始化Capacitor相关服务
const initCapacitorServices = async () => {
  // 检测是否在Capacitor环境中
  if (window.Capacitor) {
    try {
      await backButtonService.initialize();
    } catch (error) {
      console.error('Failed to initialize Capacitor services:', error);
    }
  }
}

initTheme()

const app = createApp(App)
app.use(router)

// 将backButtonService添加到全局属性，方便组件使用
app.config.globalProperties.$backButtonService = backButtonService

app.mount('#app')

// 在应用挂载后初始化Capacitor服务
initCapacitorServices()
