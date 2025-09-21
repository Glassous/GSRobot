<template>
  <div class="min-h-screen bg-base-100">
    <!-- 顶部导航栏 -->
    <div class="navbar bg-base-200 shadow-sm border-b border-base-300">
      <!-- 左侧返回按钮 -->
      <div class="navbar-start">
        <button @click="goBackToHome" class="btn btn-ghost btn-circle" aria-label="Back to home">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <!-- 中间标题 -->
      <div class="navbar-center">
        <h1 class="text-xl font-bold">设置</h1>
      </div>
      
      <!-- 右侧占位 -->
      <div class="navbar-end">
      </div>
    </div>

    <!-- 设置内容 -->
    <div class="container mx-auto p-6 max-w-2xl">
      <!-- 外观设置 -->
      <div class="card bg-base-200 shadow-sm mb-6">
        <div class="card-body">
          <h2 class="card-title text-lg mb-4">外观设置</h2>
          
          <!-- 主题选择 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">主题模式</span>
            </label>
            <div class="flex gap-2 flex-wrap">
              <button 
                @click="changeTheme('system')"
                :class="[
                  'btn flex-1 min-w-0',
                  selectedTheme === 'system' ? 'btn-primary' : 'btn-outline'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                自动
              </button>
              <button 
                @click="changeTheme('light')"
                :class="[
                  'btn flex-1 min-w-0',
                  selectedTheme === 'light' ? 'btn-primary' : 'btn-outline'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                浅色
              </button>
              <button 
                @click="changeTheme('dark')"
                :class="[
                  'btn flex-1 min-w-0',
                  selectedTheme === 'dark' ? 'btn-primary' : 'btn-outline'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                深色
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- AI配置 -->
      <div class="card bg-base-200 shadow-sm mb-6">
        <div class="card-body">
          <h2 class="card-title text-lg mb-4">AI配置</h2>
          
          <!-- API密钥 -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text font-medium">API Key</span>
            </label>
            <input 
              v-model="apiKey"
              type="password" 
              placeholder="请输入您的API密钥" 
              class="input input-bordered w-full"
            />
          </div>

          <!-- 模型选择 -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text font-medium">AI模型</span>
            </label>
            <input 
              v-model="selectedModel"
              type="text" 
              placeholder="请输入AI模型名称" 
              class="input input-bordered w-full"
            />
          </div>





          <!-- 保存按钮 -->
          <div class="card-actions justify-end">
            <button @click="saveSettings" class="btn btn-primary">
              保存设置
            </button>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Settings',
  setup() {
    const router = useRouter()
    const selectedTheme = ref('system')
    const apiKey = ref('')
    const selectedModel = ref('')

    // 加载设置
    const loadSettings = () => {
      const savedTheme = localStorage.getItem('gsrobot-theme') || 'system'
      const savedApiKey = localStorage.getItem('gsrobot-api-key') || ''
      const savedModel = localStorage.getItem('gsrobot-model') || ''

      selectedTheme.value = savedTheme
      apiKey.value = savedApiKey
      selectedModel.value = savedModel

      applyTheme(savedTheme)
    }

    // 应用主题
    const applyTheme = (theme) => {
      if (theme === 'system') {
        // 跟随系统主题
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
      } else {
        document.documentElement.setAttribute('data-theme', theme)
      }
    }

    // 更改主题
    const changeTheme = (theme) => {
      if (theme) {
        selectedTheme.value = theme
      }
      applyTheme(selectedTheme.value)
      localStorage.setItem('gsrobot-theme', selectedTheme.value)
    }

    // 返回主页
    const goBackToHome = () => {
      // 设置标记，表示来自设置页面
      sessionStorage.setItem('gsrobot-from-settings', 'true')
      router.push('/')
    }

    // 保存设置
    const saveSettings = () => {
      localStorage.setItem('gsrobot-theme', selectedTheme.value)
      localStorage.setItem('gsrobot-api-key', apiKey.value)
      localStorage.setItem('gsrobot-model', selectedModel.value)

      // 显示保存成功提示
      const toast = document.createElement('div')
      toast.className = 'toast toast-top toast-center'
      toast.innerHTML = `
        <div class="alert alert-success">
          <span>设置已保存</span>
        </div>
      `
      document.body.appendChild(toast)
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 2000)
    }

    // 监听系统主题变化
    const setupSystemThemeListener = () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (selectedTheme.value === 'system') {
          applyTheme('system')
        }
      })
    }

    onMounted(() => {
      loadSettings()
      setupSystemThemeListener()
    })

    return {
      selectedTheme,
      apiKey,
      selectedModel,
      changeTheme,
      saveSettings,
      goBackToHome
    }
  }
}
</script>