<template>
  <div class="min-h-screen bg-base-100">
    <!-- 顶部导航栏 -->
    <div class="navbar bg-base-200 shadow-sm border-b border-base-300">
      <!-- 左侧汉堡菜单 -->
      <div class="navbar-start">
        <button 
          @click="toggleSidebar" 
          class="btn btn-ghost btn-circle"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
      </div>
      
      <!-- 中间标题和模型显示 -->
      <div class="navbar-center">
        <div class="flex flex-col items-center">
          <h1 class="text-xl font-bold">GSRobot</h1>
          <div v-if="currentModelInfo" class="text-xs text-base-content/60 flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{{ currentModelInfo.name }}</span>
          </div>
          <div v-else class="text-xs text-base-content/40">
            未选择模型
          </div>
        </div>
      </div>
      
      <!-- 右侧设置按钮 -->
      <div class="navbar-end">
        <router-link to="/settings" class="btn btn-ghost btn-circle" aria-label="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex h-[calc(100vh-4rem)]">
      <!-- 侧边栏 -->
      <div 
        :class="[
          'transition-all duration-300 ease-in-out bg-base-200 border-r border-base-300',
          // 桌面端：压缩主内容区域
          'lg:flex lg:flex-col',
          sidebarOpen ? 'lg:w-80' : 'lg:w-0 lg:overflow-hidden',
          // 移动端：覆盖半屏
          sidebarOpen ? 'fixed inset-y-16 left-0 z-50 w-80 flex flex-col lg:relative lg:inset-auto' : 'hidden'
        ]"
      >
        <Sidebar 
          :isOpen="sidebarOpen" 
          @close="closeSidebar"
          @newChat="handleNewChat"
          @selectChat="handleSelectChat"
          :saveChats="saveChatsToStorage"
        />
      </div>

      <!-- 移动端遮罩层 -->
      <div 
        v-if="sidebarOpen" 
        @click="closeSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      ></div>

      <!-- 主内容区域 -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <ChatArea 
          :currentChat="currentChat"
          :messages="currentMessages"
          @sendMessage="handleSendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, provide, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import ChatArea from '../components/ChatArea.vue'

