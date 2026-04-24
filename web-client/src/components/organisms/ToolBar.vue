<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/atoms/BaseButton.vue'

const props = defineProps<{
  isNotesHidden: boolean
  isOwner: boolean
  voting?: { active: boolean; maxVotesPerUser: number }
}>()

const emit = defineEmits<{
  addNote: []
  addGroup: []
  toggleVisibility: []
  exportBoard: []
  importBoard: []
  startVoting: [maxVotes: number]
  pauseVoting: []
  resetVoting: []
  leave: []
}>()

const { t } = useI18n()

function toggleVoting() {
  if (props.voting?.active) {
    emit('pauseVoting')
  } else {
    const votes = window.prompt(
      t('board.votes_per_user_prompt'),
      props.voting?.maxVotesPerUser ? String(props.voting?.maxVotesPerUser) : '3',
    )
    if (votes === null) return
    const max = parseInt(votes, 10)
    if (!isNaN(max) && max > 0) {
      emit('startVoting', max)
    }
  }
}

function clearVoting() {
  if (confirm(t('board.confirm_reset_voting'))) {
    emit('resetVoting')
  }
}
</script>

<template>
  <aside class="toolbar">
    <BaseButton class="tool-btn" :title="t('board.create_note')" @click="emit('addNote')">
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
      <span class="tool-label">{{ t('board.note') }}</span>
    </BaseButton>

    <div class="divider" />

    <BaseButton class="tool-btn" :title="t('board.create_group')" @click="emit('addGroup')">
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
      <span class="tool-label">{{ t('board.group') }}</span>
    </BaseButton>

    <template v-if="props.isOwner">
      <div class="divider" />
      <BaseButton
        class="tool-btn"
        :title="props.isNotesHidden ? t('board.show_notes') : t('board.hide_notes')"
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
        <span class="tool-label">{{ t('board.note') }}</span>
      </BaseButton>

      <BaseButton
        class="tool-btn"
        :title="props.voting?.active ? t('board.pause_voting') : t('board.start_voting')"
        @click="toggleVoting"
        :class="{ active: props.voting?.active }"
      >
        <svg
          v-if="props.voting?.active"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
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
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span class="tool-label">{{ t('board.vote') }}</span>
      </BaseButton>

      <BaseButton class="tool-btn danger" :title="t('board.reset_voting')" @click="clearVoting">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <span class="tool-label">{{ t('board.clear') }}</span>
      </BaseButton>
    </template>

    <div class="spacer"></div>

    <template v-if="props.isOwner">
      <div class="divider" />

      <BaseButton class="tool-btn" :title="t('board.export_json')" @click="emit('exportBoard')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span class="tool-label">{{ t('board.export') }}</span>
      </BaseButton>

      <BaseButton class="tool-btn" :title="t('board.import_json')" @click="emit('importBoard')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span class="tool-label">{{ t('board.import') }}</span>
      </BaseButton>
    </template>

    <div class="divider" />

    <BaseButton class="tool-btn leave-btn" :title="t('board.leave_board')" @click="emit('leave')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      <span class="tool-label">{{ t('board.leave') }}</span>
    </BaseButton>
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
  background: rgba(22, 27, 37, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
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
  color: var(--color-muted);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.tool-btn:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--color-text);
}

.tool-btn:active {
  background-color: rgba(255, 255, 255, 0.12);
}

.tool-btn.active {
  color: var(--color-primary);
  background-color: rgba(62, 175, 124, 0.15);
}

.tool-btn.danger:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
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
  background-color: var(--color-border);
  margin: 2px 0;
}

.spacer {
  flex: 1;
}

.leave-btn:hover {
  color: #dc2626 !important;
  background-color: rgba(220, 38, 38, 0.1) !important;
}
</style>
