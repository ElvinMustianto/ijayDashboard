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
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Images</th>
                <th>Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in products" :key="item._id || item.tempId">
                <td>{{ index + 1 }}</td>
                <td>
                  <div v-if="item.images && item.images.length > 0" class="d-flex flex-wrap gap-1" style="max-width: 150px">
                    <div v-for="(img, idx) in visibleImages(item.images)" :key="img._id || idx" class="position-relative">
                      <img
                        :src="img.url"
                        alt="Product"
                        class="rounded"
                        style="width: 40px; height: 40px; object-fit: cover;"
                      />
                      <span v-if="img.isPrimary" class="position-absolute top-0 start-0 bg-success text-white rounded-circle" style="font-size:8px;width:12px;height:12px;line-height:1;">★</span>
                    </div>
                    <div v-if="item.images.length > 3" class="d-flex align-items-center justify-content-center rounded bg-light text-muted"
                         style="width: 40px; height: 40px; font-size: 12px;">
                      +{{ item.images.length - 3 }}
                    </div>
                  </div>
                  <div v-else class="text-muted d-flex align-items-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-image" style="font-size: 20px;"></i>
                  </div>
                </td>
                <td>{{ item.name }}</td>
                <td>Rp {{ item.price.toLocaleString() }}</td>
                <td>
                  <span :class="`badge ${item.isActive ? 'bg-success' : 'bg-warning'}`">
                    {{ item.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <!-- View Button -->
                  <button class="btn btn-sm btn-info me-1" @click="openDetailModal(item)">
                    <i class="bi bi-eye"></i>
                  </button>
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

    <!-- Modal: Add/Edit Product -->
    <div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true" ref="productModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="saveProduct">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingProduct._id ? 'Edit Product' : 'Add Product' }}</h5>
              <button type="button" class="btn-close" @click="closeModal('product')"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name *</label>
                <input v-model="editingProduct.name" type="text" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="editingProduct.description" class="form-control"></textarea>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Price *</label>
                  <input v-model.number="editingProduct.price" type="number" class="form-control" required min="0" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Discount Price</label>
                  <input v-model.number="editingProduct.discountPrice" type="number" class="form-control" min="0" />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Stock</label>
                <input v-model.number="editingProduct.stock" type="number" class="form-control" min="0" />
              </div>

              <div class="mb-3 form-check form-switch">
                <input v-model="editingProduct.isActive" class="form-check-input" type="checkbox" id="isActiveSwitch">
                <label class="form-check-label" for="isActiveSwitch">Active</label>
              </div>

              <!-- Images Section -->
              <div class="mb-3">
                <label class="form-label">Images (Max: 5)</label>
                <div class="d-flex flex-wrap gap-2 mb-2">
                  <!-- Existing images -->
                  <div v-for="(img, idx) in editingProduct.images" :key="img._id || idx" class="position-relative">
                    <img :src="img.url" alt="Product Image" class="rounded" style="width:100px;height:100px;object-fit:cover;" />
                    
                    <!-- Primary indicator -->
                    <div v-if="img.isPrimary" class="position-absolute top-0 start-0 bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                         style="width: 24px; height: 24px; font-size: 12px;">
                      ★
                    </div>

                    <!-- Action buttons -->
                    <div class="position-absolute bottom-0 start-0 w-100 d-flex justify-content-between px-1">
                      <button
                        v-if="!img.isPrimary"
                        type="button"
                        class="btn btn-sm btn-outline-warning p-1"
                        @click="makePrimary(img._id)"
                        title="Set as primary"
                      >
                        <i class="bi bi-star"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-danger p-1"
                        @click="removeExistingImage(idx)"
                        title="Remove image"
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>

                  <!-- New image previews -->
                  <div v-for="(file, idx) in newImagePreviews" :key="`new-${idx}`" class="position-relative">
                    <img :src="file" alt="New Preview" class="rounded" style="width:100px;height:100px;object-fit:cover;" />
                    <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 p-1" @click="removeNewImage(idx)">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleImageUpload"
                  class="form-control"
                  :disabled="totalImageCount >= 5"
                />
                <small class="text-muted">Maximum 5 images allowed.</small>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal('product')">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="isSaving">
                {{ isSaving ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal: Product Detail (View Only) -->
    <div class="modal fade" id="productDetailModal" tabindex="-1" aria-hidden="true" ref="productDetailModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Product Details</h5>
            <button type="button" class="btn-close" @click="closeModal('detail')"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <h6>Name</h6>
                <p>{{ viewingProduct.name }}</p>

                <h6>Description</h6>
                <p>{{ viewingProduct.description || '-' }}</p>

                <h6>Price</h6>
                <p>Rp {{ viewingProduct.price?.toLocaleString() || '0' }}</p>

                <h6>Discount Price</h6>
                <p>Rp {{ viewingProduct.discountPrice?.toLocaleString() || '-' }}</p>

                <h6>Stock</h6>
                <p>{{ viewingProduct.stock || '0' }}</p>

                <h6>Status</h6>
                <span :class="`badge ${viewingProduct.isActive ? 'bg-success' : 'bg-warning'}`">
                  {{ viewingProduct.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="col-md-6">
                <h6>Images</h6>
                <div v-if="viewingProduct.images && viewingProduct.images.length > 0" class="d-flex flex-wrap gap-2">
                  <div v-for="(img, idx) in viewingProduct.images" :key="img._id || idx" class="position-relative">
                    <img
                      :src="img.url"
                      alt="Product"
                      class="rounded"
                      style="width: 100px; height: 100px; object-fit: cover;"
                    />
                    <span v-if="img.isPrimary" class="position-absolute top-0 start-0 bg-success text-white rounded-circle" style="font-size:10px;width:20px;height:20px;line-height:1.2;">★</span>
                  </div>
                </div>
                <p v-else class="text-muted">No images available.</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal('detail')">Close</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<!-- ... template tetap sama ... -->

<script>
import { getProducts, deleteProduct, createProduct, updateProduct } from '@/services/product.service.js'
import { setPrimaryImage } from '@/services/image.service.js'
import { Modal } from 'bootstrap'

export default {
  name: 'ProductPage',
  data() {
    return {
      products: [],
      loading: false,
      error: '',
      isSaving: false,
      editingProduct: {},
      newImageFiles: [],
      newImagePreviews: [],
      viewingProduct: {},
      productModal: null,
      productDetailModal: null
    }
  },
  computed: {
    totalImageCount() {
      return (this.editingProduct.images?.length || 0) + this.newImagePreviews.length
    }
  },
  methods: {
    visibleImages(images) {
      return images.slice(0, 3)
    },

    async fetchProducts() {
      this.loading = true
      this.error = ''
      try {
        const res = await getProducts()
        this.products = (res.data.data || []).map(p => ({
          ...p,
          images: (p.images || []).map(img => ({
            ...img,
            url: img.url?.trim() || '',
            isPrimary: Boolean(img.isPrimary)
          })),
          tempId: p._id || Date.now() + Math.random()
        }))
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load products.'
      } finally {
        this.loading = false
      }
    },

    openAddModal() {
      this.editingProduct = {
        name: '',
        description: '',
        price: 0,
        discountPrice: 0,
        stock: 0,
        isActive: true,
        images: []
      }
      this.newImageFiles = []
      this.newImagePreviews = []
      this.showModal('product')
    },

    // ✅ PERBAIKAN UTAMA: Hindari JSON.parse(JSON.stringify)
    openEditModal(product) {
      // Salin hanya field yang diperlukan, pastikan _id gambar tetap ada
      this.editingProduct = {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        isActive: product.isActive,
        images: (product.images || []).map(img => ({
          _id: img._id,           // ← JANGAN HILANGKAN INI!
          url: img.url?.trim() || '',
          isPrimary: Boolean(img.isPrimary),
          // Opsional: salin field lain jika diperlukan di UI
          publicId: img.publicId,
          filename: img.filename
        }))
      }
      this.newImageFiles = []
      this.newImagePreviews = []
      this.showModal('product')
    },

    openDetailModal(product) {
      this.viewingProduct = {
        ...product,
        images: (product.images || []).map(img => ({
          ...img,
          url: img.url?.trim() || '',
          isPrimary: Boolean(img.isPrimary)
        }))
      }
      this.showModal('detail')
    },

    showModal(type) {
      if (type === 'product') {
        if (!this.productModal) {
          this.productModal = new Modal(this.$refs.productModal)
        }
        this.productModal.show()
      } else if (type === 'detail') {
        if (!this.productDetailModal) {
          this.productDetailModal = new Modal(this.$refs.productDetailModal)
        }
        this.productDetailModal.show()
      }
    },

    closeModal(type) {
      if (type === 'product') {
        this.productModal?.hide()
      } else if (type === 'detail') {
        this.productDetailModal?.hide()
      }
    },

    handleImageUpload(e) {
      const files = Array.from(e.target.files)
      const remainingSlots = 5 - this.totalImageCount
      if (remainingSlots <= 0) {
        alert('Maximum 5 images allowed.')
        return
      }
      const allowedFiles = files.slice(0, remainingSlots)
      this.newImageFiles.push(...allowedFiles)
      allowedFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (ev) => {
          this.newImagePreviews.push(ev.target.result)
        }
        reader.readAsDataURL(file)
      })
      e.target.value = ''
    },

    removeExistingImage(index) {
      this.editingProduct.images.splice(index, 1)
    },

    removeNewImage(index) {
      this.newImageFiles.splice(index, 1)
      this.newImagePreviews.splice(index, 1)
    },

    // ✅ PERBAIKAN: Tambahkan validasi & logging
    async makePrimary(imageId) {
      if (!imageId) {
        alert('Image ID is missing. Please refresh the page.')
        return
      }

      try {
        await setPrimaryImage(imageId)
        // Update local state
        this.editingProduct.images = this.editingProduct.images.map(img => ({
          ...img,
          isPrimary: img._id === imageId
        }))
        // Opsional: sukses feedback
        // console.log('Primary image updated:', imageId)
      } catch (err) {
        console.error('Set primary error:', err)
        const msg = err.response?.data?.message || 'Failed to set primary image.'
        alert(msg)
      }
    },

    async saveProduct() {
      this.isSaving = true
      try {
        const formData = new FormData()
        formData.append('name', this.editingProduct.name)
        if (this.editingProduct.description) formData.append('description', this.editingProduct.description)
        formData.append('price', String(this.editingProduct.price))
        if (this.editingProduct.discountPrice) formData.append('discountPrice', String(this.editingProduct.discountPrice))
        if (this.editingProduct.stock != null) formData.append('stock', String(this.editingProduct.stock))
        formData.append('isActive', String(this.editingProduct.isActive))
        this.newImageFiles.forEach(file => {
          formData.append('images', file)
        })

        if (this.editingProduct._id) {
          await updateProduct(this.editingProduct._id, formData)
        } else {
          await createProduct(formData)
        }

        await this.fetchProducts()
        this.closeModal('product')
      } catch (err) {
        console.error('Save product error:', err)
        alert(err.response?.data?.message || 'Failed to save product.')
      } finally {
        this.isSaving = false
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