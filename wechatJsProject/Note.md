# 操作记录

> 备注信息：你先读取一下项目，了解一下项目当前的情况，我打算用这个项目做微信JS-SDK的功能模块，测试功能，功能构建好之后，可以迁移到其他项目上直接进行使用

#### 日期：2026年8月5日

- 你先读取一下项目，了解一下项目当前的情况

- 之前有项目在打包构建的时候，配置了环境变量`BASE_SERVICE='https://salebussiness.nanfangruye.com:31112/prod-api'`，然后在`vite.config.js`文件下做了这样的操作
  
  - ```js
    server: {
                open: false,
                proxy: {
                    '/prod-api': {
                        target: BASE_SERVICE,
                        changeOrigin: true,
                        rewrite: (p) => p.replace(/^\/prod-api/, '')
                    },
                    // 高德地图API地址代理，解决跨域问题
                    '/gaode-api': {
                        target: BASE_SERVICE,
                        changeOrigin: true,
                        rewrite: (p) => p.replace(/^\/prod-api/, '')
                    }
                }
            },
    ```
  
  - 那么，在这个项目里面，如果我只是做对接微信JS-SDK的工作，我还需要配置这些内容吗？

- 我打算用这个项目做微信JS-SDK的功能模块，测试功能，功能构建好之后，可以迁移到其他项目上直接进行使用

- 我觉得有签名应该要好一些，要不我就弄一个nuxt项目来做这些工作，重新开一个项目，你觉得如何？

- 好了，我已经在项目的根目录下生成一个nuxt项目，名称叫做`wechatJsFullProject`，你看看，顺便为这个项目生成一个`README.md`文件

- 开始做准备工作吧，旧的项目就不管它了

- 我在本地进行测试，为什么界面一直卡在加载中？


