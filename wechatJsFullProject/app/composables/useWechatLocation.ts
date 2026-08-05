interface LocationResult {
  latitude: number
  longitude: number
  speed: number
  accuracy: number
}

interface OpenLocationConfig {
  latitude: number
  longitude: number
  name: string
  address: string
  scale?: number
  infoUrl?: string
}

/**
 * 微信地理位置 composable
 * 获取当前位置、查看地图位置
 */
export function useWechatLocation() {
  const lastError = ref<string | null>(null)
  const currentLocation = ref<LocationResult | null>(null)

  function getLocation(): Promise<LocationResult> {
    return new Promise((resolve, reject) => {
      window.wx.getLocation({
        type: 'wgs84',
        success: (res: LocationResult) => {
          currentLocation.value = res
          resolve(res)
        },
        fail: (err: { errMsg: string }) => {
          lastError.value = err.errMsg
          reject(new Error(err.errMsg))
        },
        cancel: () => {
          lastError.value = '用户取消了定位请求'
          reject(new Error('用户取消了定位请求'))
        },
      })
    })
  }

  function openLocation(config: OpenLocationConfig) {
    window.wx.openLocation({
      latitude: config.latitude,
      longitude: config.longitude,
      name: config.name,
      address: config.address,
      scale: config.scale ?? 15,
      infoUrl: config.infoUrl ?? '',
      fail: (err: { errMsg: string }) => {
        lastError.value = err.errMsg
      },
    })
  }

  return {
    lastError,
    currentLocation,
    getLocation,
    openLocation,
  }
}

/**
 * 注册地理位置相关的 jsApiList
 */
export const LOCATION_API_LIST = [
  'getLocation',
  'openLocation',
]
