<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center"
       style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)">
    <div class="col-11 col-md-7 col-lg-5 col-xl-4">
      <div class="card shadow-lg border-0 rounded-4"
           style="background: rgba(255,255,255,0.92); backdrop-filter: blur(8px)">
        <div class="card-body p-4 p-md-5">
          <div class="text-center mb-4">
            <div class="d-inline-flex justify-content-center align-items-center rounded-circle bg-primary bg-opacity-10 text-primary"
                 style="width: 64px; height: 64px; font-size: 28px">
              <i class="bi bi-shield-lock"></i>
            </div>
            <h3 class="fw-bold text-dark mt-3">Admin Dashboard</h3>
            <p class="text-muted">Enter your credentials to continue</p>
          </div>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label fw-medium">Email Address</label>
              <input type="email" class="form-control form-control-lg" v-model="email" required />
            </div>

            <div class="mb-4">
              <label class="form-label fw-medium">Password</label>
              <div class="input-group">
                <input :type="showPassword ? 'text' : 'password'" class="form-control form-control-lg" v-model="password" required />
                <button type="button" class="btn btn-outline-secondary" @click="togglePassword">
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>

            <div class="d-grid mb-3">
              <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
                <span v-if="loading">Signing in...</span>
                <span v-else>Sign In</span>
              </button>
            </div>
          </form>

          <div v-if="error" class="alert alert-danger">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/services/auth.service.js'

export default {
  name: 'LoginView',
  data() {
    return { email: '', password: '', showPassword: false, loading: false, error: '' }
  },
  methods: {
    togglePassword() { this.showPassword = !this.showPassword },
    async handleLogin() {
      this.loading = true
      this.error = ''
      try {
        const res = await login({ email: this.email, password: this.password })
        const { accessToken, id, name, email } = res.data.data

        localStorage.setItem('token', accessToken)
        localStorage.setItem('user', JSON.stringify({ id, name, email }))

        // Redirect ke dashboard
        this.$router.replace({ name: 'Dashboard' })
      } catch (err) {
        this.error = err.response?.data?.message || 'Email atau password salah.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
