<script setup lang="ts">
import { ref } from 'vue'
import { ServerService } from '@/services/api/serverService'
import { LocalStorageService } from '@/services/localStorageService'

const emit = defineEmits<{ success: [] }>()

const serverUrl = ref(LocalStorageService.getServerUrl() ?? '')
const error = ref('')
const loading = ref(false)

async function confirm() {
  error.value = ''
  loading.value = true

  await new ServerService(serverUrl.value).ping({
    onSuccess: () => {
      LocalStorageService.setServerUrl(serverUrl.value)
      emit('success')
    },
    onError: (msg: string) => {
      error.value = msg
    },
  })

  loading.value = false
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop">
      <div class="modal-card">
        <h2>Configurar servidor</h2>
        <p class="subtitle">Ingresá la URL del servidor WebSocket al que querés conectarte.</p>

        <form @submit.prevent="confirm" class="form">
          <div class="field">
            <label for="server-url">URL del servidor</label>
            <input
              id="server-url"
              v-model="serverUrl"
              type="text"
              placeholder="ws://mi-servidor:3001"
              autocomplete="off"
              spellcheck="false"
              :disabled="loading"
              autofocus
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

          <button type="submit" class="btn-primary" :disabled="loading || !serverUrl">
            <span v-if="loading" class="spinner" />
            {{ loading ? 'Conectando...' : 'Conectar' }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
}

h2 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 28px;
  line-height: 1.5;
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

label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

input {
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: #111827;
  outline: none;
  transition: border-color 0.15s;
  background: #fafafa;
}

input:focus {
  border-color: #6366f1;
  background: white;
}

input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-banner {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 13px;
  color: #b91c1c;
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
  background: #6366f1;
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
  background: #4f46e5;
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
