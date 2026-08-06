<template>
  <div class="page">
    <h1>图片操作</h1>

    <div v-if="!isReady" class="tip-card">
      请先在 <NuxtLink to="/">SDK 状态</NuxtLink> 页面完成初始化
    </div>

    <section :class="['card', { disabled: !isReady }]">
      <h2>选择与上传</h2>
      <div class="btn-group">
        <button :disabled="!isReady" @click="handleChooseImage">拍照 / 选图</button>
        <button :disabled="!isReady || !selectedImages.length" @click="handleUploadFirst">上传图片</button>
      </div>

      <div v-if="selectedImages.length" class="img-preview">
        <p class="sub-label">已选图片 ({{ selectedImages.length }})</p>
        <div class="img-grid">
          <div
            v-for="(img, i) in selectedImages"
            :key="i"
            class="img-item"
            @click="handlePreview(img)"
          >
            <img :src="img" alt="selected" />
          </div>
        </div>
      </div>

      <p v-if="imageError" class="err">{{ imageError }}</p>
    </section>

    <section v-if="uploadedServerIds.length" :class="['card', { disabled: !isReady }]">
      <h2>已上传文件</h2>
      <div class="server-ids">
        <p v-for="(id, i) in uploadedServerIds" :key="i" class="server-id">
          serverId: <code>{{ id }}</code>
        </p>
      </div>
      <p class="hint">serverId 有效期 3 天，可用于服务端下载图片</p>
    </section>

    <section :class="['card', { disabled: !isReady }]">
      <h2>使用说明</h2>
      <ul class="desc-list">
        <li><code>chooseImage</code> 在非微信环境下无法使用</li>
        <li><code>uploadImage</code> 将图片上传到微信服务器，返回 serverId</li>
        <li>服务端可通过 serverId 调用临时素材接口下载图片</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
const { isReady } = useWechat()
const {
  chooseImage,
  previewImage,
  uploadImage,
  selectedImages,
  uploadedServerIds,
  lastError: imageError,
} = useWechatImage()

const handleChooseImage = async () => {
  try {
    await chooseImage(9)
  } catch { /* error handled in composable */ }
}

const handleUploadFirst = async () => {
  if (!selectedImages.value.length) return
  try {
    await uploadImage(selectedImages.value[0])
  } catch { /* error handled in composable */ }
}

const handlePreview = (url: string) => {
  previewImage(url)
}
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

.btn-group { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }

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

.sub-label { font-size: 0.85rem; color: #666; margin-bottom: 8px; }

.img-grid { display: flex; gap: 8px; flex-wrap: wrap; }
.img-item {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.15s;
}
.img-item:hover { border-color: #1890ff; }
.img-item img { width: 100%; height: 100%; object-fit: cover; }

.server-ids { margin-top: 8px; }
.server-id { font-size: 0.85rem; margin: 4px 0; }
.server-id code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; word-break: break-all; }

.err { color: #ff4d4f; font-size: 0.85rem; margin: 8px 0 0; }
.hint { font-size: 0.8rem; color: #999; margin: 8px 0 0; }

.desc-list { padding-left: 18px; font-size: 0.9rem; line-height: 1.8; color: #666; }
.desc-list code { background: #f5f5f5; padding: 1px 6px; border-radius: 3px; font-size: 0.85rem; }
</style>
