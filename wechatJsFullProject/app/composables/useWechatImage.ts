interface ImageResult {
  localIds: string[]
}

interface UploadResult {
  serverId: string
}

/**
 * 微信图片 composable
 * 拍照、从相册选择、预览、上传图片
 */
export function useWechatImage() {
  const lastError = ref<string | null>(null)
  const selectedImages = ref<string[]>([])
  const uploadedServerIds = ref<string[]>([])

  function chooseImage(count = 9): Promise<string[]> {
    return new Promise((resolve, reject) => {
      window.wx.chooseImage({
        count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res: ImageResult) => {
          selectedImages.value = res.localIds
          resolve(res.localIds)
        },
        fail: (err: { errMsg: string }) => {
          lastError.value = err.errMsg
          reject(new Error(err.errMsg))
        },
      })
    })
  }

  function previewImage(current: string, urls?: string[]) {
    window.wx.previewImage({
      current,
      urls: urls ?? selectedImages.value,
    })
  }

  function uploadImage(localId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      window.wx.uploadImage({
        localId,
        isShowProgressTips: 1,
        success: (res: UploadResult) => {
          const serverId = res.serverId
          uploadedServerIds.value.push(serverId)
          resolve(serverId)
        },
        fail: (err: { errMsg: string }) => {
          lastError.value = err.errMsg
          reject(new Error(err.errMsg))
        },
      })
    })
  }

  function getLocalImgData(localId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      window.wx.getLocalImgData({
        localId,
        success: (res: { localData: string }) => {
          resolve(res.localData)
        },
        fail: (err: { errMsg: string }) => {
          lastError.value = err.errMsg
          reject(new Error(err.errMsg))
        },
      })
    })
  }

  return {
    lastError,
    selectedImages,
    uploadedServerIds,
    chooseImage,
    previewImage,
    uploadImage,
    getLocalImgData,
  }
}

/**
 * 注册图片相关的 jsApiList
 */
export const IMAGE_API_LIST = [
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getLocalImgData',
]
