interface ShareConfig {
  title: string
  desc: string
  link: string
  imgUrl: string
}

/**
 * 微信分享 composable
 * 自定义分享给朋友和分享到朋友圈的内容
 */
export function useWechatShare() {
  const lastShareError = ref<string | null>(null)

  function setShare(config: ShareConfig) {
    lastShareError.value = null

    try {
      window.wx.updateAppMessageShareData({
        title: config.title,
        desc: config.desc,
        link: config.link,
        imgUrl: config.imgUrl,
        success: () => {},
        fail: (err: { errMsg: string }) => {
          lastShareError.value = err.errMsg || '分享配置失败'
        },
      })
      window.wx.updateTimelineShareData({
        title: config.title,
        link: config.link,
        imgUrl: config.imgUrl,
        success: () => {},
        fail: (err: { errMsg: string }) => {
          lastShareError.value = err.errMsg || '朋友圈分享配置失败'
        },
      })
    } catch (err) {
      lastShareError.value = err instanceof Error ? err.message : '分享配置失败'
    }
  }

  return { setShare, lastShareError }
}

/**
 * 注册分享相关的 jsApiList
 */
export const SHARE_API_LIST = [
  'updateAppMessageShareData',
  'updateTimelineShareData',
  'onMenuShareAppMessage',
  'onMenuShareTimeline',
]
