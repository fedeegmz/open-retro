<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Navigator } from '@/router/navigator'

import { BoardService } from '@/services/api/boardService'
import { LocalStorageService } from '@/services/localStorageService'

const navigator = new Navigator(useRouter())

const serverUrl = ref('')
const boardId = ref(crypto.randomUUID())
const password = ref('')
const error = ref('')
const loading = ref(false)
const mode = ref<'create' | 'join'>('create')

onMounted(() => {
  const stored = LocalStorageService.getServerUrl()
  if (!stored) {
    navigator.toServerSetup()
    return
  }
  serverUrl.value = stored
})

async function createBoard() {
  error.value = ''
  loading.value = true

  try {
    await new BoardService(serverUrl.value).create(boardId.value, password.value)
    LocalStorageService.setBoardPassword(password.value)
    navigator.toBoard(boardId.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al comunicarse con el servidor.'
  } finally {
    loading.value = false
  }
}

async function joinBoard() {
  error.value = ''
  loading.value = true

  try {
    await new BoardService(serverUrl.value).getBoard(boardId.value, (msg) => {
      error.value = msg
    })
    LocalStorageService.setBoardPassword(password.value)
    navigator.toBoard(boardId.value)
  } catch {
    // error already set via onError callback
  } finally {
    loading.value = false
  }
}

function submit() {
  if (mode.value === 'create') createBoard()
  else joinBoard()
}

function newUUID() {
  return crypto.randomUUID()
}

function goBack() {
  navigator.toServerSetup()
}
</script>

<template>
  <div class="setup-layout">
    <div class="setup-card">
      <div class="header">
        <button class="back-btn" @click="goBack" title="Volver">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clip-rule="evenodd"
            />
          </svg>
          Volver
        </button>
        <div class="server-badge">
          <span class="dot" />
          {{ serverUrl }}
        </div>
      </div>

      <h1>{{ mode === 'create' ? 'Crear un board' : 'Unirse a un board' }}</h1>
      <p class="subtitle">
        {{
          mode === 'create'
            ? 'Creá un nuevo board vacío y protegelo con una contraseña.'
            : 'Ingresá el ID y la contraseña del board al que querés unirte.'
        }}
      </p>

      <div class="tab-group">
        <button
          :class="['tab', { active: mode === 'create' }]"
          @click="
            mode = 'create'
            error = ''
          "
        >
          Crear
        </button>
        <button
          :class="['tab', { active: mode === 'join' }]"
          @click="
            mode = 'join'
            error = ''
          "
        >
          Unirse
        </button>
      </div>

      <form @submit.prevent="submit" class="form">
        <div class="field">
          <div class="label-row">
            <label for="board-id">ID del board</label>
            <button
              v-if="mode === 'create'"
              type="button"
              class="regenerate-btn"
              @click="boardId = newUUID()"
              title="Generar nuevo ID"
            >
              Regenerar
            </button>
          </div>
          <input
            id="board-id"
            v-model="boardId"
            type="text"
            placeholder="ID del board"
            autocomplete="off"
            spellcheck="false"
            :disabled="loading"
          />
        </div>

        <div class="field">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Contraseña del board"
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

        <button type="submit" class="btn-primary" :disabled="loading || !boardId || !password">
          <span v-if="loading" class="spinner" />
          {{ loading ? 'Cargando...' : mode === 'create' ? 'Crear board' : 'Unirse al board' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.setup-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f0e8;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  padding: 24px;
}

.setup-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 12px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  flex-shrink: 0;
  transition: color 0.15s;
}

.back-btn:hover {
  color: #111827;
}

.server-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 220px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}

h1 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px;
  line-height: 1.5;
}

.tab-group {
  display: flex;
  background: #f3f4f6;
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
  color: #6b7280;
  transition:
    background 0.15s,
    color 0.15s;
}

.tab.active {
  background: white;
  color: #111827;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  color: #374151;
}

.regenerate-btn {
  font-size: 12px;
  font-weight: 500;
  color: #6366f1;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}

.regenerate-btn:hover {
  color: #4f46e5;
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
