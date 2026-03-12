<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BoardCanvas from '../components/BoardCanvas.vue'
import { LocalStorageService } from '@/services/localStorageService'

const route = useRoute()
const router = useRouter()

const serverUrl = ref('')
const password = ref('')
const ready = ref(false)

onMounted(() => {
  const storedServer = LocalStorageService.getServerUrl()
  const storedPassword = LocalStorageService.getBoardPassword()

  if (!storedServer || !storedPassword) {
    router.replace('/')
    return
  }

  serverUrl.value = storedServer
  password.value = storedPassword
  ready.value = true
})

const boardId = route.params.id as string
</script>

<template>
  <BoardCanvas v-if="ready" :server-url="serverUrl" :board-id="boardId" :password="password" />
</template>
