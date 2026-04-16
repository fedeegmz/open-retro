import { createRouter, createWebHistory } from 'vue-router'
import BoardSetup from '../views/BoardSetup.vue'
import BoardView from '../views/BoardView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: BoardSetup },
    { path: '/board/:id', component: BoardView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
