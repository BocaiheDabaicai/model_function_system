<template>
  <div class="page">
    <h1>SDK 状态</h1>

    <section class="card">
      <h2>初始化</h2>
      <div class="status-row">
        <span class="label">状态</span>
        <span v-if="isLoading" class="badge badge-yellow">加载中...</span>
        <span v-else-if="isReady" class="badge badge-green">已就绪</span>
        <span v-else class="badge badge-red">未初始化</span>
      </div>
      <div v-if="errorText" class="error-box">{{ errorText }}</div>
      <button :disabled="isLoading" @click="handleInit">初始化 SDK</button>
    </section>

    <section v-if="isReady" class="card">
      <h2>已注册 API</h2>
      <div class="api-tags">
        <span v-for="api in initedApiList" :key="api" class="api-tag">{{ api }}</span>
      </div>
      <p v-if="!initedApiList.length" class="hint">尚未注册任何 API</p>
    </section>

    <section class="card">
      <h2>环境说明</h2>
      <ul class="desc-list">
        <li>需要在微信内置浏览器中打开</li>
        <li>需要在公众号后台配置 JS 接口安全域名</li>
        <li>需要在 <code>.env</code> 中配置 AppID 和 AppSecret</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
const { isLoading, isReady, error: errorText, initedApiList, initWechat } = useWechat()

const handleInit = async () => {
  await initWechat({
    jsApiList: ALL_WECHAT_API_LIST,
    debug: true,
  })
}
</script>

<style scoped>
.page { max-width: 600px; margin: 0 auto; }
h1 { text-align: center; font-size: 1.5rem; margin-bottom: 24px; }

.card {
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.card h2 { margin: 0 0 12px; font-size: 1.1rem; }

.status-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.label { font-weight: 600; min-width: 40px; }

.badge { padding: 2px 10px; border-radius: 12px; font-size: 0.85rem; color: #fff; }
.badge-green { background: #52c41a; }
.badge-yellow { background: #faad14; }
.badge-red { background: #d9d9d9; color: #666; }

.error-box { background: #fff2f0; border: 1px solid #ffccc7; color: #ff4d4f; padding: 8px 12px; border-radius: 4px; margin-bottom: 8px; font-size: 0.85rem; }

button {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  background: #1890ff;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
}
button:disabled { background: #d9d9d9; cursor: not-allowed; }
button:hover:not(:disabled) { background: #40a9ff; }

.api-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.api-tag {
  padding: 2px 10px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 3px;
  font-size: 0.8rem;
  font-family: monospace;
}

.hint { font-size: 0.8rem; color: #999; margin: 8px 0 0; }

.desc-list { padding-left: 18px; font-size: 0.9rem; line-height: 1.8; color: #666; }
.desc-list code { background: #f5f5f5; padding: 1px 6px; border-radius: 3px; font-size: 0.85rem; }
</style>
