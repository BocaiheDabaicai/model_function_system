import { SHARE_API_LIST } from './useWechatShare'
import { IMAGE_API_LIST } from './useWechatImage'
import { LOCATION_API_LIST } from './useWechatLocation'

export const ALL_WECHAT_API_LIST = [
  ...SHARE_API_LIST,
  ...IMAGE_API_LIST,
  ...LOCATION_API_LIST,
]

/**
 * 快捷初始化：加载微信 JS-SDK 并注册所有功能模块的 API
 */
export async function initFullWechat(debug = false) {
  const { initWechat, isReady, error } = useWechat()

  await initWechat({
    jsApiList: ALL_WECHAT_API_LIST,
    debug,
  })

  return { isReady, error }
}
