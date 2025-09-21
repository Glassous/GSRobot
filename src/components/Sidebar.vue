<template>
  <div class="flex flex-col h-full">
    <!-- 侧边栏头部 -->
    <div class="p-4 border-b border-base-300">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">聊天记录</h2>
        <button 
          @click="$emit('close')"
          class="btn btn-ghost btn-sm btn-circle lg:hidden"
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- 新建聊天按钮 -->
      <button 
        @click="$emit('newChat')"
        class="btn btn-primary w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新建对话
      </button>
    </div>

    <!-- 聊天列表 -->
    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="filteredChats.length === 0" class="text-center text-base-content/50 mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.697-.413l-3.178 1.589a1 1 0 01-1.414-1.414l1.589-3.178A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
        </svg>
        <p>暂无聊天记录</p>
        <p class="text-sm">点击上方按钮开始新对话</p>
      </div>

      <div v-else class="space-y-2">
        <div 
          v-for="chat in filteredChats" 
          :key="chat.id"
          @click="selectChatHandler(chat.id)"
          class="group relative p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 border-base-300 hover:border-primary/30 hover:bg-base-300/50"
          :class="{ 'bg-primary/10 border-primary/50 shadow-sm': chat.id === currentChatId }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <!-- 标题显示模式 -->
              <h3 class="font-medium text-sm truncate mb-1">
                {{ chat.title || '新对话' }}
              </h3>
              
              <p class="text-xs text-base-content/40 mt-1">
                {{ formatDate(chat.createdAt) }}
              </p>
            </div>
            
            <!-- 操作按钮组 - 常驻显示 -->
            <div class="flex items-center gap-1 ml-2">
              <!-- 重命名按钮 -->
              <button 
                @click.stop="openRenameModal(chat.id, chat.title)"
                class="btn btn-ghost btn-xs btn-circle"
                aria-label="Rename chat"
                title="重命名"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <!-- 删除按钮 -->
              <button 
                @click.stop="confirmDelete(chat.id)"
                class="btn btn-ghost btn-xs btn-circle text-error hover:bg-error/10"
                aria-label="Delete chat"
                title="删除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 重命名弹窗 -->
      <div v-if="showRenameModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" @click="cancelRename">
        <div class="bg-base-100 rounded-lg p-6 max-w-sm mx-4 shadow-xl" @click.stop>
          <h3 class="text-lg font-semibold mb-4">重命名对话</h3>
          <input 
            ref="renameInput"
            v-model="renameTitle"
            @keyup.enter="executeRename"
            @keyup.escape="cancelRename"
            class="input input-bordered w-full mb-6"
            placeholder="输入新的对话标题"
          />
          <div class="flex justify-end gap-3">
            <button @click="cancelRename" class="btn btn-ghost">取消</button>
            <button @click="executeRename" class="btn btn-primary">确定</button>
          </div>
        </div>
      </div>
      
      <!-- 删除确认弹窗 -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" @click="cancelDelete">
        <div class="bg-base-100 rounded-lg p-6 max-w-sm mx-4 shadow-xl" @click.stop>
          <h3 class="text-lg font-semibold mb-4">确认删除</h3>
          <p class="text-base-content/70 mb-6">确定要删除这个对话吗？此操作无法撤销。</p>
          <div class="flex justify-end gap-3">
            <button @click="cancelDelete" class="btn btn-ghost">取消</button>
            <button @click="executeDelete" class="btn btn-error">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 侧边栏底部 -->
    <div class="p-4 border-t border-base-300">
      <div class="flex items-center justify-between text-xs text-base-content/50">
        <span>共 {{ filteredChats.length }} 个对话</span>
        <button 
          @click="clearEmptyChats"
          class="btn btn-ghost btn-xs"
          :disabled="emptyChatsCount === 0"
        >
          清理空对话 ({{ emptyChatsCount }})
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import backButtonService from '../services/backButtonService.js'

