<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Navigator } from '@/router/navigator'
import StickyNote from './StickyNote.vue'
import NoteGroup from './NoteGroup.vue'
import ToolBar from './ToolBar.vue'
import { useWebSocket } from '../composables/useWebSocket'
import { useToast } from '../composables/useToast'
import { WsMsgType } from '@shared/types/board'
import type { Note, Group } from '@shared/types/board'

const props = defineProps<{
  serverUrl: string
  boardId: string
  password: string
}>()

const wsUrl = `${props.serverUrl}/board/ws?board=${props.boardId}&password=${encodeURIComponent(props.password)}`

const notes = ref<Note[]>([])
const groups = ref<Group[]>([])
let topZ = 1

const navigator = new Navigator(useRouter())
const { show: showToast } = useToast()
const { send, onMessage, isConnected, wsError } = useWebSocket(wsUrl)

watch(wsError, (err) => {
  if (err === 'auth') {
    showToast('Contraseña incorrecta')
    navigator.backToBoardSetup()
  }
})

onMessage((msg) => {
  switch (msg.type) {
    case WsMsgType.BoardSync:
      notes.value = msg.state.notes
      groups.value = msg.state.groups
      topZ = msg.state.nextZIndex
      break
    case WsMsgType.NoteAdd:
      notes.value.push(msg.note)
      topZ = Math.max(topZ, msg.note.zIndex + 1)
      break
    case WsMsgType.NoteMove: {
      const note = notes.value.find((n) => n.id === msg.id)
      if (note) {
        note.x = msg.x
        note.y = msg.y
      }
      break
    }
    case WsMsgType.NoteResize: {
      const note = notes.value.find((n) => n.id === msg.id)
      if (note) {
        note.width = msg.width
        note.height = msg.height
      }
      break
    }
    case WsMsgType.NoteEdit: {
      const note = notes.value.find((n) => n.id === msg.id)
      if (note) note.text = msg.text
      break
    }
    case WsMsgType.NoteDelete:
      notes.value = notes.value.filter((n) => n.id !== msg.id)
      break
    case WsMsgType.NoteZ: {
      const note = notes.value.find((n) => n.id === msg.id)
      if (note) note.zIndex = msg.zIndex
      topZ = Math.max(topZ, msg.zIndex + 1)
      break
    }
    case WsMsgType.GroupAdd:
      groups.value.push(msg.group)
      break
    case WsMsgType.GroupMove: {
      const group = groups.value.find((g) => g.id === msg.id)
      if (group) {
        group.x = msg.x
        group.y = msg.y
      }
      break
    }
    case WsMsgType.GroupResize: {
      const group = groups.value.find((g) => g.id === msg.id)
      if (group) {
        group.width = msg.width
        group.height = msg.height
      }
      break
    }
    case WsMsgType.GroupEdit: {
      const group = groups.value.find((g) => g.id === msg.id)
      if (group) {
        group.title = msg.title
        group.description = msg.description
      }
      break
    }
    case WsMsgType.GroupDelete:
      groups.value = groups.value.filter((g) => g.id !== msg.id)
      break
    case WsMsgType.GroupPin: {
      const group = groups.value.find((g) => g.id === msg.id)
      if (group) group.pinned = msg.pinned
      break
    }
  }
})

const canvasOffset = ref({ x: 0, y: 0 })
const isPanning = ref(false)

const canvasStyle = computed(() => ({
  transform: `translate(${canvasOffset.value.x}px, ${canvasOffset.value.y}px)`,
}))

const boardStyle = computed(() => ({
  cursor: isPanning.value ? 'grabbing' : 'grab',
  backgroundPosition: `${canvasOffset.value.x}px ${canvasOffset.value.y}px`,
}))

function addNote() {
  const offset = (notes.value.length % 6) * 24
  const note: Note = {
    id: crypto.randomUUID(),
    x: 100 + offset - canvasOffset.value.x,
    y: 100 + offset - canvasOffset.value.y,
    zIndex: topZ++,
    width: 200,
    height: 200,
    text: '',
  }
  notes.value.push(note)
  send({ type: WsMsgType.NoteAdd, note })
}

function addGroup() {
  const offset = (groups.value.length % 6) * 32
  const group: Group = {
    id: crypto.randomUUID(),
    x: 80 + offset - canvasOffset.value.x,
    y: 80 + offset - canvasOffset.value.y,
    width: 320,
    height: 240,
    title: 'Grupo',
    description: '',
    pinned: false,
  }
  groups.value.push(group)
  send({ type: WsMsgType.GroupAdd, group })
}

