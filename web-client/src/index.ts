import './assets/main.css'

// Core Application Layer
export { default as App } from './App.vue'
export { default as router } from './router/index'
export { default as i18n } from './plugins/i18n'

// Services & Config
export * from './services/api/serverService'
export * from './services/api/userService'
export * from './config/config'
export * from './composables/useWebSocket'

// Components
export { default as BoardCanvas } from './components/BoardCanvas.vue'
export { default as ToolBar } from './components/ToolBar.vue'
export { default as UsersSidebar } from './components/UsersSidebar.vue'
export { default as SessionExpiredModal } from './components/SessionExpiredModal.vue'
