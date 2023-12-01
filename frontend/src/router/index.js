// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),

    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        
      },
      {
        path: '/',
        name: 'login',
        component: () => import('@/views/GoogleLoginView.vue'),
      
      },
      {
        path: '/personas',
        name: 'personas',
        component: () => import('@/views/TablaPersonaView.vue'),
      
      },
      {
        path: '/proyectos',
        name: 'proyectos',
        component: () => import('@/views/TablaProyectoView.vue'),
      
      },
      {
        path: '/donadores',
        name: 'donadores',
        component: () => import('@/views/TablaDonadorView.vue'),
      
      },
      {
        path: '/errorLogin',
        name: 'error login',
        component: () => import('@/views/ErrorAutenticacionView.vue'),
      
      },
    ],

  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
