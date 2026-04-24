<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  offsetX: number
  offsetY: number
  isPanning: boolean
}>()

const emit = defineEmits<{
  mousedown: [event: MouseEvent]
}>()

const boardStyle = computed(() => ({
  cursor: props.isPanning ? 'grabbing' : 'grab',
  backgroundPosition: `${props.offsetX}px ${props.offsetY}px`,
}))

const canvasStyle = computed(() => ({
  transform: `translate(${props.offsetX}px, ${props.offsetY}px)`,
}))
</script>

<template>
  <div class="board-layout" :style="boardStyle" @mousedown="emit('mousedown', $event)">
    <div class="canvas" :style="canvasStyle">
      <slot name="canvas" />
    </div>

    <slot name="toolbar" />

    <slot name="sidebar" />

    <div class="footer-overlay">
      <slot name="footer" />
    </div>

    <slot />
  </div>
</template>

<style scoped>
.board-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-background);
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
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

.footer-overlay {
  position: fixed;
  bottom: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  z-index: 200;
}
</style>
