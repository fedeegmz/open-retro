<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '@/composables/useUser'
import ToastContainer from '@/components/ToastContainer.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const { initializeUser } = useUser()

onMounted(() => {
  initializeUser()
})
</script>

<template>
  <AppHeader />
  <main class="main-content">
    <RouterView />
  </main>
  <ToastContainer />
</template>

<style>
.main-content {
  padding-top: var(--header-height, 64px);
}
</style>
