interface WechatConfig {
  jsApiList: string[]
  debug?: boolean
}

const SDK_URL = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'

interface WechatState {
  isLoading: Ref<boolean>
  isReady: Ref<boolean>
  error: Ref<string | null>
}

/**
 * 微信 JS-SDK 核心 composable
 * 负责加载 SDK → 请求签名 → wx.config → 等待 wx.ready
 */
export function useWechat(): WechatState & { initWechat: (config?: Partial<WechatConfig>) => Promise<void> } {
  const isLoading = ref(false)
  const isReady = ref(false)
  const error = ref<string | null>(null)

  let loadPromise: Promise<void> | null = null

  function loadScript(): Promise<void> {
    if (loadPromise) return loadPromise

    loadPromise = new Promise((resolve, reject) => {
      if (window.wx) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = SDK_URL
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('加载微信 JS-SDK 失败'))
      document.head.appendChild(script)
    })
    return loadPromise
  }

  async function initWechat(config?: Partial<WechatConfig>) {
    isLoading.value = true
    error.value = null

    try {
      await loadScript()

      const currentUrl = window.location.href.split('#')[0]
      const response = await $fetch('/api/wechat/signature', { query: { url: currentUrl } })

      const finalConfig: WechatConfig = {
        debug: !!response.debug,
        jsApiList: config?.jsApiList ?? [],
        ...config,
      }

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('wx.config 超时，请检查公众号 JS 接口安全域名配置'))
        }, 10000)

        window.wx.config({
          debug: finalConfig.debug ?? false,
          appId: response.appId,
          timestamp: response.timestamp,
          nonceStr: response.nonceStr,
          signature: response.signature,
          jsApiList: finalConfig.jsApiList,
          success: () => {
            clearTimeout(timeout)
          },
          fail(err: { errMsg: string }) {
            clearTimeout(timeout)
            reject(new Error(err.errMsg || 'wx.config 失败'))
          },
        })

        window.wx.ready(() => {
          clearTimeout(timeout)
          isReady.value = true
          isLoading.value = false
          resolve()
        })

        window.wx.error((err: { errMsg: string }) => {
          clearTimeout(timeout)
          error.value = err.errMsg
          isLoading.value = false
          reject(new Error(err.errMsg))
        })
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      isLoading.value = false
    }
  }

  return {
    isLoading,
    isReady,
    error,
    initWechat,
  }
}

/**
 * 检查指定 API 是否可用
 */
export function checkWechatApi(apiName: string): boolean {
  return !!(window.wx && window.wx[apiName as keyof typeof window.wx])
}
