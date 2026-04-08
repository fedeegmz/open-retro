<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import ContextMenu, { type ContextMenuItem } from './ContextMenu.vue'

import { useI18n } from 'vue-i18n'

const props = defineProps<{
  x: number
  y: number
  width: number
  height: number
  text: string
  isOwner: boolean
  isHidden?: boolean
}>()

const emit = defineEmits<{
  dragStart: [event: MouseEvent]
  bringToFront: []
  delete: []
  resize: [payload: { width: number; height: number }]
  edit: [text: string]
}>()

const { t } = useI18n()
const localWidth = ref(props.width)
const localHeight = ref(props.height)
const localText = ref(props.text)
const isEditing = ref(false)
const textarea = ref<HTMLTextAreaElement | null>(null)

let isResizing = false

watch(
  () => props.width,
  (v) => {
    if (!isResizing) localWidth.value = v
  },
)
watch(
  () => props.height,
  (v) => {
    if (!isResizing) localHeight.value = v
  },
)
watch(
  () => props.text,
  (v) => {
    if (!isEditing.value) localText.value = v
  },
)

const contextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)

const contextMenuItems: ContextMenuItem[] = [
  {
    label: t('board.delete_note'),
    danger: true,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
    action: () => emit('delete'),
  },
]

function openContextMenu(event: MouseEvent) {
  if (!props.isOwner) return
  event.preventDefault()
  event.stopPropagation()
  contextMenuX.value = event.clientX
  contextMenuY.value = event.clientY
  contextMenuVisible.value = true
}

const MIN_SIZE = 120
let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0

async function enableEditing() {
  if (!props.isOwner) return
  isEditing.value = true
  await nextTick()
  textarea.value?.focus()
}

function disableEditing() {
  isEditing.value = false
  if (localText.value !== props.text) {
    emit('edit', localText.value)
  }
}

function onMouseDown(event: MouseEvent) {
  if (isEditing.value) return
  event.stopPropagation()
  emit('bringToFront')
  emit('dragStart', event)
}

function startResize(event: MouseEvent) {
  if (!props.isOwner) return
  event.preventDefault()
  event.stopPropagation()

  emit('bringToFront')
  isResizing = true
  startX = event.clientX
  startY = event.clientY
  startWidth = localWidth.value
  startHeight = localHeight.value

  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
}

function onResize(event: MouseEvent) {
  if (!isResizing) return
  localWidth.value = Math.max(MIN_SIZE, startWidth + (event.clientX - startX))
  localHeight.value = Math.max(MIN_SIZE, startHeight + (event.clientY - startY))
}

function stopResize() {
  isResizing = false
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
  emit('resize', { width: localWidth.value, height: localHeight.value })
}
</script>

<template>
  <div
    class="sticky-note"
    :class="{ 'is-hidden': isHidden }"
    :style="{
      width: `${localWidth}px`,
      height: `${localHeight}px`,
      left: `${x}px`,
      top: `${y}px`,
    }"
    @dblclick="enableEditing"
    @mousedown="onMouseDown"
    @contextmenu="openContextMenu"
  >
    <div v-if="isHidden" class="hidden-overlay">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="hidden-icon"
      >
        <path
          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
      <span>{{ t('board.hidden_note') }}</span>
    </div>
    <template v-else>
      <textarea
        v-if="isEditing"
        ref="textarea"
        v-model="localText"
        class="note-textarea"
        @blur="disableEditing"
      />
      <p v-else-if="!localText && isOwner" class="note-text placeholder">
        {{ t('board.note_placeholder') }}
      </p>
      <p v-else class="note-text">{{ localText }}</p>
    </template>

    <div v-if="!isHidden" class="resize-handle" @mousedown="startResize($event)" />
  </div>

  <ContextMenu
    v-if="contextMenuVisible"
    :items="contextMenuItems"
    :x="contextMenuX"
    :y="contextMenuY"
    @close="contextMenuVisible = false"
  />
</template>

<style scoped>
.sticky-note {
  position: absolute;
  background-color: #fef08a;
  box-shadow:
    2px 2px 6px rgba(0, 0, 0, 0.15),
    4px 4px 12px rgba(0, 0, 0, 0.08);
  padding: 12px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  user-select: none;
}

.sticky-note:hover {
  box-shadow:
    4px 4px 12px rgba(0, 0, 0, 0.18),
    6px 6px 20px rgba(0, 0, 0, 0.1);
}

.sticky-note.is-hidden {
  background-color: rgba(254, 240, 138, 0.5); /* lighter #fef08a */
  backdrop-filter: blur(4px);
  border: 1px dashed rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.4);
}

.hidden-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  pointer-events: none;
  user-select: none;
}

.hidden-icon {
  width: 24px;
  height: 24px;
  opacity: 0.5;
}

.note-textarea {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  color: #1c1917;
  cursor: text;
  user-select: text;
}

.note-text {
  width: 100%;
  height: 100%;
  font-size: 14px;
  line-height: 1.5;
  color: #1c1917;
  white-space: pre-wrap;
  word-break: break-word;
  overflow: hidden;
  cursor: grab;
}

.note-text.placeholder {
  color: rgba(28, 25, 23, 0.4);
}

.note-text:active {
  cursor: grabbing;
}

.resize-handle {
  position: absolute;
  width: 18px;
  height: 18px;
  bottom: 0;
  right: 0;
  cursor: se-resize;
  z-index: 10;
}

.resize-handle::after {
  content: '';
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 6px;
  height: 6px;
  border-right: 2px solid rgba(0, 0, 0, 0.25);
  border-bottom: 2px solid rgba(0, 0, 0, 0.25);
  border-radius: 1px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.sticky-note:hover .resize-handle::after {
  opacity: 1;
}
</style>
