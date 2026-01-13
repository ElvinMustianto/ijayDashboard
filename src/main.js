// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// ✅ JS — gunakan ini, bukan path file .min.js
import 'bootstrap'

const app = createApp(App)
app.use(router)
app.mount('#app')