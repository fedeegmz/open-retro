<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { BoardService } from '@/services/api/boardService'

const props = defineProps<{
  isAdmin: boolean
  serverUrl: string
  boardId: string
}>()

const emit = defineEmits<{
  'go-back': []
}>()

const { t } = useI18n()

const GRACE_SECONDS = 60
const countdown = ref(GRACE_SECONDS)
const isDataErased = ref(false)
let countdownInterval: ReturnType<typeof setInterval> | null = null

const adminWarning = computed(() =>
  t('session_expired.admin_warning', { seconds: countdown.value }),
)

onMounted(() => {
  if (!props.isAdmin) return

  countdownInterval = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      isDataErased.value = true
      stopCountdown()
    }
  }, 1000)
})

onUnmounted(stopCountdown)

function stopCountdown() {
  if (countdownInterval !== null) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

function exportBoard() {
  const boardService = new BoardService(props.serverUrl)
  boardService.exportBoard({
    boardId: props.boardId,
    onSuccess: (data) => {
      stopCountdown()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${props.boardId}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
  })
}
</script>

<template>
  <Teleport to="body">
    <!-- No @click.self to prevent closing. This is intentionally blocking. -->
    <div class="expired-backdrop">
      <div class="expired-card">
        <!-- Icon -->
        <div class="icon-wrap">
          <svg
            class="clock-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        <!-- Text -->
        <h2 class="title">{{ t('session_expired.title') }}</h2>
        <p class="description">{{ t('session_expired.description') }}</p>

        <!-- Admin-only section -->
        <div v-if="isAdmin" class="admin-section">
          <div v-if="!isDataErased" class="admin-warning">
            <span class="countdown-badge">{{ countdown }}s</span>
            <p class="warning-text">{{ adminWarning }}</p>
          </div>
          <p v-else class="erased-text">{{ t('session_expired.data_erased') }}</p>
        </div>

        <!-- Actions -->
        <div class="actions">
          <button v-if="isAdmin && !isDataErased" class="btn btn-export" @click="exportBoard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {{ t('session_expired.export_board') }}
          </button>

          <button class="btn btn-back" @click="emit('go-back')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {{ t('session_expired.go_back') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.expired-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 24px;
  animation: fadeIn 0.35s ease-out;
}

.expired-card {
  background: var(--color-background-soft);
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 24px;
  padding: 48px 40px;
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow:
    0 0 0 1px rgba(239, 68, 68, 0.15),
    0 40px 80px rgba(0, 0, 0, 0.6),
    0 0 60px rgba(239, 68, 68, 0.08);
  animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Icon */
.icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-ring 2s ease-in-out infinite;
}

.clock-icon {
  width: 36px;
  height: 36px;
  color: #ef4444;
}

/* Text */
.title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
  margin: 0;
  line-height: 1.3;
}

.description {
  font-size: 14px;
  color: var(--color-muted);
  text-align: center;
  margin: 0;
  line-height: 1.6;
}

/* Admin section */
.admin-section {
  width: 100%;
  background: rgba(239, 68, 68, 0.07);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-warning {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.countdown-badge {
  flex-shrink: 0;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: var(--font-mono);
  color: #ef4444;
  min-width: 48px;
  text-align: center;
}

.warning-text {
  font-size: 13px;
  color: rgba(239, 68, 68, 0.85);
  margin: 0;
  line-height: 1.5;
}

.erased-text {
  font-size: 13px;
  color: var(--color-muted);
  margin: 0;
  text-align: center;
  font-style: italic;
}

/* Actions */
.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 4px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.btn-export {
  background: var(--color-primary);
  color: #0f1117;
}

.btn-export:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(62, 175, 124, 0.35);
}

.btn-back {
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: var(--color-border-hover);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulse-ring {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.25);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
}
</style>
