<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ServerService } from '../services/api/serverService'
import { LocalStorageService } from '../services/localStorageService'

const { locale, t } = useI18n()
interface Language {
  code: string
  name: string
}

const availableLanguages = ref<Language[]>([])
const isOpen = ref(false)
const selectorRef = ref<HTMLElement | null>(null)

const currentLanguageName = computed(() => {
  const lang = availableLanguages.value.find((l) => l.code === locale.value)
  return lang ? lang.name : locale.value.toUpperCase()
})

onMounted(async () => {
  try {
    const serverUrl = LocalStorageService.getServerUrl()
    if (!serverUrl) return

    const response = await new ServerService(serverUrl).getLanguages()
    if (response.success && response.data) {
      availableLanguages.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch languages', error)
  }

  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
  if (selectorRef.value && !selectorRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = (code: string) => {
  locale.value = code
  localStorage.setItem('lang', code)
  isOpen.value = false
}
</script>

<template>
  <div class="language-selector" ref="selectorRef">
    <button
      class="selector-toggle"
      @click.stop="toggleDropdown"
      :aria-label="t('languages.select')"
      :class="{ active: isOpen }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="globe-icon"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path
          d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        />
      </svg>
      <span class="current-lang">{{ currentLanguageName }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="chevron-icon"
        :class="{ rotated: isOpen }"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <Transition name="fade">
      <div v-if="isOpen" class="dropdown-menu">
        <button
          v-for="lang in availableLanguages"
          :key="lang.code"
          class="dropdown-item"
          :class="{ selected: lang.code === locale }"
          @click="selectLanguage(lang.code)"
        >
          <span class="lang-name">{{ lang.name }}</span>
          <svg
            v-if="lang.code === locale"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="check-icon"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.language-selector {
  position: relative;
  user-select: none;
}

.selector-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  color: #44403c;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.selector-toggle:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.selector-toggle.active {
  border-color: #ea580c;
  background: white;
}

.globe-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

.chevron-icon {
  width: 14px;
  height: 14px;
  opacity: 0.5;
  transition: transform 0.2s ease;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  min-width: 140px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: #44403c;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(234, 88, 12, 0.05);
  color: #ea580c;
}

.dropdown-item.selected {
  color: #ea580c;
  background: rgba(234, 88, 12, 0.1);
}

.check-icon {
  width: 14px;
  height: 14px;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
