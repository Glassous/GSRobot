<template>
  <div id="app" class="app-container">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isCapacitorEnvironment: false
    }
  },
  mounted() {
    // 检测Capacitor环境
    this.detectCapacitorEnvironment();
    
    // 将Capacitor环境状态设置为全局可访问
    this.$root.isCapacitorEnvironment = this.isCapacitorEnvironment;
    
    // 仅在安卓环境下执行沉浸式设置
    if (this.isAndroid()) {
      this.setupImmersiveMode();
    }
  },
  methods: {
    detectCapacitorEnvironment() {
      // 检测是否在Capacitor环境中运行
      this.isCapacitorEnvironment = !!(window.Capacitor || window.cordova || window.ionic);
      
      // 为body添加Capacitor环境标识类
      if (this.isCapacitorEnvironment) {
        document.body.classList.add('capacitor-env');
      }
    },
    isAndroid() {
      // 检测是否为安卓环境
      return /Android/i.test(navigator.userAgent) || 
             (window.cordova && window.device && window.device.platform === 'Android') ||
             (window.ionic && window.ionic.Platform && window.ionic.Platform.is('android'));
    },
    setupImmersiveMode() {
      // 设置状态栏和导航栏样式
      if (window.StatusBar) {
        window.StatusBar.overlaysWebView(true);
        window.StatusBar.backgroundColorByHexString('#00000000'); // 透明背景
        window.StatusBar.styleDefault();
      }
      
      // 设置导航栏透明
      if (window.NavigationBar) {
        window.NavigationBar.backgroundColorByHexString('#00000000');
      }
      
      // 添加安卓特定的meta标签
      this.addAndroidMetaTags();
    },
    addAndroidMetaTags() {
      // 添加viewport meta标签以支持安全区域
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no'
        );
      } else {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no';
        document.head.appendChild(meta);
      }
    }
  }
}
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

/* 应用容器样式 */
.app-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

/* Capacitor环境下的顶部栏安全区域适配 - 仅顶部30px */
body.capacitor-env .navbar {
  padding-top: 30px;
}

/* Capacitor环境下的内容区域适配 - 避免被顶部栏遮挡 */
body.capacitor-env .content-area {
  margin-top: 30px;
  /* 调整高度计算，减去额外的30px margin-top，使用!important确保覆盖Tailwind */
  height: calc(100vh - 4rem - 45px) !important;
}
</style>
