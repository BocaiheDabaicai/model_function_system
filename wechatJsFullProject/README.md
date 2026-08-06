# WeChat JS-SDK Full Project

基于 Nuxt 4 的微信 JS-SDK 全栈功能模块，前端展示 + 后端签名接口一体化，可独立测试、可迁移复用。

## 技术栈

- **Nuxt 4** — Vue 3 全栈框架，内置 Nitro Server
- **Nitro Server** — 提供 `/api/wechat/signature` 签名接口（无需额外后端）
- **微信 JS-SDK 1.6.0** — 分享、图片、地理位置等原生能力
- **TypeScript** — 完整类型支持

## 项目结构

```
wechatJsFullProject/
├── app/
│   ├── app.vue                         # 根入口
│   ├── layouts/default.vue             # 导航栏布局（顶部路由切换）
│   ├── pages/
│   │   ├── index.vue                   # SDK 状态页（初始化 + 已注册 API 列表）
│   │   ├── share.vue                   # 分享功能页
│   │   ├── image.vue                   # 图片操作页
│   │   └── location.vue                # 地理位置页
│   ├── composables/
│   │   ├── useWechat.ts                # 核心：加载 SDK、wx.config、wx.ready（模块级单例）
│   │   ├── useWechatShare.ts           # 分享模块（朋友 + 朋友圈）
│   │   ├── useWechatImage.ts           # 图片模块（选图、预览、上传）
│   │   ├── useWechatLocation.ts        # 地理位置模块（获取位置、查看地图）
│   │   └── useWechatFull.ts           # 一键初始化全部模块
│   └── types/
│       └── wechat.d.ts                # window.wx 完整 TS 类型声明
├── server/
│   └── api/wechat/
│       └── signature.get.ts           # 后端签名接口（access_token → ticket → SHA1）
├── public/                             # 静态资源
├── nuxt.config.ts
└── package.json
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:3000）
npm run dev
```

## 微信 JS-SDK 工作流程

```
用户访问页面 → 前端调用 /api/wechat/signature → Nitro Server 生成签名
→ 前端 wx.config 注入 → wx.ready → 调用微信 API
```

## 环境变量

创建 `.env` 文件，配置微信公众号参数：

```env
NUXT_PUBLIC_WECHAT_APP_ID=你的公众号AppID
NUXT_WECHAT_APP_SECRET=你的公众号AppSecret
```

> AppSecret 仅存在于服务端，不会暴露到前端。

## 本地调试（推荐方案）

使用微信测试号 + ngrok 隧道，免备案、免验证文件：

1. 注册安装 [ngrok](https://ngrok.com)，启动隧道：
   ```bash
   ngrok http 3000
   ```

2. 扫码登录 [微信测试号平台](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)，获取测试号 AppID / AppSecret，填入 `.env`

3. 在测试号页面配置「JS 接口安全域名」为 ngrok 域名（无需上传验证文件）

4. 手机微信访问 ngrok 公网地址即可测试

> Vite 已配置允许 ngrok 域名（`.ngrok-free.app` / `.ngrok-free.dev`），无需额外改动。

## 功能模块

| 模块 | 页面 | 说明 | 核心 API |
|------|------|------|----------|
| SDK 初始化 | `/` | 加载 SDK、wx.config、等待 ready，注册全部 API | `useWechat()` |
| 自定义分享 | `/share` | 配置分享标题/描述/图片，引导用户通过 "···" 菜单分享 | `updateAppMessageShareData` / `updateTimelineShareData` |
| 图片操作 | `/image` | 拍照、选图、预览、上传到微信服务器 | `chooseImage` / `previewImage` / `uploadImage` |
| 地理位置 | `/location` | 获取近似位置（wgs84）、查看地图 | `getFuzzyLocation` / `openLocation` |

### 关键设计

- **状态共享**：`useWechat` 的 `isReady`/`isLoading`/`error` 为模块级单例，页面切换后 SDK 状态不丢失，只需初始化一次
- **松散耦合**：每个功能模块是独立的 composable，导出 `XXX_API_LIST` 常量，调用方可自由组合
- **分享机制**：微信不允许代码直接唤起分享弹窗，只能配置内容后引导用户通过右上角 "···" 菜单操作
- **位置 API**：使用 `getFuzzyLocation` 替代 `getLocation`，无需额外权限即可调用

## 迁移指南

整个 `composables/`、`server/` 和 `types/` 目录可直接复制到其他 Nuxt 项目，只需：

1. 复制 `app/composables/` 下的微信相关 composables
2. 复制 `app/types/wechat.d.ts`
3. 复制 `server/api/wechat/signature.get.ts`
4. 在目标项目的 `.env` 中配置 AppID 和 AppSecret
5. 在 `nuxt.config.ts` 中声明 `runtimeConfig`

## 注意事项

- 微信 JS-SDK 仅在**微信内置浏览器**中生效
- 正式公众号需配置 **JS 接口安全域名**，域名需通过 ICP 备案
- 签名接口做了 access_token 和 jsapi_ticket 内存缓存（提前 5 分钟刷新），避免频繁请求微信服务器
