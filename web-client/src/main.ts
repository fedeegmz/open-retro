import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initConfig } from './config/config'
import i18n from './plugins/i18n'

initConfig({
  defaultServerUrl: import.meta.env.VITE_DEFAULT_SERVER_URL ?? '',
})

createApp(App).use(router).use(i18n).mount('#app')
