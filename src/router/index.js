import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Settings from '../views/Settings.vue'
import AIConfig from '../views/AIConfig.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      isRoot: true, // 标记为根页面
      title: 'GSRobot'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      backTo: '/', // 指定返回路径
      title: '设置'
    }
  },
  {
    path: '/ai-config',
    name: 'AIConfig',
    component: AIConfig,
    meta: {
      backTo: '/settings', // 从设置页面进入，返回到设置页面
      title: 'AI配置'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：记录导航历史，用于智能返回
let navigationHistory = []

router.beforeEach((to, from, next) => {
  // 记录导航历史（最多保留10条）
  if (from.name) {
    navigationHistory.push({
      name: from.name,
      path: from.path,
      timestamp: Date.now()
    })
    
    // 限制历史记录长度
    if (navigationHistory.length > 10) {
      navigationHistory = navigationHistory.slice(-10)
    }
  }
  
  next()
})

// 智能返回函数
router.smartBack = function() {
  const currentRoute = this.currentRoute.value
  
  // 如果当前路由定义了返回路径，使用它
  if (currentRoute.meta?.backTo) {
    this.push(currentRoute.meta.backTo)
    return true
  }
  
  // 如果有导航历史，返回上一页
  if (navigationHistory.length > 0) {
    const lastRoute = navigationHistory.pop()
    this.push(lastRoute.path)
    return true
  }
  
  // 如果不是根页面，返回首页
  if (!currentRoute.meta?.isRoot) {
    this.push('/')
    return true
  }
  
  // 已经在根页面，无法返回
  return false
}

// 获取导航历史
router.getNavigationHistory = function() {
  return [...navigationHistory]
}

// 清除导航历史
router.clearNavigationHistory = function() {
  navigationHistory = []
}

export default router