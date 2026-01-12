<template>
  <main class="p-3 p-md-4 flex-grow-1">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark">Product Management</h4>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="bi bi-plus-circle me-1"></i> Add New Product
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

        <!-- Empty State -->
        <div v-else-if="products.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-box-seam display-4 d-block mb-2"></i>
          No products available.
        </div>

        <!-- Products Table -->
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in products" :key="item._id || item.tempId">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>Rp {{ item.price.toLocaleString() }}</td>
                <td>
                  <span :class="`badge ${item.isActive ? 'bg-success' : 'bg-warning'}`">
                    {{ item.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="openEditModal(item)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="handleDelete(item._id || item.tempId)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Add/Edit -->
    <div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true" ref="modal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="saveProduct">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingProduct._id ? 'Edit Product' : 'Add Product' }}</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="editingProduct.name" type="text" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="editingProduct.description" class="form-control"></textarea>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Price</label>
                  <input v-model.number="editingProduct.price" type="number" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Discount Price</label>
                  <input v-model.number="editingProduct.discountPrice" type="number" class="form-control" />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Stock</label>
                <input v-model.number="editingProduct.stock" type="number" class="form-control" />
              </div>

              <div class="mb-3 form-check form-switch">
                <input v-model="editingProduct.isActive" class="form-check-input" type="checkbox" id="isActiveSwitch">
                <label class="form-check-label" for="isActiveSwitch">Active</label>
              </div>

              <div class="mb-3">
                <label class="form-label">Images</label>
                <div class="d-flex flex-wrap gap-2">
                  <!-- Existing images -->
                  <div v-for="img in editingProduct.images || []" :key="img._id" class="position-relative">
                    <img :src="img.url" alt="Product Image" class="rounded" style="width:100px;height:100px;object-fit:cover;" />
                    <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 p-1" @click="removeImage(img._id)">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>

                  <!-- Upload new images -->
                  <input type="file" multiple @change="handleImageUpload" class="form-control" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </main>
</template>

<script>
import { getProducts, deleteProduct, createProduct, updateProduct } from '@/services/product.service.js'
import { Modal } from 'bootstrap'

export default {
  name: 'ProductPage',
  data() {
    return {
      products: [],
      loading: false,
      error: '',
      editingProduct: {}, // Produk yang sedang ditambah/di edit
      newImages: [], // File image baru yang akan diupload
      modalInstance: null
    }
  },
  methods: {
    async fetchProducts() {
      this.loading = true
      this.error = ''
      try {
        const res = await getProducts()
        this.products = (res.data.data || []).map(p => ({
          ...p,
          tempId: p._id || Date.now() + Math.random(),
          images: p.image ? [p.image] : []
        }))
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load products.'
      } finally {
        this.loading = false
      }
    },

    openAddModal() {
      this.editingProduct = { name: '', description: '', price: 0, discountPrice: 0, stock: 0, isActive: true, images: [] }
      this.newImages = []
      this.showModal()
    },

    openEditModal(product) {
      this.editingProduct = JSON.parse(JSON.stringify(product))
      this.newImages = []
      this.showModal()
    },

    showModal() {
      if (!this.modalInstance) {
        this.modalInstance = new Modal(this.$refs.modal)
      }
      this.modalInstance.show()
    },

    closeModal() {
      if (this.modalInstance) this.modalInstance.hide()
    },

    handleImageUpload(e) {
      this.newImages = Array.from(e.target.files)
    },

    removeImage(imageId) {
      this.editingProduct.images = this.editingProduct.images.filter(img => img._id !== imageId)
    },

    async saveProduct() {
      try {
        const formData = new FormData()
        formData.append('name', this.editingProduct.name)
        formData.append('description', this.editingProduct.description)
        formData.append('price', this.editingProduct.price)
        formData.append('discountPrice', this.editingProduct.discountPrice)
        formData.append('stock', this.editingProduct.stock)
        formData.append('isActive', this.editingProduct.isActive)

        this.newImages.forEach(file => {
          formData.append('images', file)
        })

        if (this.editingProduct._id) {
          // Update product
          await updateProduct(this.editingProduct._id, formData)
        } else {
          // Create new product
          await createProduct(formData)
        }

        this.fetchProducts()
        this.closeModal()
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to save product.')
      }
    },

    async handleDelete(id) {
      if (!confirm('Are you sure you want to delete this product?')) return
      try {
        await deleteProduct(id)
        this.products = this.products.filter(p => (p._id || p.tempId) !== id)
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product.')
      }
    }
  },

  mounted() {
    this.fetchProducts()
  }
}
</script>
