<script setup lang="ts">
import type { ConnectedUser } from '@shared/types/board'

defineProps<{
  users: ConnectedUser[]
  myId: string
}>()

function getInitials(username: string): string {
  return username
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(userId: string): string {
  const colors = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#f43f5e',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#14b8a6',
    '#06b6d4',
    '#3b82f6',
  ]
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) & 0xffffffff
  }
  return colors[Math.abs(hash) % colors.length]
}
</script>

<template>
  <div class="users-sidebar">
    <div
      v-for="user in users"
      :key="user.id"
      class="user-avatar"
      :class="{ 'is-me': user.id === myId }"
      :style="{ backgroundColor: getAvatarColor(user.id) }"
      :title="user.id === myId ? `${user.username} (vos)` : user.username"
    >
      {{ getInitials(user.username) }}
    </div>
  </div>
</template>

<style scoped>
.users-sidebar {
  position: fixed;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: white;
  cursor: default;
  user-select: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.user-avatar:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.user-avatar.is-me {
  outline: 2px solid white;
  outline-offset: 2px;
}
</style>
