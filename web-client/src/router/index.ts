import { createRouter, createWebHistory } from 'vue-router'
import BoardSetup from '../views/BoardSetup.vue'
import BoardView from '../views/BoardView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/connect' },
    { path: '/connect', component: BoardSetup },
    { path: '/board/:id', component: BoardView },
  ],
})

export default router
