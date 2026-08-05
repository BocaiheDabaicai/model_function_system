<template>
  <div class="page">
    <h1>微信 JS-SDK 功能测试</h1>

    <!-- 状态面板 -->
    <section class="card">
      <h2>SDK 状态</h2>
      <div class="status-row">
        <span class="label">状态</span>
        <span v-if="isLoading" class="badge badge-yellow">加载中...</span>
        <span v-else-if="isReady" class="badge badge-green">已就绪</span>
        <span v-else class="badge badge-red">未初始化</span>
      </div>
      <div v-if="errorText" class="error-box">{{ errorText }}</div>
      <button :disabled="isLoading" @click="handleInit">初始化 SDK</button>
    </section>

    <!-- 分享 -->
    <section :class="['card', { disabled: !isReady }]">
      <h2>自定义分享</h2>
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
      <p class="hint">设置后，点击右上角 "..." 查看分享效果</p>
    </section>

    <!-- 图片 -->
    <section :class="['card', { disabled: !isReady }]">
      <h2>图片操作</h2>
      <div class="btn-group">
        <button :disabled="!isReady" @click="handleChooseImage">拍照 / 选图</button>
        <button :disabled="!isReady" @click="handleUploadImage">上传图片</button>
      </div>
      <div v-if="images.length" class="img-preview">
        <div v-for="(img, i) in images" :key="i" class="img-item" @click="handlePreview(img)">
          <img :src="img" alt="selected" />
        </div>
      </div>
      <p v-if="imageError" class="err">{{ imageError }}</p>
      <p v-if="uploadedIds.length" class="info">已上传 serverId: {{ uploadedIds.join(', ') }}</p>
    </section>

    <!-- 地理位置 -->
    <section :class="['card', { disabled: !isReady }]">
      <h2>地理位置</h2>
      <div class="btn-group">
        <button :disabled="!isReady" @click="handleGetLocation">获取位置</button>
        <button :disabled="!isReady || !location" @click="handleOpenMap">查看地图</button>
      </div>
      <div v-if="location" class="info">
        <p>纬度: {{ location.latitude }}</p>
        <p>经度: {{ location.longitude }}</p>
      </div>
      <p v-if="locationError" class="err">{{ locationError }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
const {
  isLoading,
  isReady,
  error: errorText,
  initWechat,
} = useWechat()

const { setShare, lastShareError: shareError } = useWechatShare()
const { chooseImage, previewImage, uploadImage, selectedImages: images, uploadedServerIds: uploadedIds, lastError: imageError } = useWechatImage()
const { getLocation, openLocation, currentLocation: location, lastError: locationError } = useWechatLocation()

const shareConfig = reactive({
  title: '测试分享标题',
  desc: '测试分享描述',
  link: '',
  imgUrl: '',
})

const handleInit = async () => {
  const allApiList = [
    ...SHARE_API_LIST,
    ...IMAGE_API_LIST,
    ...LOCATION_API_LIST,
  ]
  await initWechat({ jsApiList: allApiList, debug: true })
  shareConfig.link = window.location.href
}

const handleSetShare = () => {
  setShare({ ...shareConfig })
}

const handleChooseImage = async () => {
  try {
    await chooseImage(9)
  } catch { /* error handled via composable */ }
}

const handleUploadImage = async () => {
  if (!images.value.length) return
  try {
    await uploadImage(images.value[0])
  } catch { /* error handled via composable */ }
}

const handlePreview = (url: string) => {
  previewImage(url)
}

const handleGetLocation = async () => {
  try {
    await getLocation()
  } catch { /* error handled via composable */ }
}

const handleOpenMap = () => {
  if (!location.value) return
  openLocation({
    latitude: location.value.latitude,
    longitude: location.value.longitude,
    name: '当前位置',
    address: '',
  })
}
</script>

<style scoped>
.page { max-width: 600px; margin: 0 auto; padding: 20px; }
h1 { text-align: center; font-size: 1.5rem; margin-bottom: 24px; }

.card {
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.card.disabled { opacity: 0.6; }
.card h2 { margin: 0 0 12px; font-size: 1.1rem; }

.status-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.label { font-weight: 600; min-width: 40px; }

.badge { padding: 2px 10px; border-radius: 12px; font-size: 0.85rem; color: #fff; }
.badge-green { background: #52c41a; }
.badge-yellow { background: #faad14; }
.badge-red { background: #d9d9d9; color: #666; }

.error-box { background: #fff2f0; border: 1px solid #ffccc7; color: #ff4d4f; padding: 8px 12px; border-radius: 4px; margin-bottom: 8px; font-size: 0.85rem; }

.form-group { margin-bottom: 10px; }
.form-group label { display: block; font-size: 0.85rem; color: #666; margin-bottom: 4px; }
.form-group input { width: 100%; padding: 6px 10px; border: 1px solid #d9d9d9; border-radius: 4px; font-size: 0.9rem; box-sizing: border-box; }

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

.hint { font-size: 0.8rem; color: #999; margin: 8px 0 0; }
.err { color: #ff4d4f; font-size: 0.85rem; margin: 8px 0 0; }
.info { font-size: 0.85rem; color: #52c41a; margin: 8px 0 0; word-break: break-all; }

.img-preview { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.img-item { width: 80px; height: 80px; border-radius: 4px; overflow: hidden; cursor: pointer; }
.img-item img { width: 100%; height: 100%; object-fit: cover; }
</style>
