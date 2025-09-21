<template>
  <div class="flex flex-col h-full">
    <!-- 聊天消息区域 -->
    <div class="flex-1 overflow-y-auto p-4" ref="messagesContainer">
      <!-- 欢迎界面 -->
      <div v-if="!currentChat || messages.length === 0" class="flex items-center justify-center h-full">
        <div class="text-center max-w-md">
          <h2 class="text-2xl font-bold mb-2">{{ greeting }}，欢迎使用 GSRobot</h2>
        
        <!-- 输入建议按钮 -->
        <div class="flex flex-wrap justify-center gap-2 mt-6">
          <button 
            v-for="suggestion in inputSuggestions" 
            :key="suggestion.label"
            @click="fillInput(suggestion.prompt)"
            class="btn btn-sm btn-outline"
          >
            {{ suggestion.label }}
          </button>
        </div>
        <!-- 换一批按钮 -->
        <div class="flex justify-center mt-4">
          <button 
            @click="refreshSuggestions" 
            class="btn btn-sm btn-ghost flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            换一批
          </button>
        </div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div v-else class="space-y-4 max-w-4xl mx-auto">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="flex"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div 
            class="max-w-[80%] rounded-lg p-4 shadow-sm"
            :class="message.role === 'user' 
              ? 'bg-primary text-primary-content ml-12' 
              : 'bg-base-200 mr-12'"
          >
            <!-- 消息头部 -->
            <div class="flex items-center mb-2">
              <div class="flex items-center space-x-2">
                <div 
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  :class="message.role === 'user' 
                    ? 'bg-primary-content text-primary' 
                    : 'bg-primary text-primary-content'"
                >
                  {{ message.role === 'user' ? 'U' : 'AI' }}
                </div>
                <span class="text-xs opacity-70">
                  {{ message.role === 'user' ? '您' : 'GSRobot' }}
                </span>
                <span class="text-xs opacity-50">
                  {{ formatTime(message.timestamp) }}
                </span>
              </div>
            </div>
            
            <!-- 消息内容 -->
            <div class="prose prose-sm max-w-none">
              <!-- AI消息使用Markdown渲染 -->
              <MarkdownRenderer 
                v-if="message.role === 'assistant'" 
                :content="message.content"
                :renderMode="renderMode"
              />
              <!-- 用户消息保持原样 -->
              <p 
                v-else 
                class="whitespace-pre-wrap break-words mb-0"
              >
                {{ message.content }}
              </p>
            </div>
          </div>
        </div>

        <!-- 加载指示器 -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="bg-base-200 rounded-lg p-4 shadow-sm mr-12">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                AI
              </div>
              <span class="text-xs opacity-70">GSRobot</span>
              <span class="text-xs opacity-50">正在输入...</span>
            </div>
            <div class="flex space-x-1 mt-2">
              <div class="w-2 h-2 bg-base-content/30 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-base-content/30 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-base-content/30 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="border-t border-base-300 p-4">
      <div class="max-w-4xl mx-auto">
        <!-- 文件预览区域 -->
        <div v-if="selectedFiles.length > 0" class="mb-3">
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="(file, index) in selectedFiles" 
              :key="index"
              class="flex items-center bg-base-200 rounded-lg p-2 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span class="truncate max-w-32">{{ file.name }}</span>
              <button 
                @click="removeFile(index)"
                class="ml-2 text-error hover:text-error-focus"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <form @submit.prevent="sendMessage" class="flex items-end space-x-2">
          <div class="flex-1">
            <textarea
              v-model="inputMessage"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.enter.shift.exact="addNewLine"
              placeholder="输入您的消息... (Enter发送，Shift+Enter换行)"
              class="textarea textarea-bordered w-full resize-none overflow-hidden"
              style="min-height: 40px; line-height: 24px;"
              :disabled="isLoading"
              ref="messageInput"
            ></textarea>
          </div>
          
          <!-- 文件上传按钮 -->
          <div class="relative">
            <input
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              multiple
              accept="image/*,.pdf,.txt,.doc,.docx"
              class="hidden"
            />
            <button 
              type="button"
              @click="triggerFileSelect"
              class="btn btn-outline btn-square"
              style="height: 40px; min-height: 40px; width: 40px;"
              :disabled="isLoading"
              title="上传文件"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>

          <button 
            type="submit"
            class="btn btn-primary self-end"
            style="height: 40px; min-height: 40px;"
            :disabled="(!inputMessage.trim() && selectedFiles.length === 0) || isLoading"
          >
            <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span v-else class="loading loading-spinner loading-sm"></span>
          </button>
        </form>
        
        <!-- 输入提示 -->
        <div class="text-xs text-base-content/50 mt-2 text-center">
          GSRobot 生成的内容仅供参考
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, watch, onMounted, computed } from 'vue'
import MarkdownRenderer from './MarkdownRenderer.vue'

