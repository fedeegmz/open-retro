<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/atoms/BaseButton.vue'

const { t } = useI18n()
const isRunning = ref(false)
const minutes = ref('00')
const seconds = ref('00')
let intervalId: ReturnType<typeof setInterval> | null = null

const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

const startTimer = () => {
  const m = parseInt(minutes.value, 10) || 0
  const s = parseInt(seconds.value, 10) || 0

  if (m === 0 && s === 0) return

  isRunning.value = true

  intervalId = setInterval(() => {
    let currentMin = parseInt(minutes.value, 10) || 0
    let currentSec = parseInt(seconds.value, 10) || 0

    if (currentMin === 0 && currentSec === 0) {
      pauseTimer()
      // Play a sound or notify?
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

const pauseTimer = () => {
  isRunning.value = false
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const handleInput = (type: 'minutes' | 'seconds', event: Event) => {
  const target = event.target as HTMLInputElement
  let val = target.value.replace(/\D/g, '')

  if (val.length > 2) val = val.slice(-2)

  if (type === 'minutes') {
    minutes.value = val
  } else {
    const numStr = parseInt(val, 10) > 59 ? '59' : val
    seconds.value = numStr
  }
}

const formatOnBlur = (type: 'minutes' | 'seconds') => {
  if (type === 'minutes') {
    minutes.value = minutes.value.padStart(2, '0')
  } else {
    seconds.value = seconds.value.padStart(2, '0')
  }
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
    </div>

    <BaseButton
      class="timer-btn"
      @click="toggleTimer"
      :title="isRunning ? t('board.pause_timer') : t('board.start_timer')"
    >
      <!-- Play icon -->
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
      <!-- Pause icon -->
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
