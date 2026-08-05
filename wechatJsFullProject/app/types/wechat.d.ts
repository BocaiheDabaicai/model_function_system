interface WxApiCallback {
  success?: (res: any) => void
  fail?: (err: { errMsg: string }) => void
  cancel?: () => void
  complete?: (res: any) => void
}

interface Wx {
  config(opts: {
    debug: boolean
    appId: string
    timestamp: number
    nonceStr: string
    signature: string
    jsApiList: string[]
    success?: () => void
    fail?: (err: { errMsg: string }) => void
  }): void

  ready(cb: () => void): void
  error(cb: (err: { errMsg: string }) => void): void

  checkJsApi(opts: WxApiCallback & { jsApiList: string[] }): void

  updateAppMessageShareData(opts: WxApiCallback & {
    title: string; desc: string; link: string; imgUrl: string
  }): void

  updateTimelineShareData(opts: WxApiCallback & {
    title: string; link: string; imgUrl: string
  }): void

  onMenuShareAppMessage(opts: {
    title: string; desc: string; link: string; imgUrl: string
    success?: () => void; cancel?: () => void
  }): void

  onMenuShareTimeline(opts: {
    title: string; link: string; imgUrl: string
    success?: () => void; cancel?: () => void
  }): void

  chooseImage(opts: WxApiCallback & {
    count?: number; sizeType?: string[]; sourceType?: string[]
  }): void

  previewImage(opts: { current: string; urls: string[] }): void

  uploadImage(opts: WxApiCallback & {
    localId: string; isShowProgressTips?: number
  }): void

  downloadImage(opts: WxApiCallback & {
    serverId: string; isShowProgressTips?: number
  }): void

  getLocalImgData(opts: WxApiCallback & { localId: string }): void

  getLocation(opts: WxApiCallback & { type?: string }): void

  openLocation(opts: WxApiCallback & {
    latitude: number; longitude: number
    name: string; address: string
    scale?: number; infoUrl?: string
  }): void

  [key: string]: any
}

declare global {
  interface Window {
    wx: Wx
  }
}

export {}