export default {
  name: 'Home',
  components: {
    Sidebar,
    ChatArea
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const sidebarOpen = ref(false)
    const currentChatId = ref(null)
    const chats = ref([])
    const messages = ref({})
    const currentModelInfo = ref(null)

    // 从LocalStorage加载聊天记录
    const loadChatsFromStorage = () => {
      try {
        const savedChats = localStorage.getItem('gsrobot-chats')
        const savedMessages = localStorage.getItem('gsrobot-messages')
        const savedCurrentChatId = localStorage.getItem('gsrobot-current-chat-id')

        if (savedChats) {
          const parsedChats = JSON.parse(savedChats)
          // 恢复日期对象
          parsedChats.forEach(chat => {
            chat.createdAt = new Date(chat.createdAt)
          })
          chats.value = parsedChats
        }

        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages)
          // 恢复消息中的日期对象
          Object.keys(parsedMessages).forEach(chatId => {
            parsedMessages[chatId].forEach(message => {
              message.timestamp = new Date(message.timestamp)
            })
          })
          messages.value = parsedMessages
        }

        if (savedCurrentChatId && chats.value.find(chat => chat.id === savedCurrentChatId)) {
          currentChatId.value = savedCurrentChatId
        }
      } catch (error) {
        console.error('加载聊天记录失败:', error)
      }
    }

    // 保存聊天记录到LocalStorage
    const saveChatsToStorage = () => {
      try {
        localStorage.setItem('gsrobot-chats', JSON.stringify(chats.value))
        localStorage.setItem('gsrobot-messages', JSON.stringify(messages.value))
        localStorage.setItem('gsrobot-current-chat-id', currentChatId.value || '')
      } catch (error) {
        console.error('保存聊天记录失败:', error)
      }
    }

    // 切换侧边栏
    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    // 关闭侧边栏
    const closeSidebar = () => {
      sidebarOpen.value = false
    }

    // 创建新聊天
    const handleNewChat = () => {
      const newChatId = Date.now().toString()
      const newChat = {
        id: newChatId,
        title: '新对话',
        createdAt: new Date(),
        lastMessage: null
      }
      chats.value.unshift(newChat)
      currentChatId.value = newChatId
      messages.value[newChatId] = []
      saveChatsToStorage()
      closeSidebar()
    }

    // 选择聊天
    const handleSelectChat = (chatId) => {
      currentChatId.value = chatId
      saveChatsToStorage()
      closeSidebar()
    }

    // 获取当前选中的模型信息
    const getCurrentModel = () => {
      const savedModelConfig = localStorage.getItem('gsrobot-current-model')
      if (savedModelConfig) {
        try {
          return JSON.parse(savedModelConfig)
        } catch (e) {
          return null
        }
      }
      return null
    }

    // 加载当前模型信息
    const loadCurrentModelInfo = () => {
      currentModelInfo.value = getCurrentModel()
    }

    // 监听localStorage变化，实时更新模型信息
    const handleStorageChange = (e) => {
      if (e.key === 'gsrobot-current-model') {
        loadCurrentModelInfo()
      }
    }

    // 发送消息
    const handleSendMessage = async (content) => {
      if (!currentChatId.value) {
        handleNewChat()
      }

      const userMessage = {
        id: Date.now().toString(),
        content,
        role: 'user',
        timestamp: new Date()
      }

      if (!messages.value[currentChatId.value]) {
        messages.value[currentChatId.value] = []
      }

      messages.value[currentChatId.value].push(userMessage)

      // 更新聊天标题（如果是第一条消息）
      const chat = chats.value.find(c => c.id === currentChatId.value)
      if (chat && messages.value[currentChatId.value].length === 1) {
        chat.title = content.slice(0, 30) + (content.length > 30 ? '...' : '')
      }
      if (chat) {
        chat.lastMessage = content
      }

      // 保存用户消息
      saveChatsToStorage()

      // 获取当前模型信息
      const currentModel = getCurrentModel()
      const modelName = currentModel ? currentModel.name : 'GSRobot'
      const modelProvider = currentModel ? currentModel.provider : '默认模型'

      // 模拟AI回复
      setTimeout(() => {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: `我是${modelName}（${modelProvider}），这是对"${content}"的回复。作为AI助手，我很高兴为您提供帮助。`,
          role: 'assistant',
          timestamp: new Date()
        }
        messages.value[currentChatId.value].push(aiMessage)
        // 保存AI回复
        saveChatsToStorage()
      }, 1000)
    }

    // 当前聊天
    const currentChat = computed(() => {
      return chats.value.find(chat => chat.id === currentChatId.value)
    })

    // 当前消息
    const currentMessages = computed(() => {
      return currentChatId.value ? messages.value[currentChatId.value] || [] : []
    })

    // 组件挂载时加载数据
    onMounted(() => {
      loadChatsFromStorage()
      loadCurrentModelInfo()
      
      // 添加localStorage监听
      window.addEventListener('storage', handleStorageChange)
      
      // 检查是否来自设置页面
      const fromSettings = sessionStorage.getItem('gsrobot-from-settings')
      
      if (fromSettings === 'true') {
        // 来自设置页面，保持当前对话，清除标记
        sessionStorage.removeItem('gsrobot-from-settings')
      } else {
        // 刷新或直接进入，创建新对话
        handleNewChat()
      }
    })

    // 组件卸载时移除监听器
    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange)
    })

    // 提供数据给子组件
    provide('chats', chats)
    provide('messages', messages)
    provide('currentChatId', currentChatId)

    return {
      sidebarOpen,
      currentChat,
      currentMessages,
      currentModelInfo,
      toggleSidebar,
      closeSidebar,
      handleNewChat,
      handleSelectChat,
      handleSendMessage
    }
  }
}
</script>