function bringToFront(note: Note) {
  note.zIndex = topZ++
  send({ type: WsMsgType.NoteZ, id: note.id, zIndex: note.zIndex })
}

function deleteNote(id: string) {
  notes.value = notes.value.filter((n) => n.id !== id)
  send({ type: WsMsgType.NoteDelete, id })
}

function deleteGroup(id: string) {
  groups.value = groups.value.filter((g) => g.id !== id)
  send({ type: WsMsgType.GroupDelete, id })
}

function startDrag(item: Note | Group, startEvent: MouseEvent, kind: 'note' | 'group') {
  const startX = startEvent.clientX - canvasOffset.value.x - item.x
  const startY = startEvent.clientY - canvasOffset.value.y - item.y

  function onMove(event: MouseEvent) {
    item.x = event.clientX - canvasOffset.value.x - startX
    item.y = event.clientY - canvasOffset.value.y - startY
  }

  function onUp() {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
    const type = kind === 'note' ? WsMsgType.NoteMove : WsMsgType.GroupMove
    send({ type, id: item.id, x: item.x, y: item.y })
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

function onNoteResize(id: string, payload: { width: number; height: number }) {
  const note = notes.value.find((n) => n.id === id)
  if (note) {
    note.width = payload.width
    note.height = payload.height
  }
  send({ type: WsMsgType.NoteResize, id, ...payload })
}

function onNoteEdit(id: string, text: string) {
  const note = notes.value.find((n) => n.id === id)
  if (note) note.text = text
  send({ type: WsMsgType.NoteEdit, id, text })
}

function onGroupResize(id: string, payload: { width: number; height: number }) {
  const group = groups.value.find((g) => g.id === id)
  if (group) {
    group.width = payload.width
    group.height = payload.height
  }
  send({ type: WsMsgType.GroupResize, id, ...payload })
}

function onGroupEdit(id: string, payload: { title: string; description: string }) {
  const group = groups.value.find((g) => g.id === id)
  if (group) {
    group.title = payload.title
    group.description = payload.description
  }
  send({ type: WsMsgType.GroupEdit, id, ...payload })
}

function onGroupTogglePin(id: string, pinned: boolean) {
  const group = groups.value.find((g) => g.id === id)
  if (group) group.pinned = pinned
  send({ type: WsMsgType.GroupPin, id, pinned })
}

function onBoardMouseDown(event: MouseEvent) {
  isPanning.value = true

  const startX = event.clientX - canvasOffset.value.x
  const startY = event.clientY - canvasOffset.value.y

  function onMove(e: MouseEvent) {
    e.preventDefault()
    canvasOffset.value.x = e.clientX - startX
    canvasOffset.value.y = e.clientY - startY
  }

  function onUp() {
    isPanning.value = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}
</script>

<template>
  <div class="board" :style="boardStyle" @mousedown="onBoardMouseDown">
    <div class="canvas" :style="canvasStyle">
      <NoteGroup
        v-for="group in groups"
        :key="group.id"
        :x="group.x"
        :y="group.y"
        :width="group.width"
        :height="group.height"
        :title="group.title"
        :description="group.description"
        :pinned="group.pinned"
        @drag-start="startDrag(group, $event, 'group')"
        @delete="deleteGroup(group.id)"
        @resize="onGroupResize(group.id, $event)"
        @edit="onGroupEdit(group.id, $event)"
        @toggle-pin="onGroupTogglePin(group.id, $event)"
      />

      <StickyNote
        v-for="note in notes"
        :key="note.id"
        :x="note.x"
        :y="note.y"
        :width="note.width"
        :height="note.height"
        :text="note.text"
        :style="{ zIndex: note.zIndex }"
        @bring-to-front="bringToFront(note)"
        @drag-start="startDrag(note, $event, 'note')"
        @delete="deleteNote(note.id)"
        @resize="onNoteResize(note.id, $event)"
        @edit="onNoteEdit(note.id, $event)"
      />
    </div>

    <ToolBar @add-note="addNote" @add-group="addGroup" />

    <div v-if="wsError === 'auth'" class="connection-status error">
      Contraseña incorrecta — acceso denegado
    </div>
    <div v-else-if="!isConnected" class="connection-status">Reconectando...</div>
  </div>
</template>

<style scoped>
.board {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f0e8;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 24px 24px;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  will-change: transform;
}

.connection-status {
  position: fixed;
  bottom: 16px;
  right: 16px;
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  z-index: 200;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
