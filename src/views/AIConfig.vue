<template>
  <div class="min-h-screen bg-base-100">
    <!-- 顶部导航栏 -->
    <div class="navbar bg-base-200 shadow-sm border-b border-base-300 fixed top-0 left-0 right-0 z-40">
      <!-- 左侧返回按钮 -->
      <div class="navbar-start">
        <button @click="goBack" class="btn btn-ghost btn-circle" aria-label="Back">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <!-- 中间标题 -->
      <div class="navbar-center">
        <h1 class="text-xl font-bold">AI模型配置</h1>
      </div>
      
      <!-- 右侧按钮组 -->
      <div class="navbar-end">
        <div class="flex gap-2">
          <!-- 清除所有模型按钮 -->
          <button @click="clearAllModels" class="btn btn-error btn-sm">
            清除所有
          </button>
          <!-- 导入按钮 -->
          <button @click="importConfig" class="btn btn-outline btn-sm">
            导入
          </button>
          <!-- 导出按钮 -->
          <button @click="exportConfig" class="btn btn-outline btn-sm">
            导出
          </button>
          <!-- 保存按钮 -->
          <button @click="saveConfig" class="btn btn-primary btn-sm">
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 配置内容 -->
    <div class="container mx-auto p-6 max-w-4xl pt-20">
      <!-- SDK分组 -->
      <div class="space-y-6">
        <div v-for="sdk in sdkGroups" :key="sdk.id" class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <!-- SDK标题 -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="avatar placeholder mr-3">
                  <div class="bg-primary text-primary-content rounded-full w-10">
                    <span class="text-sm font-bold">{{ sdk.name.charAt(0) }}</span>
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-bold">{{ sdk.name }}</h2>
                  <p class="text-sm text-base-content/70">{{ sdk.description }}</p>
                </div>
              </div>
              <button 
                @click="toggleSDK(sdk.id)"
                class="btn btn-ghost btn-sm"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform"
                  :class="{ 'rotate-180': sdk.expanded }"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <!-- SDK内容 -->
            <div v-show="sdk.expanded" class="space-y-4">
              <!-- 自定义组列表 -->
              <div v-for="group in sdk.groups" :key="group.id" class="border border-base-300 rounded-lg p-4 bg-base-100">
                <!-- 组标题和操作 -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <input 
                      v-model="group.name"
                      type="text" 
                      placeholder="组名称"
                      class="input input-sm input-bordered mr-3 w-32"
                    />
                    <span class="text-sm text-base-content/70">{{ group.models.length }} 个模型</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="toggleGroup(sdk.id, group.id)"
                      class="btn btn-ghost btn-xs"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-3 w-3 transition-transform"
                        :class="{ 'rotate-180': group.expanded }"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button 
                      @click="deleteGroup(sdk.id, group.id)"
                      class="btn btn-ghost btn-xs text-error"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- 组配置 -->
                <div v-show="group.expanded" class="space-y-3">
                  <!-- API Key -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-sm">API Key</span>
                    </label>
                    <input 
                      v-model="group.apiKey"
                      type="password" 
                      placeholder="请输入API Key"
                      class="input input-sm input-bordered"
                    />
                  </div>

                  <!-- Base URL (Google AI SDK和Anthropic SDK不支持自定义baseURL，因此隐藏此字段) -->
                  <div v-if="sdk.id !== 'google' && sdk.id !== 'anthropic'" class="form-control">
                    <label class="label">
                      <span class="label-text text-sm">Base URL</span>
                    </label>
                    <input 
                      v-model="group.baseUrl"
                      type="url" 
                      placeholder="请输入Base URL"
                      class="input input-sm input-bordered"
                    />
                  </div>

                  <!-- 模型列表 -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-sm">模型列表</span>
                      <button 
                        @click="addModel(sdk.id, group.id)"
                        class="btn btn-xs btn-primary"
                      >
                        添加模型
                      </button>
                    </label>
                    <div class="space-y-2">
                      <div 
                        v-for="model in group.models" 
                        :key="model.id"
                        class="border border-base-300 rounded p-3 bg-base-50"
                      >
                        <div class="space-y-2">
                          <!-- 模型配置行：选择、模型名称、显示名称、删除 -->
                          <div class="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              :name="`selected-model`"
                              :value="model.id"
                              v-model="selectedModelId"
                              class="radio radio-primary radio-sm"
                            />
                            <input 
                              v-model="model.name"
                              type="text" 
                              placeholder="模型名称"
                              class="input input-xs input-bordered flex-1"
                            />
                            <input 
                              v-model="model.displayName"
                              type="text" 
                              placeholder="显示名称"
                              class="input input-xs input-bordered flex-1"
                            />
                            <button 
                              @click="deleteModel(sdk.id, group.id, model.id)"
                              class="btn btn-ghost btn-xs text-error"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 添加组按钮 -->
              <button 
                @click="addGroup(sdk.id)"
                class="btn btn-outline btn-sm w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                添加配置组
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input 
      ref="fileInput" 
      type="file" 
      accept=".json" 
      @change="handleFileSelect" 
      style="display: none"
    />

    <!-- 导入确认对话框 -->
    <div v-if="showImportDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">确认导入配置</h3>
        <p class="text-base-content/70 mb-6">
          导入将覆盖当前所有配置（不包含API Key），此操作不可撤销。确定要继续吗？
        </p>
        <div class="flex gap-3 justify-end">
          <button @click="cancelImport" class="btn btn-ghost">
            取消
          </button>
          <button @click="confirmImport" class="btn btn-primary">
            确认导入
          </button>
        </div>
      </div>
    </div>

    <!-- 清除所有模型确认对话框 -->
    <div v-if="showClearDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4 text-error">⚠️ 危险操作</h3>
        <p class="text-base-content/70 mb-4">
          您即将清除所有AI模型配置，包括：
        </p>
        <ul class="list-disc list-inside text-base-content/70 mb-6 space-y-1">
          <li>所有SDK分组中的模型</li>
          <li>所有API Key</li>
          <li>所有Base URL配置</li>
          <li>当前选中的模型</li>
        </ul>
        <p class="text-error font-medium mb-6">
          此操作不可撤销！请确认您真的要执行此操作。
        </p>
        <div class="flex gap-3 justify-end">
          <button @click="cancelClear" class="btn btn-ghost">
            取消
          </button>
          <button @click="confirmClear" class="btn btn-error">
            确认清除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AIConfig',
  setup() {
    const router = useRouter()
    const selectedModelId = ref('')
    
    // 导入导出相关
    const showImportDialog = ref(false)
    const fileInput = ref(null)
    let pendingImportData = null
    
    // 清除所有模型相关
    const showClearDialog = ref(false)
    
    // SDK分组数据
    const sdkGroups = ref([
      {
        id: 'openai',
        name: 'OpenAI',
        description: '基于OpenAI SDK的模型配置',
        expanded: true,
        groups: []
      },
      {
        id: 'google',
        name: 'Google AI',
        description: '基于Google AI SDK的模型配置，支持Gemini系列模型',
        expanded: false,
        groups: []
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        description: '基于Anthropic SDK的模型配置',
        expanded: false,
        groups: []
      }
    ])

    // 生成唯一ID
    const generateId = () => {
      return Date.now().toString(36) + Math.random().toString(36).substr(2)
    }

    // 切换SDK展开状态
    const toggleSDK = (sdkId) => {
      const sdk = sdkGroups.value.find(s => s.id === sdkId)
      if (sdk) {
        sdk.expanded = !sdk.expanded
      }
    }

    // 切换组展开状态
    const toggleGroup = (sdkId, groupId) => {
      const sdk = sdkGroups.value.find(s => s.id === sdkId)
      if (sdk) {
        const group = sdk.groups.find(g => g.id === groupId)
        if (group) {
          group.expanded = !group.expanded
        }
      }
    }

    // 添加组
    const addGroup = (sdkId) => {
      const sdk = sdkGroups.value.find(s => s.id === sdkId)
      if (sdk) {
        const newGroup = {
          id: generateId(),
          name: '',
          apiKey: '',
          expanded: true,
          models: []
        }
        
        // 根据SDK类型设置默认基础URL（Google AI SDK和Anthropic SDK不支持自定义baseURL）
        if (sdkId !== 'google' && sdkId !== 'anthropic') {
          newGroup.baseUrl = ''
        }
        sdk.groups.push(newGroup)
      }
    }

    // 删除组
    const deleteGroup = (sdkId, groupId) => {
      const sdk = sdkGroups.value.find(s => s.id === sdkId)
      if (sdk) {
        sdk.groups = sdk.groups.filter(g => g.id !== groupId)
      }
    }

    // 添加模型
    const addModel = (sdkId, groupId) => {
      const sdk = sdkGroups.value.find(s => s.id === sdkId)
      if (sdk) {
        const group = sdk.groups.find(g => g.id === groupId)
        if (group) {
          const newModel = {
            id: generateId(),
            name: '',
            displayName: ''
          }
          
          group.models.push(newModel)
        }
      }
    }

    // 删除模型
    const deleteModel = (sdkId, groupId, modelId) => {
      const sdk = sdkGroups.value.find(s => s.id === sdkId)
      if (sdk) {
        const group = sdk.groups.find(g => g.id === groupId)
        if (group) {
          group.models = group.models.filter(m => m.id !== modelId)
          // 如果删除的是当前选中的模型，清空选择
          if (selectedModelId.value === modelId) {
            selectedModelId.value = ''
          }
        }
      }
    }

    // 返回上一页
    const goBack = () => {
      router.push('/settings')
    }

    // 保存配置
    const saveConfig = () => {
      localStorage.setItem('gsrobot-ai-config', JSON.stringify(sdkGroups.value))
      
      // 检查当前选中的模型是否还存在，如果不存在则清除选择
      const currentSelectedModel = localStorage.getItem('gsrobot-selected-model')
      if (currentSelectedModel) {
        let modelExists = false
        sdkGroups.value.forEach(sdk => {
          sdk.groups?.forEach(group => {
            group.models?.forEach(model => {
              if (model.id === currentSelectedModel) {
                modelExists = true
              }
            })
          })
        })
        
        if (!modelExists) {
          localStorage.removeItem('gsrobot-selected-model')
          localStorage.removeItem('gsrobot-current-model')
        }
      }
      
      // 显示保存成功提示
      const toast = document.createElement('div')
      toast.className = 'toast toast-top toast-center'
      toast.innerHTML = `
        <div class="alert alert-success">
          <span>配置已保存</span>
        </div>
      `
      document.body.appendChild(toast)
      
      setTimeout(() => {
        if (toast && toast.parentNode) {
          document.body.removeChild(toast)
        }
      }, 2000)
    }

    // 导出配置
    const exportConfig = () => {
      try {
        // 创建导出数据，排除API Key
        const exportData = {
          version: '1.0',
          timestamp: new Date().toISOString(),
          config: sdkGroups.value.map(sdk => ({
            ...sdk,
            groups: sdk.groups.map(group => {
              const { apiKey, ...groupWithoutKey } = group
              return groupWithoutKey
            })
          }))
        }

        // 创建下载链接
        const dataStr = JSON.stringify(exportData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `gsrobot-config-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        // 显示导出成功提示
        const toast = document.createElement('div')
        toast.className = 'toast toast-top toast-center'
        toast.innerHTML = `
          <div class="alert alert-success">
            <span>配置已导出</span>
          </div>
        `
        document.body.appendChild(toast)
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 2000)
      } catch (error) {
        console.error('导出配置失败:', error)
        // 显示错误提示
        const toast = document.createElement('div')
        toast.className = 'toast toast-top toast-center'
        toast.innerHTML = `
          <div class="alert alert-error">
            <span>导出失败</span>
          </div>
        `
        document.body.appendChild(toast)
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 2000)
      }
    }

    // 导入配置
    const importConfig = () => {
      fileInput.value?.click()
    }

    // 处理文件选择
    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result)
          
          // 验证导入数据格式
          if (!importData.config || !Array.isArray(importData.config)) {
            throw new Error('无效的配置文件格式')
          }

          pendingImportData = importData.config
          showImportDialog.value = true
        } catch (error) {
          console.error('读取配置文件失败:', error)
          // 显示错误提示
          const toast = document.createElement('div')
          toast.className = 'toast toast-top toast-center'
          toast.innerHTML = `
            <div class="alert alert-error">
              <span>配置文件格式错误</span>
            </div>
          `
          document.body.appendChild(toast)
          setTimeout(() => {
            document.body.removeChild(toast)
          }, 2000)
        }
      }
      reader.readAsText(file)
      
      // 清空文件输入
      event.target.value = ''
    }

    // 确认导入
    const confirmImport = () => {
      if (pendingImportData) {
        try {
          // 合并导入的配置，保留现有的API Key
          pendingImportData.forEach(importedSdk => {
            const existingSdk = sdkGroups.value.find(s => s.id === importedSdk.id)
            if (existingSdk) {
              // 保存现有的API Key
              const existingApiKeys = new Map()
              existingSdk.groups?.forEach(group => {
                if (group.apiKey) {
                  existingApiKeys.set(group.id, group.apiKey)
                }
              })

              // 更新配置
              existingSdk.groups = importedSdk.groups || []
              existingSdk.expanded = importedSdk.expanded !== undefined ? importedSdk.expanded : existingSdk.expanded

              // 恢复API Key
              existingSdk.groups.forEach(group => {
                const savedKey = existingApiKeys.get(group.id)
                if (savedKey) {
                  group.apiKey = savedKey
                }
              })
            }
          })

          showImportDialog.value = false
          pendingImportData = null

          // 显示导入成功提示
          const toast = document.createElement('div')
          toast.className = 'toast toast-top toast-center'
          toast.innerHTML = `
            <div class="alert alert-success">
              <span>配置已导入</span>
            </div>
          `
          document.body.appendChild(toast)
          setTimeout(() => {
            document.body.removeChild(toast)
          }, 2000)
        } catch (error) {
          console.error('导入配置失败:', error)
          // 显示错误提示
          const toast = document.createElement('div')
          toast.className = 'toast toast-top toast-center'
          toast.innerHTML = `
            <div class="alert alert-error">
              <span>导入失败</span>
            </div>
          `
          document.body.appendChild(toast)
          setTimeout(() => {
            document.body.removeChild(toast)
          }, 2000)
        }
      }
    }

    // 取消导入
    const cancelImport = () => {
      showImportDialog.value = false
      pendingImportData = null
    }

    // 清除所有模型
    const clearAllModels = () => {
      showClearDialog.value = true
    }

    // 确认清除
    const confirmClear = () => {
      try {
        // 重置所有SDK分组为初始状态
        sdkGroups.value.forEach(sdk => {
          sdk.groups = []
          sdk.expanded = false
        })

        // 清除选中的模型
        selectedModelId.value = ''
        localStorage.removeItem('gsrobot-selected-model')
        localStorage.removeItem('gsrobot-current-model')

        // 保存清空的配置
        localStorage.setItem('gsrobot-ai-config', JSON.stringify(sdkGroups.value))

        showClearDialog.value = false

        // 显示清除成功提示
        const toast = document.createElement('div')
        toast.className = 'toast toast-top toast-center'
        toast.innerHTML = `
          <div class="alert alert-success">
            <span>所有模型配置已清除</span>
          </div>
        `
        document.body.appendChild(toast)
        setTimeout(() => {
          if (toast && toast.parentNode) {
            document.body.removeChild(toast)
          }
        }, 2000)
      } catch (error) {
        console.error('清除配置失败:', error)
        // 显示错误提示
        const toast = document.createElement('div')
        toast.className = 'toast toast-top toast-center'
        toast.innerHTML = `
          <div class="alert alert-error">
            <span>清除失败</span>
          </div>
        `
        document.body.appendChild(toast)
        setTimeout(() => {
          if (toast && toast.parentNode) {
            document.body.removeChild(toast)
          }
        }, 2000)
      }
    }

    // 取消清除
    const cancelClear = () => {
      showClearDialog.value = false
    }

    // 加载配置
    const loadConfig = () => {
      const savedConfig = localStorage.getItem('gsrobot-ai-config')
      const savedSelectedModel = localStorage.getItem('gsrobot-selected-model')
      
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig)
          // 合并保存的配置和默认配置
          config.forEach(savedSdk => {
            const sdk = sdkGroups.value.find(s => s.id === savedSdk.id)
            if (sdk) {
              sdk.groups = savedSdk.groups || []
              sdk.expanded = savedSdk.expanded !== undefined ? savedSdk.expanded : sdk.expanded
            }
          })
        } catch (e) {
          console.error('加载配置失败:', e)
        }
      }
      
      if (savedSelectedModel) {
        selectedModelId.value = savedSelectedModel
      }
    }

    onMounted(() => {
      loadConfig()
    })

    return {
      sdkGroups,
      selectedModelId,
      showImportDialog,
      showClearDialog,
      fileInput,
      toggleSDK,
      toggleGroup,
      addGroup,
      deleteGroup,
      addModel,
      deleteModel,
      goBack,
      saveConfig,
      exportConfig,
      importConfig,
      handleFileSelect,
      confirmImport,
      cancelImport,
      clearAllModels,
      confirmClear,
      cancelClear
    }
  }
}
</script>