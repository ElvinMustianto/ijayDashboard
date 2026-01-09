<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center"
    style="
      background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
      position: relative;
      overflow: hidden;
    "
  >
    <!-- Optional decorative elements -->
    <div
      class="position-absolute top-0 start-0 w-100 h-100"
      style="
        background: radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 20%),
                    radial-gradient(circle at 90% 80%, rgba(255,255,255,0.07) 0%, transparent 25%);
        pointer-events: none;
      "
    ></div>

    <div class="col-11 col-md-7 col-lg-5 col-xl-4 position-relative">
      <div
        class="card shadow-lg border-0 rounded-4"
        style="
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        "
      >
        <div class="card-body p-4 p-md-5">
          <!-- Logo / Icon -->
          <div class="text-center mb-4">
            <div
              class="d-inline-flex justify-content-center align-items-center rounded-circle bg-primary bg-opacity-10 text-primary"
              style="width: 64px; height: 64px; font-size: 28px"
            >
              <i class="bi bi-shield-lock"></i>
            </div>
            <h3 class="fw-bold text-dark mt-3">Admin Dashboard</h3>
            <p class="text-muted">Enter your credentials to continue</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label fw-medium">Email Address</label>
              <input
                type="email"
                class="form-control form-control-lg"
                id="email"
                v-model="email"
                required
                placeholder="you@company.com"
                style="border-color: #e2e8f0"
              />
            </div>
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <label for="password" class="form-label fw-medium">Password</label>
                <a href="#" class="text-decoration-none small text-primary">Forgot?</a>
              </div>
              <input
                type="password"
                class="form-control form-control-lg"
                id="password"
                v-model="password"
                required
                placeholder="••••••••"
                style="border-color: #e2e8f0"
              />
            </div>

            <div class="d-grid mb-3">
              <button
                type="submit"
                class="btn btn-primary btn-lg py-2 fw-semibold"
                :disabled="loading"
                style="box-shadow: 0 4px 12px rgba(37, 117, 252, 0.3)"
              >
                <span v-if="loading">
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </span>
                <span v-else>Sign In</span>
              </button>
            </div>
          </form>

          <!-- Error Message -->
          <div v-if="error" class="alert alert-danger d-flex align-items-center mb-0" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
          </div>

          <!-- Footer -->
          <div class="text-center mt-4 pt-2 text-muted small">
            &copy; {{ new Date().getFullYear() }} Dashboard Sistem Informasi
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: ''
    }
  },
  methods: {
    handleLogin() {
      this.loading = true
      this.error = ''

      // Simulasi validasi
      setTimeout(() => {
        if (this.email === 'admin@example.com' && this.password === 'admin123') {
          localStorage.setItem('isLoggedIn', 'true')
          this.$emit('login-success')
        } else {
          this.error = 'Invalid email or password. Please try again.'
        }
        this.loading = false
      }, 800)
    }
  }
}
</script>