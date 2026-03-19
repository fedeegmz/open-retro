import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initConfig } from './config/config'

initConfig()

createApp(App).use(router).mount('#app')
