<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/atoms/BaseButton.vue'
import type { TimerState } from '@open-retro/shared/types/board'

const props = defineProps<{
  isOwner: boolean
  syncState: TimerState
}>()

const emit = defineEmits<{
  (e: 'sync', state: TimerState): void
}>()

const { t } = useI18n()
const isRunning = ref(false)
const minutes = ref('00')
const seconds = ref('00')
let intervalId: ReturnType<typeof setInterval> | null = null

watch(
  () => props.syncState,
  (newState) => {
    if (!newState) return
    minutes.value = newState.minutes
    seconds.value = newState.seconds

    if (newState.isRunning && !isRunning.value) {
      isRunning.value = true
      startLocalInterval()
    } else if (!newState.isRunning && isRunning.value) {
      pauseLocalInterval()
    }
  },
  { deep: true, immediate: true },
)

const emitSync = () => {
  if (!props.isOwner) return
  emit('sync', {
    minutes: minutes.value,
    seconds: seconds.value,
    isRunning: isRunning.value,
  })
}

const toggleTimer = () => {
  if (!props.isOwner) return
  if (isRunning.value) {
    pauseLocalInterval()
  } else {
    // Only start if there is time
    const m = parseInt(minutes.value, 10) || 0
    const s = parseInt(seconds.value, 10) || 0
    if (m === 0 && s === 0) return

    isRunning.value = true
    startLocalInterval()
  }
  emitSync()
}

const startLocalInterval = () => {
  if (intervalId) {
    clearInterval(intervalId)
  }

  intervalId = setInterval(() => {
    let currentMin = parseInt(minutes.value, 10) || 0
    let currentSec = parseInt(seconds.value, 10) || 0

    if (currentMin === 0 && currentSec === 0) {
      pauseLocalInterval()
      if (props.isOwner) emitSync()
      return
    }

    if (currentSec === 0) {
      currentMin--
      currentSec = 59
    } else {
      currentSec--
    }

    minutes.value = currentMin.toString().padStart(2, '0')
    seconds.value = currentSec.toString().padStart(2, '0')
  }, 1000)
}

const pauseLocalInterval = () => {
  isRunning.value = false
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const handleInput = (type: 'minutes' | 'seconds', event: Event) => {
  if (!props.isOwner) return
  const target = event.target as HTMLInputElement
  let val = target.value.replace(/\D/g, '')

  if (val.length > 2) val = val.slice(-2)

  if (type === 'minutes') {
    minutes.value = val
  } else {
    const numStr = parseInt(val, 10) > 59 ? '59' : val
    seconds.value = numStr
  }
  emitSync()
}

const formatOnBlur = (type: 'minutes' | 'seconds') => {
  if (!props.isOwner) return
  if (type === 'minutes') {
    minutes.value = minutes.value.padStart(2, '0')
  } else {
    seconds.value = seconds.value.padStart(2, '0')
  }
  emitSync()
}

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="timer-card">
    <div class="time-inputs">
      <template v-if="isOwner">
        <input
          v-model="minutes"
          type="text"
          class="time-input"
          :disabled="isRunning"
          @input="handleInput('minutes', $event)"
          @blur="formatOnBlur('minutes')"
        />
        <span class="separator">:</span>
        <input
          v-model="seconds"
          type="text"
          class="time-input"
          :disabled="isRunning"
          @input="handleInput('seconds', $event)"
          @blur="formatOnBlur('seconds')"
        />
      </template>
      <template v-else>
        <span class="time-input readonly" :class="{ 'is-running': isRunning }">{{ minutes }}</span>
        <span class="separator">:</span>
        <span class="time-input readonly" :class="{ 'is-running': isRunning }">{{ seconds }}</span>
      </template>
    </div>

    <BaseButton
      v-if="isOwner"
      class="timer-btn"
      @click="toggleTimer"
      :title="isRunning ? t('board.pause_timer') : t('board.start_timer')"
    >
      <svg
        v-if="!isRunning"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon play"
      >
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon pause"
      >
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    </BaseButton>
  </div>
</template>

<style scoped>
.timer-card {
  position: fixed;
  top: calc(var(--header-height, 64px) + 16px);
  left: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(22, 27, 37, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 8px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.time-inputs {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-family: monospace;
  font-weight: bold;
  color: var(--color-text);
}

.time-input {
  width: 36px;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  text-align: center;
  outline: none;
  padding: 0;
}

.time-input.readonly {
  display: inline-block;
  min-width: 36px;
  text-align: center;
}

.time-input.readonly.is-running {
  color: var(--color-primary);
}

.time-input:disabled {
  color: var(--color-primary);
  opacity: 1;
}

.time-input:focus {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.separator {
  margin: 0 2px;
  color: var(--color-text);
  opacity: 0.5;
}

.timer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  color: var(--color-text);
  transition: all 0.2s ease;
}

.timer-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-primary);
}

.icon {
  width: 16px;
  height: 16px;
}
</style>
