<template>
  <main class="p-3 p-md-4 flex-grow-1">
    <h4 class="fw-bold mb-4">Dashboard Overview</h4>

    <div class="row g-4">
      <div class="col-12 col-md-6 col-lg-3" v-for="(card, index) in stats" :key="index">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body d-flex justify-content-between align-items-start">
            <div>
              <h6 class="text-muted mb-1">{{ card.title }}</h6>
              <p class="fs-4 fw-bold mb-0">{{ card.value }}</p>
            </div>
            <div class="p-2 bg-light rounded">
              <i :class="card.icon + ' fs-4 text-primary'"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      stats: [
        { title: 'Total Pengguna', value: '1,250', icon: 'bi bi-people' },
        { title: 'Produk Aktif', value: '86', icon: 'bi bi-box' },
        { title: 'Gambar Diunggah', value: '1,024', icon: 'bi bi-image' },
        { title: 'Perusahaan Terdaftar', value: '12', icon: 'bi bi-building' }
      ]
    }
  }
}
</script>
