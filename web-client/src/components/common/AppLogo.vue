<script setup lang="ts">
import { useRouter } from 'vue-router'
import logoSvg from '@open-retro/shared/assets/logo-icon.svg?raw'
const router = useRouter()
</script>

<template>
  <div class="logo" @click="router.push('/')">
    <div v-html="logoSvg" class="logo-icon"></div>
    <span class="logo-text">Open Retro</span>
  </div>
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon :deep(svg) {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.5px;
  background: linear-gradient(to right, var(--color-text), var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
