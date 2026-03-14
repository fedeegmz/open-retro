<script setup lang="ts">
const props = defineProps<{
  showVisibilityToggle: boolean
  isNotesHidden: boolean
}>()

const emit = defineEmits<{
  addNote: []
  addGroup: []
  toggleVisibility: []
}>()
</script>

<template>
  <aside class="toolbar">
    <button class="tool-btn" title="Nueva nota" @click="emit('addNote')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
      <span class="tool-label">Nota</span>
    </button>

    <div class="divider" />

    <button class="tool-btn" title="Nuevo grupo" @click="emit('addGroup')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="4" />
        <rect x="6" y="6" width="5" height="5" rx="1" />
        <rect x="13" y="6" width="5" height="5" rx="1" />
        <rect x="6" y="13" width="5" height="5" rx="1" />
      </svg>
      <span class="tool-label">Grupo</span>
    </button>

    <template v-if="props.showVisibilityToggle">
      <div class="divider" />
      <button
        class="tool-btn"
        :title="props.isNotesHidden ? 'Mostrar notas' : 'Ocultar notas'"
        @click="emit('toggleVisibility')"
        :class="{ active: props.isNotesHidden }"
      >
        <svg
          v-if="props.isNotesHidden"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
          />
          <line x1="1" y1="1" x2="23" y2="23" />
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
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span class="tool-label">Notas</span>
      </button>
    </template>
  </aside>
</template>

<style scoped>
.toolbar {
  position: fixed;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  height: calc(100vh - 48px);
  max-height: 480px;
  width: 52px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.08),
    0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  gap: 4px;
  z-index: 100;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 40px;
  padding: 8px 0;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #44403c;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.tool-btn:hover {
  background-color: rgba(0, 0, 0, 0.06);
  color: #1c1917;
}

.tool-btn:active {
  background-color: rgba(0, 0, 0, 0.1);
}

.tool-btn.active {
  color: #ea580c;
  background-color: rgba(234, 88, 12, 0.1);
}

.tool-btn svg {
  width: 20px;
  height: 20px;
}

.tool-label {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1;
}

.divider {
  width: 28px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.08);
  margin: 2px 0;
}
</style>
