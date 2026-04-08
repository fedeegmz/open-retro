<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Navigator } from '@/router/navigator'

import { BoardService } from '@/services/api/boardService'
import { LocalStorageService } from '@/services/localStorageService'
import { getConfig } from '@/config/config'
import { newUUID } from '@/utils/stringUtils'
import ServerUrlModal from '@/components/ServerUrlModal.vue'

import { useI18n } from 'vue-i18n'

type Mode = 'create' | 'join'

const { t } = useI18n()
const navigator = new Navigator(useRouter())

const boardId = ref(newUUID())
const password = ref('')
const username = ref(LocalStorageService.getUsername() ?? '')
const error = ref('')
const loading = ref(false)
const mode = ref<Mode>('create')
const showServerUrlModal = ref(false)

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/

const usernameError = computed(() => {
  if (!username.value) return ''
  return USERNAME_REGEX.test(username.value) ? '' : t('setup.username_error')
})

const isUsernameValid = computed(
  () => username.value.length >= 3 && USERNAME_REGEX.test(username.value),
)

function onUsernameInput(e: Event) {
  const cleaned = (e.target as HTMLInputElement).value.replace(/[^a-zA-Z0-9_-]/g, '')
  username.value = cleaned
}

function onSuccess() {
  LocalStorageService.setBoardPassword(password.value)
  LocalStorageService.setUsername(username.value.trim())
  navigator.toBoard(boardId.value)
}

function onError(msg: string) {
  error.value = msg
}

async function submit() {
  error.value = ''

  const url = LocalStorageService.getServerUrl() ?? getConfig().defaultServerUrl
  if (!url) {
    showServerUrlModal.value = true
    return
  }

  if (!LocalStorageService.getServerUrl()) {
    LocalStorageService.setServerUrl(url)
  }

  loading.value = true

  const service = new BoardService(url)
  const params = {
    boardId: boardId.value,
    password: password.value,
    clientId: LocalStorageService.getClientId(),
    onSuccess,
    onError,
  }

  switch (mode.value) {
    case 'create':
      await service.create(params)
      break
    case 'join':
      await service.join(params)
      break
    default:
      break
  }

  loading.value = false
}

function onServerUrlSuccess() {
  showServerUrlModal.value = false
  submit()
}

function setMode(m: Mode) {
  mode.value = m
  error.value = ''
}
</script>

<template>
  <div class="setup-layout">
    <div class="setup-card">
      <div class="logo">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="var(--color-primary)" />
          <rect x="8" y="12" width="10" height="10" rx="2" fill="white" opacity="0.9" />
          <rect x="22" y="12" width="10" height="10" rx="2" fill="white" opacity="0.6" />
          <rect x="8" y="25" width="10" height="6" rx="2" fill="white" opacity="0.6" />
          <rect x="22" y="25" width="10" height="6" rx="2" fill="white" opacity="0.9" />
        </svg>
        <span class="logo-text">{{ t('setup.title') }}</span>
      </div>

      <h1>{{ mode === 'create' ? t('setup.create_board') : t('setup.join_board') }}</h1>
      <p class="subtitle">
        {{ mode === 'create' ? t('setup.create_desc') : t('setup.join_desc') }}
      </p>

      <div class="tab-group">
        <button :class="['tab', { active: mode === 'create' }]" @click="setMode('create')">
          {{ t('setup.create_tab') }}
        </button>
        <button :class="['tab', { active: mode === 'join' }]" @click="setMode('join')">
          {{ t('setup.join_tab') }}
        </button>
      </div>

      <form @submit.prevent="submit" class="form">
        <div class="field">
          <label for="username">{{ t('setup.username_label') }}</label>
          <input
            id="username"
            :value="username"
            type="text"
            :placeholder="t('setup.username_placeholder')"
            autocomplete="off"
            :disabled="loading"
            @input="onUsernameInput"
          />
          <span v-if="usernameError" class="field-error">{{ usernameError }}</span>
        </div>

        <div class="field">
          <div class="label-row">
            <label for="board-id">{{ t('setup.board_id_label') }}</label>
            <button
              v-if="mode === 'create'"
              type="button"
              class="regenerate-btn"
              @click="boardId = newUUID()"
              :title="t('setup.generate_id_title')"
            >
              {{ t('setup.regenerate') }}
            </button>
          </div>
          <input
            id="board-id"
            v-model="boardId"
            type="text"
            :placeholder="t('setup.board_id_placeholder')"
            autocomplete="off"
            spellcheck="false"
            :disabled="loading"
          />
        </div>

        <div class="field">
          <label for="password">{{ t('setup.password_label') }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="t('setup.password_placeholder')"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-banner">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clip-rule="evenodd"
            />
          </svg>
          {{ error }}
        </div>

        <button
          type="submit"
          class="btn-primary"
          :disabled="loading || !boardId || !password || !isUsernameValid"
        >
          <span v-if="loading" class="spinner" />
          {{
            loading
              ? t('common.loading')
              : mode === 'create'
                ? t('setup.submit_create')
                : t('setup.submit_join')
          }}
        </button>
      </form>
    </div>
  </div>

  <ServerUrlModal v-if="showServerUrlModal" @success="onServerUrlSuccess" />
</template>
emplate>

<style scoped>
.setup-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-background);
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 24px 24px;
  padding: 24px;
}

.setup-card {
  background: var(--color-background-soft);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.3px;
}

h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 8px;
}

.subtitle {
  font-size: 14px;
  color: var(--color-muted);
  margin: 0 0 24px;
  line-height: 1.5;
}

.tab-group {
  display: flex;
  background: var(--color-background-mute);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
  margin-bottom: 20px;
}

.tab {
  flex: 1;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
  color: var(--color-muted);
  transition:
    background 0.15s,
    color 0.15s;
}

.tab.active {
  background: var(--color-background-soft);
  color: var(--color-text);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.regenerate-btn {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}

.regenerate-btn:hover {
  color: var(--color-primary-light);
}

input {
  padding: 10px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  font-family: var(--font-mono);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.15s;
  background: rgba(255, 255, 255, 0.03);
}

input:focus {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.05);
}

input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.field-error {
  font-size: 12px;
  color: #e5484d;
}

.error-banner {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(229, 72, 77, 0.1);
  border: 1px solid rgba(229, 72, 77, 0.2);
  border-radius: 8px;
  font-size: 13px;
  color: #e5484d;
  line-height: 1.5;
}

.error-banner svg {
  flex-shrink: 0;
  margin-top: 1px;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 20px;
  background: var(--color-primary);
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background 0.15s,
    opacity 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-light);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
