<template>
  <div class="layout">
    <nav class="navbar">
      <NuxtLink to="/" class="brand">微信 JS-SDK 测试</NuxtLink>
      <div class="nav-links">
        <NuxtLink to="/" exact-active-class="active">SDK 状态</NuxtLink>
        <NuxtLink to="/share" active-class="active">分享</NuxtLink>
        <NuxtLink to="/image" active-class="active">图片</NuxtLink>
        <NuxtLink to="/location" active-class="active">地理位置</NuxtLink>
      </div>
    </nav>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  color: #333;
}
</style>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 24px;
  height: 48px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  font-weight: 700;
  font-size: 1rem;
  color: #1890ff;
  text-decoration: none;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  gap: 4px;
  overflow-x: auto;
}

.nav-links a {
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #666;
  text-decoration: none;
  transition: background 0.15s;
  white-space: nowrap;
}

.nav-links a:hover {
  background: #f0f0f0;
}

.nav-links a.active {
  background: #1890ff;
  color: #fff;
}

.main {
  flex: 1;
  padding: 20px;
}
</style>
