<template>
  <main class="p-3 p-md-4 flex-grow-1">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark">Image Gallery</h4>
      <button class="btn btn-primary">
        <i class="bi bi-upload me-1"></i> Upload Images
      </button>
    </div>

    <div class="row g-3">
      <div class="col-6 col-md-4 col-lg-3" v-for="img in images" :key="img.id">
        <div class="card border shadow-sm h-100">
          <img :src="img.url" class="card-img-top" alt="Image" style="height: 180px; object-fit: cover" />
          <div class="card-body p-2">
            <p class="text-muted small mb-1 text-truncate">{{ img.name }}</p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Placeholder jika tidak ada gambar -->
    <div v-if="images.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-images display-4 d-block mb-2"></i>
      No images uploaded yet.
    </div>
  </main>
</template>

<script>
export default {
  name: 'ImagePage',
  data() {
    return {
      images: [
        { id: 1, name: 'Product Banner A', url: 'https://via.placeholder.com/300x200/4e73df/ffffff?text=Banner+A' },
        { id: 2, name: 'Logo Mockup', url: 'https://via.placeholder.com/300x200/1cc88a/ffffff?text=Logo' },
        { id: 3, name: 'Team Photo', url: 'https://via.placeholder.com/300x200/f6c23e/ffffff?text=Team' },
        { id: 4, name: 'Event 2025', url: 'https://via.placeholder.com/300x200/e74a3b/ffffff?text=Event' },
        { id: 5, name: 'Office Interior', url: 'https://via.placeholder.com/300x200/858796/ffffff?text=Office' },
        { id: 6, name: 'Product Detail', url: 'https://via.placeholder.com/300x200/36b9cc/ffffff?text=Detail' }
      ]
    }
  }
}
</script>