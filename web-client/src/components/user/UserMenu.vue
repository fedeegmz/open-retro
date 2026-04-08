<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUser } from '@/composables/useUser'

const { username, setUsername } = useUser()
const isOpen = ref(false)
const isEditing = ref(false)
const editValue = ref(username.value)
const menuRef = ref<HTMLElement | null>(null)

function toggleMenu() {
  isOpen.value = !isOpen.value
  if (!isOpen.value) isEditing.value = false
}

function startEdit() {
  isEditing.value = true
  editValue.value = username.value
}

function saveEdit() {
  setUsername(editValue.value)
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    isOpen.value = false
    isEditing.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="user-menu" ref="menuRef">
    <button class="avatar-btn" @click.stop="toggleMenu" :title="username">
      <div class="avatar">
        {{ username.charAt(0).toUpperCase() }}
      </div>
    </button>

    <Transition name="fade-slide">
      <div v-if="isOpen" class="dropdown" @click.stop>
        <div class="user-info">
          <div v-if="!isEditing" class="username-row">
            <span class="username">{{ username }}</span>
            <button class="edit-btn" @click.stop="startEdit">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
              </svg>
            </button>
          </div>
          <div v-else class="edit-row">
            <input
              v-model="editValue"
              class="edit-input"
              @keyup.enter="saveEdit"
              @keyup.esc="cancelEdit"
              autoFocus
            />
            <div class="actions">
              <button class="icon-btn save" @click.stop="saveEdit">✓</button>
              <button class="icon-btn cancel" @click.stop="cancelEdit">✕</button>
            </div>
          </div>
        </div>

        <div class="menu-items">
          <button class="menu-item disabled">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              ></path>
            </svg>
            Settings (Soon)
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.user-menu {
  position: relative;
}

.avatar-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar-btn:hover {
  transform: scale(1.05);
}

.avatar {
  width: 36px;
  height: 36px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
}

.dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 240px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  overflow: hidden;
}

.user-info {
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.02);
}

.username-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.username {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.edit-btn {
  background: none;
  border: none;
  color: var(--color-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  transition: color 0.2s;
}

.edit-btn:hover {
  color: var(--color-primary);
}

.edit-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-input {
  flex: 1;
  background: var(--color-background-mute);
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  padding: 4px 8px;
  color: var(--color-text);
  font-size: 14px;
  outline: none;
}

.actions {
  display: flex;
  gap: 4px;
}

.icon-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  font-weight: bold;
}

.save {
  color: var(--color-primary);
}
.cancel {
  color: #e5484d;
}

.menu-items {
  padding: 8px;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.05);
}

.menu-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
