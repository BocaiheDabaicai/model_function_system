<template>
  <div class="page">
    <h1>自定义分享</h1>

    <div v-if="!isReady" class="tip-card">
      请先在 <NuxtLink to="/">SDK 状态</NuxtLink> 页面完成初始化
    </div>

    <section :class="['card', { disabled: !isReady }]">
      <h2>分享内容设置</h2>
      <div class="form-group">
        <label>分享标题</label>
        <input v-model="shareConfig.title" type="text" />
      </div>
      <div class="form-group">
        <label>分享描述</label>
        <input v-model="shareConfig.desc" type="text" />
      </div>
      <div class="form-group">
        <label>分享链接</label>
        <input v-model="shareConfig.link" type="text" />
      </div>
      <div class="form-group">
        <label>分享图标 URL</label>
        <input v-model="shareConfig.imgUrl" type="text" />
      </div>
      <button :disabled="!isReady" @click="handleSetShare">设置分享内容</button>
      <p v-if="shareError" class="err">{{ shareError }}</p>
      <p class="hint">设置后，点击右上角 "..." 可查看分享效果</p>
    </section>

    <section :class="['card', { disabled: !isReady }]">
      <h2>使用说明</h2>
      <ul class="desc-list">
        <li>分享图片需在已备案域名下才可正常显示</li>
        <li>分享链接域名需与 JS 接口安全域名一致</li>
        <li>该设置仅在当前页面有效，刷新后需重新设置</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
const { isReady } = useWechat()

const { setShare, lastShareError: shareError } = useWechatShare()

const shareConfig = reactive({
  title: '测试分享标题',
  desc: '测试分享描述',
  link: '',
  imgUrl: '',
})

const handleSetShare = () => {
  setShare({ ...shareConfig })
}

onMounted(() => {
  shareConfig.link = window.location.href
})
</script>

<style scoped>
.page { max-width: 600px; margin: 0 auto; }
h1 { text-align: center; font-size: 1.5rem; margin-bottom: 24px; }

.tip-card {
  background: #fff7e6;
  border: 1px solid #ffd591;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: #d46b08;
}
.tip-card a { color: #1890ff; }

.card {
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.card.disabled { opacity: 0.5; pointer-events: none; }
.card h2 { margin: 0 0 12px; font-size: 1.1rem; }

.form-group { margin-bottom: 10px; }
.form-group label { display: block; font-size: 0.85rem; color: #666; margin-bottom: 4px; }
.form-group input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

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

.hint { font-size: 0.8rem; color: #999; margin: 8px 0 0; }
.err { color: #ff4d4f; font-size: 0.85rem; margin: 8px 0 0; }

.desc-list { padding-left: 18px; font-size: 0.9rem; line-height: 1.8; color: #666; }
</style>
