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
      
      <!-- 右侧按钮组（已移除） -->
      <div class="navbar-end">
      </div>
    </div>

    <!-- 配置内容 -->
    <div class="container mx-auto p-6 max-w-4xl pt-20">
      <!-- 顶部按钮组（新位置） -->
      <div class="flex gap-2 mb-6 justify-end">
        <!-- 下载模板按钮 -->
        <button @click="downloadTemplate" class="btn btn-outline btn-sm">
          下载模板
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
      
      <!-- 第二行按钮组 -->
      <div class="flex gap-2 mb-6 justify-end">
        <!-- 配置教程按钮 -->
        <button @click="showTutorial" class="btn btn-outline btn-sm">
          配置教程
        </button>
        <!-- 清除所有模型按钮 -->
        <button @click="clearAllModels" class="btn btn-error btn-sm">
          清除所有
        </button>
      </div>
      <!-- SDK分组 -->
      <div class="space-y-6">
        <div v-for="sdk in sdkGroups" :key="sdk.id" class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <!-- SDK标题 -->
            <div class="flex items-center">
              <div class="flex items-center">
                <!-- OpenAI使用自定义SVG图标 -->
                <div v-if="sdk.id === 'openai'" class="mr-3" style="background-color: #0000ff; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                  <span class="chatgpt-svg"> 
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor"> 
                      <path d="M11.2475 18.25C10.6975 18.25 10.175 18.1455 9.67999 17.9365C9.18499 17.7275 8.74499 17.436 8.35999 17.062C7.94199 17.205 7.50749 17.2765 7.05649 17.2765C6.31949 17.2765 5.63749 17.095 5.01049 16.732C4.38349 16.369 3.87749 15.874 3.49249 15.247C3.11849 14.62 2.93149 13.9215 2.93149 13.1515C2.93149 12.8325 2.97549 12.486 3.06349 12.112C2.62349 11.705 2.28249 11.2375 2.04049 10.7095C1.79849 10.1705 1.67749 9.6095 1.67749 9.0265C1.67749 8.4325 1.80399 7.8605 2.05699 7.3105C2.30999 6.7605 2.66199 6.2875 3.11299 5.8915C3.57499 5.4845 4.10849 5.204 4.71349 5.05C4.83449 4.423 5.08749 3.862 5.47249 3.367C5.86849 2.861 6.35249 2.465 6.92449 2.179C7.49649 1.893 8.10699 1.75 8.75599 1.75C9.30599 1.75 9.82849 1.8545 10.3235 2.0635C10.8185 2.2725 11.2585 2.564 11.6435 2.938C12.0615 2.795 12.496 2.7235 12.947 2.7235C13.684 2.7235 14.366 2.905 14.993 3.268C15.62 3.631 16.1205 4.126 16.4945 4.753C16.8795 5.38 17.072 6.0785 17.072 6.8485C17.072 7.1675 17.028 7.514 16.94 7.888C17.38 8.295 17.721 8.768 17.963 9.307C18.205 9.835 18.326 10.3905 18.326 10.9735C18.326 11.5675 18.1995 12.1395 17.9465 12.6895C17.6935 13.2395 17.336 13.718 16.874 14.125C16.423 14.521 15.895 14.796 15.29 14.95C15.169 15.577 14.9105 16.138 14.5145 16.633C14.1295 17.139 13.651 17.535 13.079 17.821C12.507 18.107 11.8965 18.25 11.2475 18.25ZM7.17199 16.1875C7.72199 16.1875 8.20049 16.072 8.60749 15.841L11.7095 14.059C11.8195 13.982 11.8745 13.8775 11.8745 13.7455V12.3265L7.88149 14.62C7.63949 14.763 7.39749 14.763 7.15549 14.62L4.03699 12.8215C4.03699 12.8545 4.03149 12.893 4.02049 12.937C4.02049 12.981 4.02049 13.047 4.02049 13.135C4.02049 13.696 4.15249 14.213 4.41649 14.686C4.69149 15.148 5.07099 15.511 5.55499 15.775C6.03899 16.05 6.57799 16.1875 7.17199 16.1875ZM7.33699 13.498C7.40299 13.531 7.46349 13.5475 7.51849 13.5475C7.57349 13.5475 7.62849 13.531 7.68349 13.498L8.92099 12.7885L4.94449 10.4785C4.70249 10.3355 4.58149 10.121 4.58149 9.835V6.2545C4.03149 6.4965 3.59149 6.8705 3.26149 7.3765C2.93149 7.8715 2.76649 8.4215 2.76649 9.0265C2.76649 9.5655 2.90399 10.0825 3.17899 10.5775C3.45399 11.0725 3.81149 11.4465 4.25149 11.6995L7.33699 13.498ZM11.2475 17.161C11.8305 17.161 12.3585 17.029 12.8315 16.765C13.3045 16.501 13.6785 16.138 13.9535 15.676C14.2285 15.214 14.366 14.697 14.366 14.125V10.561C14.366 10.429 14.311 10.33 14.201 10.264L12.947 9.538V14.1415C12.947 14.4275 12.826 14.642 12.584 14.785L9.46549 16.5835C10.0045 16.9685 10.5985 17.161 11.2475 17.161ZM11.8745 11.122V8.878L10.01 7.822L8.12899 8.878V11.122L10.01 12.178L11.8745 11.122ZM7.05649 5.8585C7.05649 5.5725 7.17749 5.358 7.41949 5.215L10.538 3.4165C9.99899 3.0315 9.40499 2.839 8.75599 2.839C8.17299 2.839 7.64499 2.971 7.17199 3.235C6.69899 3.499 6.32499 3.862 6.04999 4.324C5.78599 4.786 5.65399 5.303 5.65399 5.875V9.4225C5.65399 9.5545 5.70899 9.659 5.81899 9.736L7.05649 10.462V5.8585ZM15.4385 13.7455C15.9885 13.5035 16.423 13.1295 16.742 12.6235C17.072 12.1175 17.237 11.5675 17.237 10.9735C17.237 10.4345 17.0995 9.9175 16.8245 9.4225C16.5495 8.9275 16.192 8.5535 15.752 8.3005L12.6665 6.5185C12.6005 6.4745 12.54 6.458 12.485 6.469C12.43 6.469 12.375 6.4855 12.32 6.5185L11.0825 7.2115L15.0755 9.538C15.1965 9.604 15.2845 9.692 15.3395 9.802C15.4055 9.901 15.4385 10.022 15.4385 10.165V13.7455ZM12.122 5.3635C12.364 5.2095 12.606 5.2095 12.848 5.3635L15.983 7.195C15.983 7.118 15.983 7.019 15.983 6.898C15.983 6.37 15.851 5.8695 15.587 5.3965C15.334 4.9125 14.9655 4.5275 14.4815 4.2415C14.0085 3.9555 13.4585 3.8125 12.8315 3.8125C12.2815 3.8125 11.803 3.928 11.396 4.159L8.29399 5.941C8.18399 6.018 8.12899 6.1225 8.12899 6.2545V7.6735L12.122 5.3635Z"></path> 
                    </svg> 
                  </span>
                </div>
                <!-- Google AI使用自定义SVG图标 -->
                <div v-else-if="sdk.id === 'google'" class="mr-3" style="background-color: transparent; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                  <span class="google-svg">
                    <svg viewBox="0 0 28.01 28" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                      <radialGradient id="a" cx="-576.08" cy="491.7" gradientTransform="matrix(28.2302 9.54441 76.4642 -226.16369 -21336.18 116711.38)" gradientUnits="userSpaceOnUse" r="1">
                        <stop offset=".07" stop-color="#9168c0"/>
                        <stop offset=".34" stop-color="#5684d1"/>
                        <stop offset=".67" stop-color="#1ba1e3"/>
                      </radialGradient>
                      <path d="M14 28c0-1.94-.37-3.76-1.12-5.46-.72-1.7-1.72-3.19-2.98-4.45s-2.74-2.25-4.44-2.97C3.76 14.37 1.94 14 0 14c1.94 0 3.76-.36 5.46-1.09 1.7-.75 3.19-1.75 4.44-3.01 1.26-1.26 2.25-2.74 2.98-4.44C13.63 3.76 14 1.94 14 0c0 1.94.36 3.76 1.09 5.46.75 1.7 1.75 3.19 3.01 4.44 1.26 1.26 2.74 2.26 4.45 3.01 1.7.72 3.52 1.09 5.46 1.09-1.94 0-3.76.37-5.46 1.12-1.7.72-3.19 1.71-4.45 2.97s-2.26 2.74-3.01 4.45A13.86 13.86 0 0 0 14 28z" fill="url(#a)"/>
                    </svg>
                  </span>
                </div>
                <!-- Anthropic使用自定义SVG图标 -->
                <div v-else-if="sdk.id === 'anthropic'" class="mr-3" style="background-color: transparent; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                  <span class="anthropic-svg">
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                      <path shape-rendering="optimizeQuality" fill="#D97757" d="m7.75 26.27 7.77-4.36.13-.38-.13-.21h-.38l-1.3-.08-4.44-.12-3.85-.16-3.73-.2-.94-.2L0 19.4l.09-.58.79-.53 1.13.1 2.5.17 3.75.26 2.72.16 4.03.42h.64l.09-.26-.22-.16-.17-.16-3.88-2.63-4.2-2.78-2.2-1.6L3.88 11l-.6-.76-.26-1.66L4.1 7.39l1.45.1.37.1 1.47 1.13 3.14 2.43 4.1 3.02.6.5.24-.17.03-.12-.27-.45L13 9.9l-2.38-4.1-1.06-1.7-.28-1.02c-.1-.42-.17-.77-.17-1.2L10.34.21l.68-.22 1.64.22.69.6 1.02 2.33 1.65 3.67 2.56 4.99.75 1.48.4 1.37.15.42h.26v-.24l.21-2.81.39-3.45.38-4.44.13-1.25.62-1.5L23.1.57l.96.46.79 1.13-.11.73-.47 3.05-.92 4.78-.6 3.2h.35l.4-.4 1.62-2.15 2.72-3.4 1.2-1.35 1.4-1.49.9-.71h1.7l1.25 1.86-.56 1.92-1.75 2.22-1.45 1.88-2.08 2.8-1.3 2.24.12.18.31-.03 4.7-1 2.54-.46 3.03-.52 1.37.64.15.65-.54 1.33-3.24.8-3.8.76-5.66 1.34-.07.05.08.1 2.55.24 1.09.06h2.67l4.97.37 1.3.86.78 1.05-.13.8-2 1.02-2.7-.64-6.3-1.5-2.16-.54h-.3v.18l1.8 1.76 3.3 2.98 4.13 3.84.21.95-.53.75-.56-.08-3.63-2.73-1.4-1.23-3.17-2.67h-.21v.28l.73 1.07 3.86 5.8.2 1.78-.28.58-1 .35-1.1-.2L26 33.14l-2.33-3.57-1.88-3.2-.23.13-1.11 11.95-.52.61-1.2.46-1-.76-.53-1.23.53-2.43.64-3.17.52-2.52.47-3.13.28-1.04-.02-.07-.23.03-2.36 3.24-3.59 4.85-2.84 3.04-.68.27-1.18-.61.11-1.09.66-.97 3.93-5 2.37-3.1 1.53-1.79-.01-.26h-.09L6.8 30.56l-1.86.24-.8-.75.1-1.23.38-.4 3.14-2.16Z"/>
                    </svg>
                  </span>
                </div>
                <!-- 其他SDK使用默认头像 -->
                <div v-else class="avatar placeholder mr-3">
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
                              @change="onModelSelect(sdk, group, model)"
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
  
  <!-- 配置教程弹窗 -->
  <div v-if="showTutorialDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-base-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
      <div class="flex justify-between items-center border-b border-base-300 p-4">
        <h3 class="text-lg font-bold">AI模型配置教程</h3>
        <button @click="closeTutorial" class="btn btn-sm btn-circle btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="overflow-y-auto p-4 flex-1">
        <div class="prose max-w-none">
          <h4 class="text-md font-bold mb-2">配置步骤</h4>
          <ol class="list-decimal list-inside space-y-2">
            <li>选择对应的AI服务提供商（OpenAI、Google AI或Anthropic）</li>
            <li>点击"添加组"按钮创建新的配置组</li>
            <li>为组设置一个易于识别的名称</li>
            <li>填入您的API Key（部分提供商还需要填写Base URL）</li>
            <li>在组内添加需要使用的模型名称和显示名称</li>
            <li>点击"保存"按钮保存配置</li>
            <li>在模型列表中选择默认使用的模型</li>
          </ol>
          
          <h4 class="text-md font-bold mt-4 mb-2">注意事项</h4>
          <ul class="list-disc list-inside space-y-2">
            <li>API Key是敏感信息，请妥善保管</li>
            <li>不同提供商的模型名称可能不同，请参考官方文档</li>
            <li>配置完成后需要点击"保存"按钮才能生效</li>
            <li>可以导出配置文件以便备份或迁移</li>
          </ul>
          
          <h4 class="text-md font-bold mt-4 mb-2">常见问题</h4>
          <div class="space-y-2">
            <div>
              <p class="font-medium">Q: 如何获取API Key？</p>
              <p>A: 请前往对应AI服务提供商的官方网站申请API Key。</p>
            </div>
            <div>
              <p class="font-medium">Q: 模型名称在哪里查看？</p>
              <p>A: 请参考对应AI服务提供商的官方文档获取准确的模型名称。</p>
            </div>
          </div>

          <h4 class="text-md font-bold mt-4 mb-2">各提供商Base URL和API Key获取地址</h4>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th>提供商</th>
                  <th>Base URL</th>
                  <th>API Key获取地址</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>OpenAI</td>
                  <td><code>https://api.openai.com/v1/chat/completions</code></td>
                  <td><a href="https://platform.openai.com/api-keys" target="_blank" class="link link-primary">获取API Key</a></td>
                </tr>
                <tr>
                  <td>xAI</td>
                  <td><code>https://api.x.ai/v1</code></td>
                  <td><a href="https://console.x.ai/" target="_blank" class="link link-primary">获取API Key</a></td>
                </tr>
                <tr>
                  <td>Google</td>
                  <td>无需base url</td>
                  <td><a href="https://aistudio.google.com/apikey" target="_blank" class="link link-primary">获取API Key</a></td>
                </tr>
                <tr>
                  <td>Anthropic</td>
                  <td>无需base url</td>
                  <td><a href="https://console.anthropic.com/settings/keys" target="_blank" class="link link-primary">获取API Key</a></td>
                </tr>
                <tr>
                  <td>DeepSeek</td>
                  <td><code>https://api.deepseek.com/v1</code></td>
                  <td><a href="https://platform.deepseek.com/api_keys" target="_blank" class="link link-primary">获取API Key</a></td>
                </tr>
                <tr>
                  <td>阿里云百炼</td>
                  <td><code>https://dashscope.aliyuncs.com/compatible-mode/v1</code></td>
                  <td><a href="https://bailian.console.aliyun.com/?tab=model#/api-key" target="_blank" class="link link-primary">获取API Key</a></td>
                </tr>
                <tr>
                  <td>火山方舟</td>
                  <td><code>https://ark.cn-beijing.volces.com/api/v3</code></td>
                  <td><a href="https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey?apikey={}" target="_blank" class="link link-primary">获取API Key</a></td>
                </tr>
                <tr>
                  <td>Moonshot</td>
                  <td><code>https://api.moonshot.cn/v1</code></td>
                  <td><a href="https://platform.moonshot.cn/console/api-keys" target="_blank" class="link link-primary">获取API Key</a></td>
                </tr>
                <tr>
                  <td>OpenRouter</td>
                  <td><code>https://openrouter.ai/api/v1</code></td>
                  <td><a href="https://openrouter.ai/settings/keys" target="_blank" class="link link-primary">获取API Key</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="border-t border-base-300 p-4">
        <div class="flex justify-end">
          <button @click="closeTutorial" class="btn btn-primary">关闭</button>
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
    
    // 配置教程相关
    const showTutorialDialog = ref(false)
    
    // SDK分组数据
    const sdkGroups = ref([
      {
        id: 'openai',
        name: 'OpenAI',
        description: '基于OpenAI SDK的模型配置，支持 OpenAI , xAI , DeepSeek , 阿里云百炼 , Moonshot , 火山方舟 , OpenRouter 等模型提供商',
        expanded: true,
        groups: []
      },
      {
        id: 'google',
        name: 'Google AI',
        description: '基于Google AI SDK的模型配置，支持 Gemini 等系列模型',
        expanded: true,
        groups: []
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        description: '基于Anthropic SDK的模型配置，支持 Claude 等系列模型',
        expanded: true,
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

    // 模型选择处理
    const onModelSelect = (sdk, group, model) => {
      // 保存选中的模型ID
      localStorage.setItem('gsrobot-selected-model', model.id)
      
      // 更新当前模型信息用于其他组件
      const currentModelInfo = {
        name: model.displayName,
        provider: `${sdk.name} - ${group.name}`,
        modelName: model.name,
        sdkId: sdk.id,
        groupId: group.id,
        apiKey: group.apiKey || '',
        baseUrl: group.baseUrl || ''
      }
      
      localStorage.setItem('gsrobot-current-model', JSON.stringify(currentModelInfo))
      
      // 显示提示信息
      const toast = document.createElement('div')
      toast.className = 'toast toast-top toast-center'
      toast.innerHTML = `
        <div class="alert alert-success">
          <span>已选择模型: ${model.displayName}</span>
        </div>
      `
      document.body.appendChild(toast)
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 2000)
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

    // 下载模板
     const downloadTemplate = () => {
       try {
         const templateUrl = 'https://glescloud.oss-cn-beijing.aliyuncs.com/gsrobot-config.json'
         
         // 显示下载提示
         const toast = document.createElement('div')
         toast.className = 'toast toast-top toast-center'
         toast.innerHTML = `
           <div class="alert alert-info">
             <span>正在打开下载链接...</span>
           </div>
         `
         document.body.appendChild(toast)
         
         // 使用window.open下载文件
         const newWindow = window.open(templateUrl, '_blank')
         
         // 如果浏览器阻止弹窗，则显示提示
         if (!newWindow) {
           document.body.removeChild(toast)
           const errorToast = document.createElement('div')
           errorToast.className = 'toast toast-top toast-center'
           errorToast.innerHTML = `
             <div class="alert alert-error">
               <span>下载被浏览器阻止，请允许弹窗后重试</span>
             </div>
           `
           document.body.appendChild(errorToast)
           setTimeout(() => {
             document.body.removeChild(errorToast)
           }, 3000)
           return
         }
         
         // 移除提示
         setTimeout(() => {
           if (document.body.contains(toast)) {
             document.body.removeChild(toast)
           }
         }, 2000)
         
         // 显示成功提示
         const successToast = document.createElement('div')
         successToast.className = 'toast toast-top toast-center'
         successToast.innerHTML = `
           <div class="alert alert-success">
             <span>如果下载未开始，请检查弹窗阻止设置</span>
           </div>
         `
         document.body.appendChild(successToast)
         setTimeout(() => {
           document.body.removeChild(successToast)
         }, 3000)
       } catch (error) {
         console.error('下载模板失败:', error)
         
         // 显示错误提示
         const errorToast = document.createElement('div')
         errorToast.className = 'toast toast-top toast-center'
         errorToast.innerHTML = `
           <div class="alert alert-error">
             <span>下载失败: ${error.message}</span>
           </div>
         `
         document.body.appendChild(errorToast)
         setTimeout(() => {
           document.body.removeChild(errorToast)
         }, 3000)
       }
     }

    // 显示配置教程
    const showTutorial = () => {
      showTutorialDialog.value = true
    }

    // 关闭配置教程
    const closeTutorial = () => {
      showTutorialDialog.value = false
    }

    return {
      sdkGroups,
      selectedModelId,
      showImportDialog,
      showClearDialog,
      showTutorialDialog,
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
      cancelClear,
      downloadTemplate,
      showTutorial,
      closeTutorial,
      onModelSelect
    }
  }
}
</script>