export default {
  name: 'ChatArea',
  components: {
    MarkdownRenderer
  },
  props: {
    currentChat: {
      type: Object,
      default: null
    },
    messages: {
      type: Array,
      default: () => []
    }
  },
  emits: ['sendMessage'],
  setup(props, { emit }) {
    const inputMessage = ref('')
    const isLoading = ref(false)
    const messagesContainer = ref(null)
    const messageInput = ref(null)
    const fileInput = ref(null)
    const selectedFiles = ref([])
    const renderMode = ref('normal')

    // 获取问候语
    const greeting = computed(() => {
      const hour = new Date().getHours()
      if (hour < 6) {
        return '凌晨好'
      } else if (hour < 9) {
        return '早上好'
      } else if (hour < 12) {
        return '上午好'
      } else if (hour < 14) {
        return '中午好'
      } else if (hour < 18) {
        return '下午好'
      } else if (hour < 22) {
        return '晚上好'
      } else {
        return '夜深了'
      }
    })

    // 输入建议
    const allInputSuggestions = [
      { label: '写作', prompt: '请帮我写一篇关于以下主题的文章：' },
      { label: '翻译', prompt: '请将以下内容翻译成中文：' },
      { label: '编程', prompt: '请用 Python 编写一个函数来实现以下功能：' },
      { label: '代码解释', prompt: '请解释以下代码的作用：' },
      { label: '学习', prompt: '请详细解释以下概念：' },
      { label: '创意', prompt: '请给我一些关于以下主题的创意点子：' },
      { label: '总结', prompt: '请总结以下内容的要点：' },
      { label: '润色', prompt: '请优化以下文本，使其更流畅自然：' },
      { label: '分析', prompt: '请深入分析以下内容：' },
      { label: '计划', prompt: '请为我制定一个详细的计划：' },
      { label: '邮件', prompt: '请帮我写一封专业的邮件，主题是：' },
      { label: '故事', prompt: '请讲一个关于以下主题的故事：' },
      { label: '诗歌', prompt: '请写一首关于以下主题的诗歌：' },
      { label: '演讲', prompt: '请为我准备一篇演讲稿，主题是：' },  
      { label: '简历', prompt: '请帮我优化简历中的以下部分：' },
      { label: '营销', prompt: '请为我们的产品制定一个营销策略：' },
      { label: '报告', prompt: '请帮我撰写一份关于以下主题的报告：' },
      { label: '调研', prompt: '请帮我进行以下主题的调研并总结：' },
      { label: '面试', prompt: '请帮我准备面试中可能会遇到的问题：' },
      { label: '对比', prompt: '请对以下两个事物进行比较并分析优缺点：' }
    ]

    // 随机选择5个建议
    const inputSuggestions = ref([])
    
    // 初始化建议
    const initializeSuggestions = () => {
      // 创建一个副本以避免修改原数组
      const shuffled = [...allInputSuggestions].sort(() => 0.5 - Math.random())
      // 返回前5个元素
      inputSuggestions.value = shuffled.slice(0, 5)
    }
    
    // 刷新建议
    const refreshSuggestions = () => {
      initializeSuggestions()
    }
    
    // 组件挂载时初始化建议
    onMounted(() => {
      initializeSuggestions()
    })

    // 填充输入框
    const fillInput = (prompt) => {
      inputMessage.value = prompt
      // 聚焦到输入框
      nextTick(() => {
        messageInput.value?.focus()
        // 将光标移到末尾
        if (messageInput.value) {
          messageInput.value.selectionStart = prompt.length
          messageInput.value.selectionEnd = prompt.length
        }
      })
    }

    // 加载渲染模式设置
    const loadRenderMode = () => {
      const savedRenderMode = localStorage.getItem('gsrobot-render-mode') || 'normal'
      renderMode.value = savedRenderMode
    }

    // 发送消息
    const sendMessage = async () => {
      if ((!inputMessage.value.trim() && selectedFiles.value.length === 0) || isLoading.value) return

      const message = inputMessage.value.trim()
      const files = [...selectedFiles.value]
      
      inputMessage.value = ''
      selectedFiles.value = []
      isLoading.value = true

      try {
        await emit('sendMessage', message, files)
      } finally {
        isLoading.value = false
        // 聚焦输入框
        nextTick(() => {
          messageInput.value?.focus()
        })
      }
    }

    // 触发文件选择
    const triggerFileSelect = () => {
      fileInput.value?.click()
    }

    // 处理文件选择
    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files)
      if (files.length > 0) {
        // 限制文件大小（10MB）
        const maxSize = 10 * 1024 * 1024
        const validFiles = files.filter(file => {
          if (file.size > maxSize) {
            alert(`文件 ${file.name} 超过10MB限制`)
            return false
          }
          return true
        })
        
        selectedFiles.value.push(...validFiles)
      }
      // 清空input值，允许重复选择同一文件
      event.target.value = ''
    }

    // 移除文件
    const removeFile = (index) => {
      selectedFiles.value.splice(index, 1)
    }

    // 添加换行
    const addNewLine = () => {
      inputMessage.value += '\n'
      nextTick(() => {
        adjustTextareaHeight()
      })
    }

    // 调整textarea高度
    const adjustTextareaHeight = () => {
      const textarea = messageInput.value
      if (!textarea) return

      // 重置高度以获取正确的scrollHeight
      textarea.style.height = 'auto'
      
      // 计算新高度，最小高度为一行，最大高度为6行
      const lineHeight = 24 // 大约一行的高度
      const minHeight = lineHeight + 16 // 加上padding
      const maxHeight = lineHeight * 6 + 16 // 最多6行
      
      let newHeight = Math.max(minHeight, textarea.scrollHeight)
      newHeight = Math.min(newHeight, maxHeight)
      
      textarea.style.height = newHeight + 'px'
    }

    // 格式化时间
    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffMinutes = Math.ceil(diffTime / (1000 * 60))

      if (diffMinutes < 1) {
        return '刚刚'
      } else if (diffMinutes < 60) {
        return `${diffMinutes}分钟前`
      } else if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60)
        return `${hours}小时前`
      } else {
        return date.toLocaleString('zh-CN', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    }

    // 滚动到底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }

    // 监听消息变化，自动滚动到底部
    watch(() => props.messages, () => {
      scrollToBottom()
    }, { deep: true })

    // 监听加载状态变化
    watch(isLoading, () => {
      scrollToBottom()
    })

    // 监听输入内容变化，调整textarea高度
    watch(inputMessage, () => {
      nextTick(() => {
        adjustTextareaHeight()
      })
    })

    // 监听localStorage变化，实时更新渲染模式
    const handleStorageChange = (e) => {
      if (e.key === 'gsrobot-render-mode') {
        renderMode.value = e.newValue || 'normal'
      }
    }

    // 组件挂载时初始化textarea高度和加载渲染模式
    onMounted(() => {
      nextTick(() => {
        adjustTextareaHeight()
      })
      loadRenderMode()
      
      // 监听localStorage变化
      window.addEventListener('storage', handleStorageChange)
      
      // 监听页面可见性变化，当从设置页面返回时重新加载渲染模式
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          loadRenderMode()
        }
      }
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      // 组件卸载时移除监听器
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    })

    return {
      inputMessage,
      isLoading,
      messagesContainer,
      messageInput,
      fileInput,
      selectedFiles,
      renderMode,
      greeting,
      inputSuggestions,
      fillInput,
      refreshSuggestions,
      sendMessage,
      addNewLine,
      formatTime,
      triggerFileSelect,
      handleFileSelect,
      removeFile
    }
  }
}
</script>