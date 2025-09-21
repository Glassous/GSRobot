# GSRobot 🤖

一个现代化的AI聊天机器人界面，基于Vue 3构建，提供优雅的用户体验和强大的功能。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## ✨ 特性

### 🎨 现代化界面
- **响应式设计**: 完美适配桌面端和移动端
- **多主题支持**: 30+ 种主题，支持深浅色模式
- **优雅动画**: 流畅的过渡效果和交互反馈
- **直观布局**: 清晰的信息层次和用户友好的界面

### 💬 智能聊天
- **多会话管理**: 支持创建和管理多个聊天会话
- **自动保存**: 聊天记录本地持久化存储
- **智能标题**: 根据对话内容自动生成会话标题
- **实时交互**: 流畅的消息发送和接收体验
- **自适应输入**: 输入框高度随内容自动调整

### ⚙️ 灵活配置
- **AI模型选择**: 支持多种AI模型配置
- **API密钥管理**: 安全的密钥存储和管理
- **个性化设置**: 主题、模型等设置持久化保存

### 🔄 智能导航
- **状态保持**: 从设置页返回时保持当前对话
- **自动新建**: 刷新或直接访问时自动创建新对话
- **会话切换**: 快速在不同对话间切换

## 🚀 快速开始

### 环境要求
- Node.js 16.0+
- npm 7.0+ 或 yarn 1.22+

### 安装

```bash
# 克隆项目
git clone https://github.com/Glassous/GSRobot.git
cd GSRobot

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 构建并同步到移动端平台
npm run build-mobile

# 打开 Android 项目
npm run open-android

# 打开 iOS 项目
npm run open-ios
```

## 🛠️ 技术栈

## 📱 移动端打包 (Capacitor)

### 配置信息
- **应用名称**: GSRobot
- **包名**: com.glassous.gsrobot

### 平台支持
- Android
- iOS

### 打包流程
1. 运行 `npm run build-mobile` 构建并同步到移动端平台
2. 运行 `npm run open-android` 或 `npm run open-ios` 打开对应平台的原生项目
3. 在原生开发环境中进行最终的构建和签名

### 版本控制
项目已配置适当的 `.gitignore` 规则，确保：
- Capacitor 生成的原生项目文件不被提交
- 构建产物和敏感文件被忽略
- 只有必要的配置文件被版本控制


| 技术 | 版本 | 用途 |
|------|------|------|
| Vue.js | 3.x | 前端框架 |
| Vite | 5.x | 构建工具 |
| Vue Router | 4.x | 路由管理 |
| Tailwind CSS | 3.x | 样式框架 |
| DaisyUI | 4.x | UI组件库 |
| Heroicons | 2.x | 图标库 |

## 📁 项目结构

```
GSRobot/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 可复用组件
│   │   ├── ChatArea.vue   # 聊天区域
│   │   └── Sidebar.vue    # 侧边栏
│   ├── views/             # 页面组件
│   │   ├── Home.vue       # 主页
│   │   └── Settings.vue   # 设置页
│   ├── router/            # 路由配置
│   ├── App.vue            # 根组件
│   ├── main.js            # 应用入口
│   └── style.css          # 全局样式
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 核心功能

### 聊天管理
- **新建对话**: 一键创建新的聊天会话
- **会话重命名**: 弹窗式重命名，支持键盘快捷键
- **历史记录**: 自动保存所有聊天记录到本地存储
- **智能清理**: 自动清理空对话，保持界面整洁

### 用户体验
- **自适应输入**: 输入框高度随内容自动调整
- **键盘支持**: Enter发送，Shift+Enter换行
- **状态保持**: 页面刷新后恢复之前的聊天状态
- **响应式布局**: 完美适配各种屏幕尺寸

### 个性化设置
- **主题切换**: 支持系统主题跟随和手动选择
- **AI配置**: 灵活的API密钥和模型配置
- **数据持久化**: 所有设置和数据本地保存

## 🔧 配置说明

### 环境变量
创建 `.env` 文件配置环境变量：

```env
VITE_APP_TITLE=GSRobot
VITE_API_BASE_URL=your_api_base_url
```

### 自定义主题
在 `tailwind.config.js` 中添加自定义主题：

```javascript
module.exports = {
  daisyui: {
    themes: [
      "light", "dark", "cupcake", 
      // 添加更多主题...
    ],
  },
}
```

## 🤝 贡献

我们欢迎所有形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

### 开发流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📝 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本更新详情。

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架  
- [DaisyUI](https://daisyui.com/) - 美观的Tailwind CSS组件库
- [Heroicons](https://heroicons.com/) - 精美的SVG图标集
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

## 📞 联系我们

- 项目主页: [https://github.com/Glassous/GSRobot](https://github.com/Glassous/GSRobot)
- 问题反馈: [Issues](https://github.com/Glassous/GSRobot/issues)
- 功能建议: [Discussions](https://github.com/Glassous/GSRobot/discussions)

---

⭐ 如果这个项目对你有帮助，请给我们一个星标！
