<template>
  <div v-if="!isLoggedIn">
    <!-- Halaman Login -->
    <LoginView @login-success="onLoginSuccess" />
  </div>

  <div v-else class="d-flex min-vh-100">
    <!-- Dashboard Layout -->
    <SideBar
      v-if="isDesktop"
      v-model:sidebarOpen="sidebarOpen"
      :is-desktop="true"
      @navigate="handleNavigation"
    />

    <div
      v-if="!isDesktop && sidebarOpen"
      class="position-fixed top-0 start-0 w-100 h-100 bg-black opacity-50"
      style="z-index: 1035"
      @click="sidebarOpen = false"
    ></div>

    <main
      class="flex-grow-1 d-flex flex-column"
      :style="{ marginLeft: isDesktop && sidebarOpen ? '250px' : '0' }"
      style="transition: margin-left 0.25s ease"
    >
      <Header @toggle-sidebar="toggleSidebar" @logout="handleLogout" />
      <component :is="currentViewComponent" class="flex-grow-1" />
      <Footer />
    </main>
  </div>
</template>

<script>
// Import komponen dengan nama file SideBar.vue
import LoginView from './views/LoginView.vue'
import SideBar from './components/SideBar.vue'   // ← Nama file: SideBar.vue
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

// Views
import DashboardView from './views/DashboardView.vue'
import ProductPage from './views/ProductPage.vue'
import ImagePage from './views/ImagePage.vue'
import CompanyPage from './views/CompanyPage.vue'

export default {
  name: 'App',
  components: {
    LoginView,
    SideBar,        // ← Daftarkan sebagai SideBar (bukan Sidebar)
    Header,
    Footer,
    DashboardView,
    ProductPage,
    ImagePage,
    CompanyPage
  },
  data() {
    return {
      isLoggedIn: false,
      sidebarOpen: true,
      currentView: 'dashboard'
    }
  },
  computed: {
    isDesktop() {
      return window.innerWidth >= 768
    },
    currentViewComponent() {
      const map = {
        dashboard: 'DashboardView',
        product: 'ProductPage',
        image: 'ImagePage',
        company: 'CompanyPage'
      }
      return map[this.currentView] || 'DashboardView'
    }
  },
  mounted() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      if (this.isDesktop && this.isLoggedIn) {
        this.sidebarOpen = true
      }
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    handleNavigation(view) {
      this.currentView = view
    },
    onLoginSuccess() {
      this.isLoggedIn = true
    },
    handleLogout() {
      localStorage.removeItem('isLoggedIn')
      this.isLoggedIn = false
    }
  }
}
</script>