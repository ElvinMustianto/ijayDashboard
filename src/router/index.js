import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardLayout from '@/layouts/dashboardLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProductPage from '@/views/ProductPage.vue'
import ImagePage from '@/views/ImagePage.vue'
import CompanyPage from '@/views/CompanyPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', name: 'Dashboard', component: DashboardView },
      { path: 'product', name: 'Product', component: ProductPage },
      { path: 'image', name: 'Image', component: ImagePage },
      { path: 'company', name: 'Company', component: CompanyPage }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.name !== 'Login' && !token) next({ name: 'Login' })
  else if (to.name === 'Login' && token) next({ name: 'Dashboard' })
  else next()
})

export default router
