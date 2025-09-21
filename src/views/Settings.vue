<template>
  <div class="min-h-screen bg-base-100">
    <!-- 顶部导航栏 -->
    <div class="navbar bg-base-200 shadow-sm border-b border-base-300 fixed top-0 left-0 right-0 z-40">
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
    <div class="container mx-auto p-6 max-w-2xl pt-20">
      <!-- 外观设置 -->
      <div class="card bg-base-200 shadow-sm mb-6">
        <div class="card-body">
          <h2 class="card-title text-lg mb-4">外观设置</h2>
          
          <!-- 主题选择 -->
          <div class="form-control mb-6">
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

          <!-- 源码呈现模式 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">内容呈现模式</span>
            </label>
            <div class="flex gap-2 flex-wrap">
              <button 
                @click="changeRenderMode('normal')"
                :class="[
                  'btn flex-1 min-w-0',
                  renderMode === 'normal' ? 'btn-primary' : 'btn-outline'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                标准模式
              </button>
              <button 
                @click="changeRenderMode('source')"
                :class="[
                  'btn flex-1 min-w-0',
                  renderMode === 'source' ? 'btn-primary' : 'btn-outline'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                源码模式
              </button>
            </div>
            <div class="label">
              <span class="label-text-alt text-base-content/60">
                源码模式下将直接显示原始内容，不进行Markdown渲染和深度思考处理
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- AI配置 -->
      <div class="card bg-base-200 shadow-sm mb-6">
        <div class="card-body">
          <h2 class="card-title text-lg mb-4">AI配置</h2>
          
          <!-- AI配置 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">AI模型选择</span>
            </label>
            <div class="space-y-3">
              <!-- 模型选择区域 -->
              <div class="bg-base-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                <div v-if="availableModels.length === 0" class="text-center text-base-content/60 py-4">
                  暂无可用模型，请先配置模型
                </div>
                <div v-else class="space-y-2">
                  <div 
                    v-for="model in availableModels" 
                    :key="model.id"
                    class="form-control"
                  >
                    <label class="label cursor-pointer justify-start space-x-3 py-2 px-3 rounded-lg hover:bg-base-300 transition-colors">
                      <input 
                        type="radio" 
                        :value="model.id" 
                        v-model="selectedModelId"
                        @change="onModelChange"
                        class="radio radio-primary" 
                      />
                      <div class="flex-1">
                        <div class="font-medium">{{ model.displayName }}</div>
                        <div class="text-sm text-base-content/60">{{ model.provider }}</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <!-- 配置按钮 -->
              <div class="flex justify-end">
                <button 
                  @click="goToAIConfig" 
                  class="btn btn-outline btn-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  管理模型配置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Settings',
  setup() {
    const router = useRouter()
    const selectedTheme = ref('system')
    const selectedModelId = ref('')
    const availableModels = ref([])
    const renderMode = ref('normal')

    // 加载可用模型列表
    const loadAvailableModels = () => {
      const savedConfig = localStorage.getItem('gsrobot-ai-config')
      const models = []
      
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig)
          config.forEach(sdk => {
            sdk.groups?.forEach(group => {
              group.models?.forEach(model => {
                if (model.name && model.displayName) {
                  models.push({
                    id: model.id,
                    name: model.name,
                    displayName: model.displayName,
                    provider: `${sdk.name} - ${group.name}`,
                    sdkId: sdk.id,
                    groupId: group.id
                  })
                }
              })
            })
          })
        } catch (e) {
          console.error('加载模型配置失败:', e)
        }
      }
      
      availableModels.value = models
    }

    // 加载设置
    const loadSettings = () => {
      const savedTheme = localStorage.getItem('gsrobot-theme') || 'system'
      const savedSelectedModel = localStorage.getItem('gsrobot-selected-model') || ''
      const savedRenderMode = localStorage.getItem('gsrobot-render-mode') || 'normal'
      
      selectedTheme.value = savedTheme
      selectedModelId.value = savedSelectedModel
      renderMode.value = savedRenderMode
      
      loadAvailableModels()
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

    // 更改渲染模式
    const changeRenderMode = (mode) => {
      if (mode) {
        renderMode.value = mode
        localStorage.setItem('gsrobot-render-mode', mode)
      }
    }

    // 返回主页
    const goBackToHome = () => {
      // 设置标记，表示来自设置页面
      sessionStorage.setItem('gsrobot-from-settings', 'true')
      router.push('/')
    }

    // 跳转到AI配置页面
    const goToAIConfig = () => {
      router.push('/ai-config')
    }

    // 模型选择变化处理
    const onModelChange = () => {
      localStorage.setItem('gsrobot-selected-model', selectedModelId.value)
      
      // 更新当前模型信息用于其他组件
      const selectedModel = availableModels.value.find(m => m.id === selectedModelId.value)
      if (selectedModel) {
        // 获取组级别的配置信息
        const savedConfig = localStorage.getItem('gsrobot-ai-config')
        let groupConfig = null
        
        if (savedConfig) {
          try {
            const config = JSON.parse(savedConfig)
            const sdk = config.find(s => s.id === selectedModel.sdkId)
            if (sdk) {
              groupConfig = sdk.groups?.find(g => g.id === selectedModel.groupId)
            }
          } catch (e) {
            console.error('获取组配置失败:', e)
          }
        }
        
        const currentModelInfo = {
          name: selectedModel.displayName,
          provider: selectedModel.provider,
          modelName: selectedModel.name,
          sdkId: selectedModel.sdkId,
          groupId: selectedModel.groupId,
          apiKey: groupConfig?.apiKey || '',
          baseUrl: groupConfig?.baseUrl || ''
        }
        localStorage.setItem('gsrobot-current-model', JSON.stringify(currentModelInfo))
      } else {
        localStorage.removeItem('gsrobot-current-model')
      }
    }

    // 保存设置
    const saveSettings = () => {
      localStorage.setItem('gsrobot-theme', selectedTheme.value)
      onModelChange() // 确保模型选择也被保存

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
      
      // 监听页面可见性变化，当从其他页面返回时重新加载数据
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          loadAvailableModels()
        }
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      // 组件卸载时移除监听器
      onUnmounted(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      })
    })

    return {
      selectedTheme,
      selectedModelId,
      availableModels,
      renderMode,
      changeTheme,
      changeRenderMode,
      saveSettings,
      goBackToHome,
      goToAIConfig,
      onModelChange
    }
  }
}
</script>