export default {
  name: 'Sidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    saveChats: {
      type: Function,
      default: () => {}
    }
  },
  emits: ['close', 'newChat', 'selectChat'],
  setup(props, { emit }) {
    // 注入聊天数据（这里使用模拟数据，实际项目中应该从父组件传入或使用状态管理）
    const chats = inject('chats', [])
    const messages = inject('messages', {})
    const currentChatId = inject('currentChatId', null)
    
    // 重命名相关状态
    const showRenameModal = ref(false)
    const renamingChatId = ref(null)
    const renameTitle = ref('')
    const renameInput = ref(null)
    
    // 删除确认相关状态
    const showDeleteModal = ref(false)
    const deletingChatId = ref(null)

    // 过滤有效聊天（有消息的聊天）
    const filteredChats = computed(() => {
      return chats.value.filter(chat => {
        const chatMessages = messages.value[chat.id] || []
        return chatMessages.length > 0
      })
    })

    // 空对话数量
    const emptyChatsCount = computed(() => {
      return chats.value.filter(chat => {
        const chatMessages = messages.value[chat.id] || []
        return chatMessages.length === 0
      }).length
    })

    // 格式化日期
    const formatDate = (date) => {
      const now = new Date()
      const chatDate = new Date(date)
      const diffTime = Math.abs(now - chatDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        return '今天'
      } else if (diffDays === 2) {
        return '昨天'
      } else if (diffDays <= 7) {
        return `${diffDays - 1}天前`
      } else {
        return chatDate.toLocaleDateString('zh-CN', { 
          month: 'short', 
          day: 'numeric' 
        })
      }
    }

    // 选择聊天处理器
    const selectChatHandler = (chatId) => {
      emit('selectChat', chatId)
    }
    
    // 打开重命名弹窗
    const openRenameModal = async (chatId, currentTitle) => {
      renamingChatId.value = chatId
      renameTitle.value = currentTitle || '新对话'
      showRenameModal.value = true
      await nextTick()
      if (renameInput.value) {
        renameInput.value.focus()
        renameInput.value.select()
      }
    }
    
    // 执行重命名
    const executeRename = () => {
      if (renamingChatId.value && renameTitle.value.trim()) {
        const chat = chats.value.find(c => c.id === renamingChatId.value)
        if (chat) {
          chat.title = renameTitle.value.trim()
          props.saveChats()
        }
      }
      cancelRename()
    }
    
    // 取消重命名
    const cancelRename = () => {
      showRenameModal.value = false
      renamingChatId.value = null
      renameTitle.value = ''
    }
    
    // 确认删除
    const confirmDelete = (chatId) => {
      deletingChatId.value = chatId
      showDeleteModal.value = true
    }
    
    // 取消删除
    const cancelDelete = () => {
      showDeleteModal.value = false
      deletingChatId.value = null
    }
    
    // 执行删除
    const executeDelete = () => {
      if (deletingChatId.value) {
        deleteChat(deletingChatId.value)
      }
      cancelDelete()
    }
    
    // 删除聊天
    const deleteChat = (chatId) => {
      const index = chats.value.findIndex(chat => chat.id === chatId)
      if (index > -1) {
        chats.value.splice(index, 1)
        delete messages.value[chatId]
        
        // 如果删除的是当前聊天，切换到其他聊天或清空
        if (currentChatId.value === chatId) {
          if (chats.value.length > 0) {
            emit('selectChat', chats.value[0].id)
          } else {
            emit('selectChat', null)
          }
        }
        
        // 保存更改
        props.saveChats()
      }
    }

    // 清理空对话
    const clearEmptyChats = () => {
      const emptyChats = chats.value.filter(chat => {
        const chatMessages = messages.value[chat.id] || []
        return chatMessages.length === 0
      })

      emptyChats.forEach(chat => {
        const index = chats.value.findIndex(c => c.id === chat.id)
        if (index > -1) {
          chats.value.splice(index, 1)
          delete messages.value[chat.id]
        }
      })
      
      // 保存更改
      if (emptyChats.length > 0) {
        props.saveChats()
      }
    }

    // 自定义返回按钮处理器
    const handleBackButton = () => {
      // 如果有重命名模态框打开，优先关闭它
      if (showRenameModal.value) {
        cancelRename()
        return true
      }
      
      // 如果有删除确认模态框打开，优先关闭它
      if (showDeleteModal.value) {
        cancelDelete()
        return true
      }
      
      // 如果侧边栏打开，关闭侧边栏
      if (props.isOpen) {
        emit('close')
        return true
      }
      
      // 没有需要处理的，返回false
      return false
    }

    // 监听侧边栏打开状态，动态注册/移除返回按钮处理器
    watch(() => props.isOpen, (isOpen) => {
      if (window.Capacitor) {
        if (isOpen) {
          backButtonService.addBackButtonHandler(handleBackButton)
        } else {
          backButtonService.removeBackButtonHandler(handleBackButton)
        }
      }
    })

    // 组件卸载时移除处理器
    onUnmounted(() => {
      if (window.Capacitor) {
        backButtonService.removeBackButtonHandler(handleBackButton)
      }
    })

    return {
      filteredChats,
      emptyChatsCount,
      currentChatId,
      showRenameModal,
      renameTitle,
      renameInput,
      showDeleteModal,
      formatDate,
      selectChatHandler,
      openRenameModal,
      executeRename,
      cancelRename,
      confirmDelete,
      cancelDelete,
      executeDelete,
      deleteChat,
      clearEmptyChats
    }
  }
}
</script>