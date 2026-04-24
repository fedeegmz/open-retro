<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import ContextMenu, { type ContextMenuItem } from '../molecules/ContextMenu.vue'

import { useI18n } from 'vue-i18n'

const props = defineProps<{
  x: number
  y: number
  width: number
  height: number
  title: string
  description: string
  pinned: boolean
}>()

const { t } = useI18n()
const emit = defineEmits<{
  dragStart: [event: MouseEvent]
  delete: []
  resize: [payload: { width: number; height: number }]
  edit: [payload: { title: string; description: string }]
  'toggle-pin': [pinned: boolean]
}>()

const MIN_SIZE = 160

const localWidth = ref(props.width)
const localHeight = ref(props.height)
const localTitle = ref(props.title)
const localDescription = ref(props.description)

const editingTitle = ref(false)
const editingDescription = ref(false)
const titleInput = ref<HTMLInputElement | null>(null)
const descInput = ref<HTMLTextAreaElement | null>(null)

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
  () => props.title,
  (v) => {
    if (!editingTitle.value) localTitle.value = v
  },
)
watch(
  () => props.description,
  (v) => {
    if (!editingDescription.value) localDescription.value = v
  },
)

const contextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)

const contextMenuItems = computed<ContextMenuItem[]>(() => [
  {
    label: props.pinned ? t('board.unpin_group') : t('board.pin_group'),
    icon: props.pinned
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><path d="M13 13.5V19l-1 2-1-2v-5.5"/><path d="M8.5 8.5A5 5 0 0 0 12 19"/><path d="M17.5 8.5A5 5 0 0 0 12 5V3"/><path d="M12 3h.01"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l-1 2-1-2v-5.5A5 5 0 0 1 7 9V3h10v6a5 5 0 0 1-3 4.5V19"/><path d="M7 3h10"/></svg>`,
    action: () => emit('toggle-pin', !props.pinned),
  },
  {
    label: t('board.delete_group'),
    danger: true,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
    action: () => emit('delete'),
  },
])

function openContextMenu(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  contextMenuX.value = event.clientX
  contextMenuY.value = event.clientY
  contextMenuVisible.value = true
}

function onMouseDown(event: MouseEvent) {
  event.stopPropagation()
  if (props.pinned) return
  emit('dragStart', event)
}

async function startEditTitle(event: MouseEvent) {
  if (props.pinned) return
  event.stopPropagation()
  editingTitle.value = true
  await nextTick()
  titleInput.value?.select()
}

function finishEditTitle() {
  editingTitle.value = false
  if (localTitle.value !== props.title) {
    emit('edit', { title: localTitle.value, description: localDescription.value })
  }
}

async function startEditDescription(event: MouseEvent) {
  if (props.pinned) return
  event.stopPropagation()
  editingDescription.value = true
  await nextTick()
  descInput.value?.focus()
}

function finishEditDescription() {
  editingDescription.value = false
  if (localDescription.value !== props.description) {
    emit('edit', { title: localTitle.value, description: localDescription.value })
  }
}

let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0

function startResize(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()

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
    class="note-group"
    :class="{ pinned }"
    :style="{
      width: `${localWidth}px`,
      height: `${localHeight}px`,
      left: `${x}px`,
      top: `${y}px`,
    }"
    @mousedown="onMouseDown"
    @contextmenu="openContextMenu"
  >
    <div class="group-header">
      <input
        v-if="editingTitle"
        ref="titleInput"
        v-model="localTitle"
        class="title-input"
        @blur="finishEditTitle"
        @keydown.enter="finishEditTitle"
        @mousedown.stop
      />
      <h3 v-else class="group-title" @dblclick="startEditTitle">{{ localTitle }}</h3>

      <textarea
        v-if="editingDescription"
        ref="descInput"
        v-model="localDescription"
        class="desc-input"
        rows="2"
        :placeholder="t('board.group_desc_placeholder')"
        @blur="finishEditDescription"
        @mousedown.stop
      />
      <p
        v-else
        class="group-description"
        :class="{ empty: !localDescription }"
        @dblclick="startEditDescription"
      >
        {{ localDescription || t('board.group_desc_empty') }}
      </p>
    </div>

    <div class="resize-handle" @mousedown="startResize($event)" />
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
.note-group {
  position: absolute;
  background-color: transparent;
  border: 1px solid var(--color-primary);
  border-radius: 12px;
  cursor: grab;
  user-select: none;
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.1);
}

.note-group:active {
  cursor: grabbing;
}

.note-group.pinned {
  cursor: default;
  border-style: dashed;
  border-color: var(--color-muted);
}

.note-group.pinned .group-title,
.note-group.pinned .group-description {
  color: var(--color-muted);
}

.group-header {
  padding: 10px 14px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  cursor: text;
  line-height: 1.3;
  padding: 2px 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title-input {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  background: rgba(62, 175, 124, 0.08);
  border: 1px solid rgba(62, 175, 124, 0.4);
  border-radius: 4px;
  padding: 1px 4px;
  outline: none;
  font-family: inherit;
  width: 100%;
}

.group-description {
  font-size: 12px;
  color: var(--color-muted);
  line-height: 1.4;
  cursor: text;
  padding: 2px 4px;
  white-space: pre-wrap;
  word-break: break-word;
}

.group-description.empty {
  color: rgba(255, 255, 255, 0.2);
  font-style: italic;
}

.desc-input {
  font-size: 12px;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 2px 4px;
  outline: none;
  resize: none;
  font-family: inherit;
  width: 100%;
  line-height: 1.4;
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
  bottom: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  border-right: 2px solid var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  border-radius: 1px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.note-group:hover .resize-handle::after {
  opacity: 1;
}
</style>
