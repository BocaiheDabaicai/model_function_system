# WeChat JS-SDK Full Project

基于 Nuxt 4 的微信 JS-SDK 全栈功能模块，前端展示 + 后端签名接口一体化，可独立测试、可迁移复用。

## 技术栈

- **Nuxt 4** — Vue 3 全栈框架，内置 Nitro Server
- **Nitro Server** — 提供 `/api/wechat/signature` 签名接口（无需额外后端）
- **微信 JS-SDK 1.6.0** — 分享、图片、地理位置等原生能力
- **TypeScript** — 可选类型支持

## 项目结构

```
wechatJsFullProject/
├── app/                        # 前端页面
│   ├── app.vue                 # 根布局
│   ├── pages/                  # 路由页面
│   └── composables/            # 可复用逻辑（微信 SDK 封装）
├── server/                     # 后端 API
│   └── api/
│       └── wechat/
│           └── signature.ts    # 签名接口（获取 wx.config 所需签名）
├── public/                     # 静态资源
├── nuxt.config.ts              # Nuxt 配置
└── package.json
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:3000）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 微信 JS-SDK 工作流程

```
用户访问页面 → 前端调用 /api/wechat/signature → Nitro Server 生成签名
→ 前端 wx.config 注入 → wx.ready → 调用微信 API
```

## 环境变量

创建 `.env` 文件，配置微信公众号参数：

```env
WECHAT_APP_ID=你的公众号AppID
WECHAT_APP_SECRET=你的公众号AppSecret
```

> appSecret 仅存在于服务端，不会暴露到前端。

## 功能模块（计划）

| 模块 | 说明 | API |
|------|------|-----|
| 基础配置 | 签名获取、wx.config 注入 | `useWechat()` |
| 自定义分享 | 分享给朋友、分享到朋友圈 | `wx.updateAppMessageShareData` |
| 图片操作 | 拍照、选图、预览、上传 | `wx.chooseImage` / `wx.previewImage` |
| 地理位置 | 获取位置、查看地图 | `wx.getLocation` / `wx.openLocation` |

## 注意事项

- 微信 JS-SDK 仅在**微信内置浏览器**中生效，PC 浏览器调试需用微信开发者工具
- 公众号后台需配置 **JS 接口安全域名** 为你的部署域名
- 签名接口做了 access_token 和 jsapi_ticket 缓存，避免频繁请求微信服务器

## 迁移指南

整个 `composables/` 和 `server/` 目录可直接复制到其他 Nuxt 项目，只需：
1. 复制 `app/composables/` 下的微信相关 composables
2. 复制 `server/api/wechat/signature.ts`
3. 在目标项目的 `.env` 中配置 `WECHAT_APP_ID` 和 `WECHAT_APP_SECRET`
