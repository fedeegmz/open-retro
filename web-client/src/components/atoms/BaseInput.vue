<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  modelValue: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

defineExpose({
  input: inputRef,
  focus: () => inputRef.value?.focus(),
  select: () => inputRef.value?.select(),
})
</script>

<template>
  <input
    ref="inputRef"
    :type="type || 'text'"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :placeholder="placeholder"
    :disabled="disabled"
    class="base-input"
  />
</template>

<style scoped>
.base-input {
  font-family: inherit;
  outline: none;
}
</style>
