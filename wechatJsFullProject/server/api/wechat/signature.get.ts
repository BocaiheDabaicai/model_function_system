import crypto from 'node:crypto'

interface CacheEntry {
  value: string
  expiresAt: number
}

const CACHE: Record<string, CacheEntry> = {}

async function fetchAccessToken(appId: string, appSecret: string) {
  const cache = CACHE['access_token']
  if (cache && cache.expiresAt > Date.now()) return cache.value

  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
  const res = await fetch(url)
  const data = await res.json()

  if (data.errcode) {
    throw createError({ statusCode: 500, message: `获取 access_token 失败: ${data.errmsg}` })
  }

  CACHE['access_token'] = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  }
  return data.access_token
}

async function fetchJsapiTicket(accessToken: string) {
  const cache = CACHE['jsapi_ticket']
  if (cache && cache.expiresAt > Date.now()) return cache.value

  const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`
  const res = await fetch(url)
  const data = await res.json()

  if (data.errcode !== 0) {
    throw createError({ statusCode: 500, message: `获取 jsapi_ticket 失败: ${data.errmsg}` })
  }

  CACHE['jsapi_ticket'] = {
    value: data.ticket,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  }
  return data.ticket
}

function generateNonceStr(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const appId = config.public.wechatAppId as string
  const appSecret = config.wechatAppSecret as string

  if (!appId || !appSecret) {
    throw createError({ statusCode: 500, message: '请在 .env 中配置 NUXT_PUBLIC_WECHAT_APP_ID 和 NUXT_WECHAT_APP_SECRET' })
  }

  const query = getQuery(event)
  const url = query.url as string
  if (!url) {
    throw createError({ statusCode: 400, message: '缺少 url 参数' })
  }

  const accessToken = await fetchAccessToken(appId, appSecret)
  const jsapiTicket = await fetchJsapiTicket(accessToken)

  const nonceStr = generateNonceStr()
  const timestamp = Math.floor(Date.now() / 1000)

  const signStr = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
  const signature = crypto.createHash('sha1').update(signStr).digest('hex')

  return {
    appId,
    timestamp,
    nonceStr,
    signature,
    debug: import.meta.dev ? true : false,
  }
})
