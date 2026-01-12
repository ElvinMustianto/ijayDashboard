<template>
  <div class="d-flex min-vh-100">
    <SideBar v-model:sidebarOpen="sidebarOpen" :is-desktop="isDesktop" />

    <main
      class="flex-grow-1 d-flex flex-column"
      :style="{ marginLeft: isDesktop && sidebarOpen ? '250px' : '0' }"
      style="transition: margin-left 0.25s ease"
    >
      <Header @toggle-sidebar="toggleSidebar" @logout="handleLogout" />
      <router-view class="flex-grow-1" />
      <Footer />
    </main>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'DashboardLayout',
  components: { SideBar, Header, Footer },
  data() {
    return { sidebarOpen: true }
  },
  computed: {
    isDesktop() { return window.innerWidth >= 768 }
  },
  mounted() { 
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  beforeUnmount() { 
    window.removeEventListener('resize', this.handleResize) 
  },
  methods: {
    handleResize() { if (this.isDesktop) this.sidebarOpen = true },
    toggleSidebar() { this.sidebarOpen = !this.sidebarOpen },
    handleLogout() {
      localStorage.clear()
      this.$router.replace({ name: 'Login' })
    }
  }
}
</script>
