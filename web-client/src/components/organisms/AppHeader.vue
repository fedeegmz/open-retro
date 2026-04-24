<script setup lang="ts">
import AppLogo from '@/components/atoms/AppLogo.vue'
import UserMenu from '@/components/molecules/UserMenu.vue'
</script>

<template>
  <header class="main-header">
    <div class="header-content">
      <AppLogo />
      <div class="spacer" />
      <UserMenu />
    </div>
  </header>
</template>

<style scoped>
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(var(--color-background-rgb, 18, 18, 18), 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
}

.spacer {
  flex: 1;
}

:root {
  --header-height: 64px;
}
</style>
