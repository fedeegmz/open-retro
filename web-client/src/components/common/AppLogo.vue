<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="logo" @click="router.push('/')">
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="var(--color-primary)" />
      <rect x="8" y="12" width="10" height="10" rx="2" fill="white" opacity="0.9" />
      <rect x="22" y="12" width="10" height="10" rx="2" fill="white" opacity="0.6" />
      <rect x="8" y="25" width="10" height="6" rx="2" fill="white" opacity="0.6" />
      <rect x="22" y="25" width="10" height="6" rx="2" fill="white" opacity="0.9" />
    </svg>
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
