<template>
  <!-- Desktop Sidebar -->
  <aside
    v-if="isDesktop"
    class="text-white position-fixed top-0 start-0 h-100"
    :class="{ 'd-none': !sidebarOpen }"
    style="width: 250px; z-index: 1030; background-color: #0d2b4e;"
  >
    <div class="p-3 border-bottom" style="border-color: rgba(255,255,255,0.1);">
      <!-- 🔹 Logo di tengah -->
      <div class="d-flex justify-content-center">
        <img src="/images/logo.jpeg" alt="Logo" height="66" width="150" />
      </div>
    </div>
    <ul class="nav flex-column px-3 py-3">
      <!-- ... menu tetap sama ... -->
      <li class="nav-item mb-1">
        <a
          href="#"
          class="nav-link d-flex align-items-center text-white py-2 px-3 rounded"
          :class="{ 'bg-primary bg-opacity-25 border-start border-3 border-primary': isActive('Dashboard') }"
          @click.prevent="navigate('Dashboard')"
        >
          <i class="bi bi-speedometer2 me-2"></i>
          Dashboard
        </a>
      </li>
      <li class="nav-item mb-1">
        <a
          href="#"
          class="nav-link d-flex align-items-center text-white py-2 px-3 rounded"
          :class="{ 'bg-primary bg-opacity-25 border-start border-3 border-primary': isActive('Product') }"
          @click.prevent="navigate('Product')"
        >
          <i class="bi bi-box-seam me-2"></i>
          Product
        </a>
      </li>
      <li class="nav-item mb-1">
        <a
          href="#"
          class="nav-link d-flex align-items-center text-white py-2 px-3 rounded"
          :class="{ 'bg-primary bg-opacity-25 border-start border-3 border-primary': isActive('Company') }"
          @click.prevent="navigate('Company')"
        >
          <i class="bi bi-building me-2"></i>
          Company
        </a>
      </li>
    </ul>
  </aside>

  <!-- Mobile Sidebar (Overlay) -->
  <aside
    v-else
    v-show="sidebarOpen"
    class="text-white position-fixed top-0 start-0 w-100 h-100"
    style="z-index: 1040; background-color: #0d2b4e;"
  >
    <div class="p-3 d-flex justify-content-between align-items-center border-bottom" style="border-color: rgba(255,255,255,0.1);">
      <!-- 🔹 Di mobile, tetap tampilkan "Menu" di sebelah logo -->
      <div class="d-flex align-items-center">
        <img src="/images/logo.jpeg" alt="Logo" height="46" class="me-2" />
        <h5 class="mb-0 fw-bold">Menu</h5>
      </div>
      <button class="btn text-white" @click="closeMobile">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
    <ul class="nav flex-column px-3 py-3">
      <!-- ... menu mobile tetap sama ... -->
      <li class="nav-item mb-1">
        <a href="#" class="nav-link d-flex align-items-center text-white py-2 px-3" @click.prevent="navigateAndClose('Dashboard')">
          <i class="bi bi-speedometer2 me-2"></i> Dashboard
        </a>
      </li>
      <li class="nav-item mb-1">
        <a href="#" class="nav-link d-flex align-items-center text-white py-2 px-3" @click.prevent="navigateAndClose('Product')">
          <i class="bi bi-box-seam me-2"></i> Product
        </a>
      </li>
      <li class="nav-item mb-1">
        <a href="#" class="nav-link d-flex align-items-center text-white py-2 px-3" @click.prevent="navigateAndClose('Image')">
          <i class="bi bi-images me-2"></i> Image
        </a>
      </li>
      <li class="nav-item mb-1">
        <a href="#" class="nav-link d-flex align-items-center text-white py-2 px-3" @click.prevent="navigateAndClose('Company')">
          <i class="bi bi-building me-2"></i> Company
        </a>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    sidebarOpen: Boolean,
    isDesktop: Boolean
  },
  data() {
    return {
      activeItem: 'Dashboard'
    }
  },
  methods: {
    navigate(routeName) {
      this.activeItem = routeName
      this.$router.push({ name: routeName })
    },
    navigateAndClose(routeName) {
      this.navigate(routeName)
      this.$emit('update:sidebarOpen', false)
    },
    closeMobile() {
      if (!this.isDesktop) {
        this.$emit('update:sidebarOpen', false)
      }
    },
    isActive(name) {
      return this.activeItem === name
    }
  }
}
</script>