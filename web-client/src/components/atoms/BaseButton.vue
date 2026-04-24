<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()
</script>

<template>
  <button :type="type || 'button'" :disabled="disabled" class="base-button">
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  font-family: inherit;
  cursor: pointer;
}
.base-button:disabled {
  cursor: not-allowed;
}
</style>
