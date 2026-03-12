<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

export interface ContextMenuItem {
  label: string;
  icon?: string;
  danger?: boolean;
  action: () => void;
}

defineProps<{
  items: ContextMenuItem[];
  x: number;
  y: number;
}>();

const emit = defineEmits<{
  close: [];
}>();

const menu = ref<HTMLElement | null>(null);

function onClickOutside(event: MouseEvent) {
  if (menu.value && !menu.value.contains(event.target as Node)) {
    emit("close");
  }
}

function onContextMenuOutside() {
  emit("close");
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") emit("close");
}

function handleAction(item: ContextMenuItem) {
  item.action();
  emit("close");
}

onMounted(() => {
  setTimeout(() => {
    window.addEventListener("pointerdown", onClickOutside, { capture: true });
    window.addEventListener("contextmenu", onContextMenuOutside);
    window.addEventListener("keydown", onKeyDown);
  }, 0);
});

onUnmounted(() => {
  window.removeEventListener("pointerdown", onClickOutside, { capture: true });
  window.removeEventListener("contextmenu", onContextMenuOutside);
  window.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
  <Teleport to="body">
    <div
      ref="menu"
      class="context-menu"
      :style="{ top: `${y}px`, left: `${x}px` }"
      @contextmenu.prevent
    >
      <button
        v-for="item in items"
        :key="item.label"
        class="context-menu-item"
        :class="{ danger: item.danger }"
        @mousedown.stop="handleAction(item)"
      >
        <span v-if="item.icon" class="item-icon" v-html="item.icon" />
        <span class="item-label">{{ item.label }}</span>
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 160px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.07);
  padding: 4px;
  animation: menu-in 0.1s ease;
}

@keyframes menu-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  color: #1c1917;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.1s ease;
}

.context-menu-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.context-menu-item.danger {
  color: #dc2626;
}

.context-menu-item.danger:hover {
  background-color: rgba(220, 38, 38, 0.07);
}

.item-icon {
  display: flex;
  align-items: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.item-icon :deep(svg) {
  width: 16px;
  height: 16px;
}
</style>
