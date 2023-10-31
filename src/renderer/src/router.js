import { createRouter, createWebHashHistory } from 'vue-router'
import Page1 from './pages/page1.vue'
import Page2 from './pages/page2.vue'

const routes = [
  {
    path: '/',
    redirect: '/page1',
    children: [
      {
        name: 'page1',
        path: 'page1',
        component: Page1,
      },
      {
        name: 'page2',
        path: 'page2',
        component: Page2,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
