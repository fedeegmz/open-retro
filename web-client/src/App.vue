<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '@/composables/useUser'
import ToastContainer from '@/components/organisms/ToastContainer.vue'
import BaseLayout from '@/components/templates/BaseLayout.vue'

const { initializeUser } = useUser()

onMounted(() => {
  initializeUser()
})
</script>

<template>
  <BaseLayout>
    <RouterView />
  </BaseLayout>
  <ToastContainer />
</template>

<style>
/* Estilos globales y reseteos generales si existiesen */
</style>
