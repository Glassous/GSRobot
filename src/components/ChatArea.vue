<template>
  <div class="flex flex-col h-full">
    <!-- 聊天消息区域 -->
    <div class="flex-1 overflow-y-auto p-4" ref="messagesContainer">
      <!-- 欢迎界面 -->
      <div v-if="!currentChat || messages.length === 0" class="flex items-center justify-center h-full">
        <div class="text-center max-w-md">
          <div class="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-primary opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.697-.413l-3.178 1.589a1 1 0 01-1.414-1.414l1.589-3.178A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-2">欢迎使用 GSRobot</h2>
          <p class="text-base-content/60 mb-6">
            我是您的AI助手，可以帮助您解答问题、提供建议或进行对话。
          </p>

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
              <p class="whitespace-pre-wrap break-words mb-0">{{ message.content }}</p>
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
          <button 
            type="submit"
            class="btn btn-primary self-end"
            style="height: 40px; min-height: 40px;"
            :disabled="!inputMessage.trim() || isLoading"
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
import { ref, nextTick, watch, onMounted } from 'vue'

export default {
  name: 'ChatArea',
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

    // 发送消息
    const sendMessage = async () => {
      if (!inputMessage.value.trim() || isLoading.value) return

      const message = inputMessage.value.trim()
      inputMessage.value = ''
      isLoading.value = true

      try {
        await emit('sendMessage', message)
      } finally {
        isLoading.value = false
        // 聚焦输入框
        nextTick(() => {
          messageInput.value?.focus()
        })
      }
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

    // 组件挂载时初始化textarea高度
    onMounted(() => {
      nextTick(() => {
        adjustTextareaHeight()
      })
    })

    return {
      inputMessage,
      isLoading,
      messagesContainer,
      messageInput,
      sendMessage,
      addNewLine,
      formatTime
    }
  }
}
</script>