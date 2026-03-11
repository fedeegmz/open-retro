import { createRouter, createWebHistory } from 'vue-router'
import ServerSetup from '../views/ServerSetup.vue'
import BoardSetup from '../views/BoardSetup.vue'
import BoardView from '../views/BoardView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: ServerSetup },
    { path: '/connect', component: BoardSetup },
    { path: '/board/:id', component: BoardView },
  ],
})

export default router
