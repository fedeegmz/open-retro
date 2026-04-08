<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ServerService } from '@/services/api/serverService'
import { LocalStorageService } from '@/services/localStorageService'
import { getConfig } from '@/config/config'

const { t, locale } = useI18n()
const emit = defineEmits<{ close: [] }>()

type Section = 'preferences' | 'server'
const activeSection = ref<Section>('preferences')

// Preferences State
interface Language {
  code: string
  name: string
}
const availableLanguages = ref<Language[]>([])

// Server State
const serverUrl = ref(LocalStorageService.getServerUrl() ?? getConfig().defaultServerUrl ?? '')
const serverError = ref('')
const serverLoading = ref(false)
const serverSuccess = ref(false)

onMounted(async () => {
  await fetchLanguages()
})

async function fetchLanguages() {
  try {
    const url = LocalStorageService.getServerUrl() ?? getConfig().defaultServerUrl
    if (!url) return
    const response = await new ServerService(url).getLanguages()
    if (response.success && response.data) {
      availableLanguages.value = response.data
    }
  } catch (e) {
    console.error('Failed to fetch languages', e)
  }
}

function selectLanguage(code: string) {
  locale.value = code
  LocalStorageService.setLanguage(code)
}

async function testConnection() {
  serverError.value = ''
  serverSuccess.value = false
  serverLoading.value = true

  await new ServerService(serverUrl.value).ping({
    onSuccess: () => {
      LocalStorageService.setServerUrl(serverUrl.value)
      serverSuccess.value = true
      // Refresh languages in case the new server has different ones
      fetchLanguages()
    },
    onError: (msg) => {
      serverError.value = msg
    },
  })

  serverLoading.value = false
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="emit('close')">
      <div class="settings-card">
        <aside class="sidebar">
          <div class="sidebar-header">
            <h3>{{ t('common.settings') }}</h3>
          </div>
          <nav class="nav">
            <button
              :class="['nav-item', { active: activeSection === 'preferences' }]"
              @click="activeSection = 'preferences'"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path
                  d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                />
              </svg>
              {{ t('setup.preferences_tab') || 'Preferences' }}
            </button>
            <button
              :class="['nav-item', { active: activeSection === 'server' }]"
              @click="activeSection = 'server'"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
              {{ t('setup.server_tab') || 'Server' }}
            </button>
          </nav>
          <button class="close-mobile" @click="emit('close')">{{ t('common.close') }}</button>
        </aside>

        <main class="content">
          <header class="content-header">
            <h2>
              {{
                activeSection === 'preferences'
                  ? t('setup.preferences_title') || 'Preferences'
                  : t('setup.server_config_title')
              }}
            </h2>
            <button class="close-btn" @click="emit('close')">✕</button>
          </header>

          <div class="scroll-area">
            <!-- Preferences Section -->
            <div v-if="activeSection === 'preferences'" class="section fade-in">
              <div class="field">
                <label>{{ t('setup.language_label') || 'Language' }}</label>
                <div class="lang-grid">
                  <button
                    v-for="lang in availableLanguages"
                    :key="lang.code"
                    :class="['lang-card', { active: locale === lang.code }]"
                    @click="selectLanguage(lang.code)"
                  >
                    <span class="lang-name">{{ lang.name }}</span>
                    <span v-if="locale === lang.code" class="check">✓</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Server Section -->
            <div v-if="activeSection === 'server'" class="section fade-in">
              <p class="desc">{{ t('setup.server_config_desc') }}</p>
              <div class="field">
                <label for="server-url">{{ t('setup.server_url_label') }}</label>
                <div class="input-group">
                  <input
                    id="server-url"
                    v-model="serverUrl"
                    type="text"
                    placeholder="https://api.example.com"
                    spellcheck="false"
                  />
                  <button
                    class="btn-test"
                    :disabled="serverLoading || !serverUrl"
                    @click="testConnection"
                  >
                    <span v-if="serverLoading" class="spinner-small" />
                    {{
                      serverLoading ? t('setup.connecting') : t('setup.test_connection') || 'Test'
                    }}
                  </button>
                </div>
                <p v-if="serverError" class="error-text">{{ serverError }}</p>
                <p v-if="serverSuccess" class="success-text">
                  ✓ {{ t('setup.connection_success') || 'Connection successful' }}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.settings-card {
  background: var(--color-background-soft);
  width: 100%;
  max-width: 800px;
  height: 600px;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  display: flex;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

/* Sidebar */
.sidebar {
  width: 240px;
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 24px;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-muted);
}

.nav {
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  border-radius: 10px;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  background: rgba(var(--color-primary-rgb), 0.15);
  color: var(--color-primary);
}

.close-mobile {
  display: none;
  margin: 16px;
  padding: 10px;
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
}

/* Content */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-background-soft);
}

.content-header {
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}

.content-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--color-text);
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.desc {
  font-size: 14px;
  color: var(--color-muted);
  line-height: 1.6;
  margin: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Lang Grid */
.lang-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.lang-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-card:hover {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.05);
}

.lang-card.active {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  font-weight: 600;
}

.check {
  font-size: 16px;
}

/* Server Input */
.input-group {
  display: flex;
  gap: 8px;
}

.input-group input {
  flex: 1;
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.input-group input:focus {
  border-color: var(--color-primary);
}

.btn-test {
  padding: 0 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s;
}

.btn-test:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-text {
  font-size: 13px;
  color: #e5484d;
  margin: 0;
}

.success-text {
  font-size: 13px;
  color: var(--color-primary);
  margin: 0;
  font-weight: 600;
}

.spinner-small {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .settings-card {
    flex-direction: column;
    height: 100%;
    border-radius: 0;
  }
  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
  .nav {
    flex-direction: row;
    overflow-x: auto;
  }
  .nav-item {
    white-space: nowrap;
  }
  .close-mobile {
    display: block;
  }
  .close-btn {
    display: none;
  }
}
</style>
