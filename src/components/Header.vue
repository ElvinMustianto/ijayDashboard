<!-- src/components/Header.vue -->
<template>
  <nav class="navbar navbar-expand-md navbar-dark px-3 shadow-sm" style="background-color: #0d2b4e;">
    <div class="container-fluid p-0">
      <button
        class="btn text-white me-2"
        @click="$emit('toggle-sidebar')"
      >
        <i class="bi bi-list"></i>
      </button>
      <span class="navbar-brand fw-semibold mb-0">Dashboard Sistem Informasi</span>

      <!-- User Dropdown -->
      <div class="ms-auto dropdown">
        <a
          href="#"
          class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="bi bi-person-circle me-1 fs-4"></i>
          <span class="d-none d-md-inline">Admin</span>
        </a>

        <ul class="dropdown-menu dropdown-menu-end mt-2">
          <li>
            <h6 class="dropdown-header">Account</h6>
          </li>
          <li>
            <button
              class="dropdown-item text-danger"
              @click.prevent="handleLogout"
            >
              <i class="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Header',
  emits: ['toggle-sidebar', 'logout'],
  methods: {
    handleLogout() {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      this.$emit('logout')
    }
  }
}
</script>