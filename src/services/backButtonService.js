import { App } from '@capacitor/app';
import router from '../router';

class BackButtonService {
  constructor() {
    this.isInitialized = false;
    this.backButtonHandlers = [];
    this.lastBackTime = 0;
    this.backToExitDelay = 2000; // 2秒内连续按返回键退出应用
  }

  /**
   * 初始化返回按钮监听
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      // 监听硬件返回按钮
      await App.addListener('backButton', (data) => {
        this.handleBackButton(data);
      });

      this.isInitialized = true;
      console.log('BackButtonService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize BackButtonService:', error);
    }
  }

  /**
   * 处理返回按钮事件
   */
  handleBackButton(data) {
    console.log('Back button pressed, canGoBack:', data.canGoBack);

    // 如果有自定义处理器，优先执行
    if (this.backButtonHandlers.length > 0) {
      const handler = this.backButtonHandlers[this.backButtonHandlers.length - 1];
      const handled = handler();
      if (handled) {
        return;
      }
    }

    // 获取当前路由
    const currentRoute = router.currentRoute.value;
    
    // 如果在首页，处理退出逻辑
    if (currentRoute.meta?.isRoot || currentRoute.name === 'Home' || currentRoute.path === '/') {
      this.handleExitApp();
      return;
    }

    // 尝试使用智能返回
    const canSmartBack = router.smartBack();
    if (canSmartBack) {
      return;
    }

    // 如果智能返回失败，尝试浏览器历史返回
    if (data.canGoBack && window.history.length > 1) {
      router.back();
      return;
    }

    // 最后的备选方案：导航到首页
    router.push('/');
  }

  /**
   * 处理应用退出逻辑
   */
  handleExitApp() {
    const currentTime = Date.now();
    
    // 如果距离上次按返回键时间小于设定延迟，则退出应用
    if (currentTime - this.lastBackTime < this.backToExitDelay) {
      App.exitApp();
      return;
    }

    // 记录本次按返回键的时间
    this.lastBackTime = currentTime;
    
    // 显示提示信息
    this.showExitToast();
  }

  /**
   * 显示退出提示
   */
  showExitToast() {
    // 创建一个简单的toast提示
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-base-300 text-base-content px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
    toast.textContent = '再次点击返回键退出应用';
    toast.style.opacity = '0';
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);
    
    // 2秒后自动隐藏
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2000);
  }

  /**
   * 添加自定义返回按钮处理器
   * @param {Function} handler - 处理函数，返回true表示已处理，false表示继续默认处理
   */
  addBackButtonHandler(handler) {
    this.backButtonHandlers.push(handler);
  }

  /**
   * 移除自定义返回按钮处理器
   * @param {Function} handler - 要移除的处理函数
   */
  removeBackButtonHandler(handler) {
    const index = this.backButtonHandlers.indexOf(handler);
    if (index > -1) {
      this.backButtonHandlers.splice(index, 1);
    }
  }

  /**
   * 清除所有自定义处理器
   */
  clearBackButtonHandlers() {
    this.backButtonHandlers = [];
  }

  /**
   * 销毁服务
   */
  async destroy() {
    if (!this.isInitialized) {
      return;
    }

    try {
      await App.removeAllListeners();
      this.backButtonHandlers = [];
      this.isInitialized = false;
      console.log('BackButtonService destroyed');
    } catch (error) {
      console.error('Failed to destroy BackButtonService:', error);
    }
  }
}

// 创建单例实例
const backButtonService = new BackButtonService();

export default backButtonService;