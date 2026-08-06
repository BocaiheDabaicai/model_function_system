<template>
  <div class="page">
    <h1>地理位置</h1>

    <div v-if="!isReady" class="tip-card">
      请先在 <NuxtLink to="/">SDK 状态</NuxtLink> 页面完成初始化
    </div>

    <section :class="['card', { disabled: !isReady }]">
      <h2>获取与查看位置</h2>
      <div class="btn-group">
        <button :disabled="!isReady" @click="handleGetLocation">获取当前位置</button>
        <button :disabled="!isReady || !location" @click="handleOpenMap">在地图中查看</button>
      </div>

      <div v-if="location" class="location-info">
        <div class="loc-row">
          <span class="loc-label">纬度</span>
          <span class="loc-value">{{ location.latitude }}</span>
        </div>
        <div class="loc-row">
          <span class="loc-label">经度</span>
          <span class="loc-value">{{ location.longitude }}</span>
        </div>
        <div v-if="location.accuracy" class="loc-row">
          <span class="loc-label">精度</span>
          <span class="loc-value">{{ location.accuracy }} 米</span>
        </div>
      </div>

      <p v-if="locationError" class="err">{{ locationError }}</p>
    </section>

    <section :class="['card', { disabled: !isReady }]">
      <h2>使用说明</h2>
      <ul class="desc-list">
        <li>使用 <code>getFuzzyLocation</code> API，首次调用会弹出微信授权弹窗</li>
        <li>返回 <code>wgs84</code> 坐标系的近似位置</li>
        <li>如需精确定位需在公众号后台申请位置权限后使用 <code>getLocation</code></li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
const { isReady } = useWechat()
const { getLocation, openLocation, currentLocation: location, lastError: locationError } = useWechatLocation()

const handleGetLocation = async () => {
  try {
    await getLocation()
  } catch { /* error handled in composable */ }
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

.location-info {
  background: #fafafa;
  border-radius: 4px;
  padding: 12px 16px;
  margin-top: 12px;
}
.loc-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 0.9rem; }
.loc-label { color: #666; }
.loc-value { font-weight: 600; font-family: monospace; }

.err { color: #ff4d4f; font-size: 0.85rem; margin: 8px 0 0; }

.desc-list { padding-left: 18px; font-size: 0.9rem; line-height: 1.8; color: #666; }
.desc-list code { background: #f5f5f5; padding: 1px 6px; border-radius: 3px; font-size: 0.85rem; }
</style>
