<script setup lang="ts">
import AppHeader from '@/components/organisms/AppHeader.vue'
</script>

<template>
  <div class="base-layout">
    <AppHeader />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.base-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding-top: var(--header-height, 64px);
}
</style>
