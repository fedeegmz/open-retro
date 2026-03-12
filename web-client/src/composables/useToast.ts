import { ref } from 'vue'

interface Toast {
  id: number
  message: string
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  function show(message: string, duration = 4000) {
    const id = nextId++
    toasts.value.push({ id, message })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, duration)
  }

  return { toasts, show }
}
