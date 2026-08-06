// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    server: {
      allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev'],
    },
  },

  runtimeConfig: {
    // 仅服务端可访问
    wechatAppSecret: '',
    // 客户端和服务端均可访问
    public: {
      wechatAppId: '',
    },
  },
})
