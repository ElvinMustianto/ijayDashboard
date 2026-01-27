<!-- src/views/DashboardView.vue -->
<template>
  <main class="p-3 p-md-4 flex-grow-1">
    <h4 class="fw-bold mb-4">Dashboard Overview</h4>

    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
      <div
        class="col-12 col-md-6 col-lg-3"
        v-for="(card, index) in stats"
        :key="index"
      >
        <div class="card border-0 shadow-sm h-100 hover-shadow">
          <div
            class="card-body d-flex justify-content-between align-items-center"
          >
            <div>
              <h6 class="text-muted mb-1">{{ card.title }}</h6>
              <p class="fs-4 fw-bold mb-0">{{ card.value }}</p>
            </div>
            <div
              class="p-2 bg-light rounded-circle d-flex align-items-center justify-content-center"
            >
              <i :class="card.icon + ' fs-4 text-primary'"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Companies Table -->
    <div class="card border-0 shadow-sm mb-4">
  <div class="card-header d-flex justify-content-between align-items-center">
    <h6 class="mb-0">Companies</h6>
    <div class="d-flex gap-2">
      <button class="btn btn-sm btn-primary" @click="fetchCompanies">
        <i class="bi bi-arrow-repeat me-1"></i> Refresh
      </button>
    </div>
  </div>
  <div class="card-body p-0">
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading companies...</p>
    </div>
    <table v-else class="table table-hover mb-0">
      <thead class="table-light">
        <tr>
          <th style="width: 5%">#</th>
          <th style="width: 30%">Name</th>
          <th style="width: 20%">Industry</th>
          <th style="width: 20%">Email</th>
          <th style="width: 15%">Status</th>
          <th style="width: 10%" class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(company, idx) in companies"
          :key="company._id || company.tempId"
          class="align-middle"
        >
          <td class="fw-bold">{{ idx + 1 }}</td>
          <td>
            <div class="d-flex align-items-center">
              <i class="bi bi-building me-2 text-primary"></i>
              <span class="fw-medium">{{ company.name }}</span>
            </div>
          </td>
          <td>{{ company.industry || '-' }}</td>
          <td>
            <a :href="`mailto:${company.email}`" class="text-decoration-none text-primary">
              {{ company.email || '-' }}
            </a>
          </td>
          <td>
            <span
              :class="
                company.isActive
                  ? 'badge bg-success'
                  : 'badge bg-warning'
              "
            >
              {{ company.isActive ? "Active" : "Inactive" }}
            </span>
          </td>
          <td class="text-end">
            <div class="d-flex justify-content-end gap-1">
              <button
                class="btn btn-sm btn-info"
                title="View Details"
                @click="openDetailModal(company)"
              >
                <i class="bi bi-eye"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-primary"
                title="Edit"
                @click="openEditModal(company)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                title="Delete"
                @click="handleDelete(company._id || company.tempId)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="companies.length === 0">
          <td colspan="6" class="text-center py-4">
            <div class="text-muted">
              <i class="bi bi-inbox fs-1 d-block mb-2"></i>
              <p class="mb-0">No companies found</p>
              <small class="text-muted">Click "Add Company" to create one</small>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    <!-- Products Table (limit 5) -->
    <div class="card border-0 shadow-sm mb-4">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h6 class="mb-0">Products (Last 5)</h6>
        <button class="btn btn-sm btn-primary" @click="fetchProducts">
          <i class="bi bi-arrow-repeat me-1"></i> Refresh
        </button>
      </div>
      <div class="card-body p-0">
        <div v-if="loadingProducts" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
        <table v-else class="table table-hover mb-0 align-middle">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Images</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(product, idx) in products.slice(0, 5)"
              :key="product._id || product.tempId"
            >
              <td>{{ idx + 1 }}</td>
              <td>
                <div
                  v-if="product.images && product.images.length > 0"
                  class="d-flex flex-wrap gap-1"
                  style="max-width: 120px"
                >
                  <img
                    v-for="(img, i) in visibleImages(product.images)"
                    :key="img._id || i"
                    :src="img.url"
                    alt="Product"
                    class="rounded"
                    style="width: 40px; height: 40px; object-fit: cover"
                  />
                  <div
                    v-if="product.images.length > 3"
                    class="d-flex align-items-center justify-content-center rounded bg-light text-muted"
                    style="width: 40px; height: 40px; font-size: 12px"
                  >
                    +{{ product.images.length - 3 }}
                  </div>
                </div>
                <div
                  v-else
                  class="text-muted d-flex align-items-center"
                  style="width: 40px; height: 40px"
                >
                  <i class="bi bi-image" style="font-size: 20px"></i>
                </div>
              </td>
              <td>{{ product.name }}</td>
              <td>Rp {{ product.price.toLocaleString() }}</td>
              <td>{{ product.stock }}</td>
              <td>
                <span
                  :class="
                    product.isActive ? 'badge bg-success' : 'badge bg-warning'
                  "
                >
                  {{ product.isActive ? "Active" : "Inactive" }}
                </span>
              </td>
              <td class="text-end">
                <button
                  class="btn btn-sm btn-info me-1"
                  @click="viewProduct(product)"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-primary me-1"
                  @click="editProduct(product)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="handleDeleteProduct(product._id || product.tempId)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td colspan="7" class="text-center text-muted">
                No products found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- =============== MODALS =============== -->

    <div
      class="modal fade"
      id="companyModal"
      tabindex="-1"
      aria-hidden="true"
      ref="modal"
    >
      <div
        class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
      >
        <div class="modal-content">
          <form @submit.prevent="saveCompany">
            <!-- ================= HEADER ================= -->
            <div class="modal-header sticky-top bg-white border-bottom">
              <h5 class="modal-title fw-bold">
                {{ editingCompany.id ? "Edit Company" : "Add Company" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeModal"
              ></button>
            </div>

            <!-- ================= BODY ================= -->
            <div class="modal-body modal-body-scroll">
              <div class="row g-3">
                <!-- BASIC INFO -->
                <div class="col-md-6">
                  <label class="form-label">Company Name</label>
                  <input
                    v-model="editingCompany.name"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Industry</label>
                  <input
                    v-model="editingCompany.industry"
                    type="text"
                    class="form-control"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input
                    v-model="editingCompany.email"
                    type="email"
                    class="form-control"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Phone</label>
                  <input
                    v-model="editingCompany.phone"
                    type="text"
                    class="form-control"
                  />
                </div>

                <!-- ADDRESS -->
                <div class="col-12">
                  <label class="form-label">Address</label>
                  <textarea
                    v-model="editingCompany.addressText"
                    class="form-control"
                    rows="2"
                  ></textarea>
                </div>

                <!-- 📍 LOCATION -->
                <div class="col-12">
                  <div class="p-3 border rounded-3 bg-light">
                    <label class="form-label fw-semibold mb-2">
                      <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                      Company Location
                    </label>

                    <div class="row g-2">
                      <div class="col-md-6">
                        <label class="form-label small">Latitude</label>
                        <input
                          v-model.number="editingCompany.lat"
                          type="number"
                          step="any"
                          class="form-control"
                          placeholder="-6.914744"
                        />
                      </div>

                      <div class="col-md-6">
                        <label class="form-label small">Longitude</label>
                        <input
                          v-model.number="editingCompany.lng"
                          type="number"
                          step="any"
                          class="form-control"
                          placeholder="107.609810"
                        />
                      </div>
                    </div>

                    <small class="text-muted d-block mt-1">
                      Format koordinat Google Maps (latitude, longitude)
                    </small>
                  </div>
                </div>

                <!-- DESCRIPTION -->
                <div class="col-12">
                  <div class="p-3 border rounded-3 bg-light">
                    <label class="form-label fw-semibold">
                      <i class="bi bi-card-text me-1"></i> Description
                    </label>
                    <textarea
                      v-model="editingCompany.description"
                      class="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <!-- VISION -->
                <div class="col-12">
                  <div class="p-3 border rounded-3">
                    <label class="form-label fw-semibold text-primary">
                      <i class="bi bi-eye me-1"></i> Vision
                    </label>
                    <textarea
                      v-model="editingCompany.vision"
                      class="form-control"
                      rows="2"
                    ></textarea>
                  </div>
                </div>

                <!-- MISSION -->
                <div class="col-12">
                  <div class="p-3 border rounded-3">
                    <div
                      class="d-flex justify-content-between align-items-center mb-2"
                    >
                      <label class="form-label fw-semibold text-success mb-0">
                        <i class="bi bi-bullseye me-1"></i> Mission
                      </label>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-success"
                        @click="addMission"
                      >
                        <i class="bi bi-plus"></i> Add
                      </button>
                    </div>

                    <div
                      v-for="(mission, index) in editingCompany.missions"
                      :key="index"
                      class="input-group mb-2"
                    >
                      <span class="input-group-text">{{ index + 1 }}</span>
                      <input
                        v-model="editingCompany.missions[index]"
                        type="text"
                        class="form-control"
                      />
                      <button
                        type="button"
                        class="btn btn-outline-danger"
                        @click="removeMission(index)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- STATUS -->
                <div class="col-12 form-check form-switch mt-2">
                  <input
                    v-model="editingCompany.isActive"
                    type="checkbox"
                    class="form-check-input"
                    id="statusSwitch"
                  />
                  <label class="form-check-label" for="statusSwitch">
                    {{ editingCompany.isActive ? "Active" : "Inactive" }}
                  </label>
                </div>
              </div>
            </div>

            <!-- ================= FOOTER ================= -->
            <div class="modal-footer sticky-bottom bg-white border-top">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Detail Company -->
    <div
      class="modal fade"
      id="companyDetailModal"
      tabindex="-1"
      aria-hidden="true"
      ref="detailModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ detailCompany.name }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeDetailModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <strong>Industry:</strong>
                <p>{{ detailCompany.industry || "-" }}</p>
              </div>
              <div class="col-12 col-md-6">
                <strong>Status:</strong>
                <p>
                  <span
                    :class="
                      detailCompany.isActive
                        ? 'badge bg-success'
                        : 'badge bg-warning'
                    "
                  >
                    {{ detailCompany.isActive ? "Active" : "Inactive" }}
                  </span>
                </p>
              </div>
              <div class="col-12 col-md-6">
                <strong>Email:</strong>
                <p>{{ detailCompany.email || "-" }}</p>
              </div>
              <div class="col-12 col-md-6">
                <strong>Phone:</strong>
                <p>{{ detailCompany.phone || "-" }}</p>
              </div>
              <div class="col-12">
                <strong>Address:</strong>
                <p>{{ formatAddress(detailCompany.address) || "-" }}</p>
              </div>
              <div class="col-12">
                <strong>Vision:</strong>
                <p>{{ detailCompany.vision || "-" }}</p>
              </div>
              <div class="col-12">
                <strong>Description:</strong>
                <p>{{ detailCompany.description || "-" }}</p>
              </div>
              <div
                class="col-12"
                v-if="detailCompany.mission && detailCompany.mission.length"
              >
                <strong>Mission:</strong>
                <ul class="mb-0">
                  <li v-for="(m, idx) in detailCompany.mission" :key="idx">
                    {{ m }}
                  </li>
                </ul>
              </div>
              <div class="col-12" v-else>
                <strong>Mission:</strong>
                <p>-</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeDetailModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Modal: Edit/Add -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      aria-hidden="true"
      ref="productModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="saveProduct">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ editingProduct._id ? "Edit Product" : "Add Product" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeProductModal"
              ></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  v-model="editingProduct.name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea
                  v-model="editingProduct.description"
                  class="form-control"
                ></textarea>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Price</label>
                  <input
                    v-model.number="editingProduct.price"
                    type="number"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Discount Price</label>
                  <input
                    v-model.number="editingProduct.discountPrice"
                    type="number"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Stock</label>
                <input
                  v-model.number="editingProduct.stock"
                  type="number"
                  class="form-control"
                />
              </div>

              <div class="mb-3 form-check form-switch">
                <input
                  v-model="editingProduct.isActive"
                  class="form-check-input"
                  type="checkbox"
                  id="isActiveSwitch"
                />
                <label class="form-check-label" for="isActiveSwitch"
                  >Active</label
                >
              </div>

              <div class="mb-3">
                <label class="form-label">Images</label>
                <div class="d-flex flex-wrap gap-2">
                  <div
                    v-for="img in editingProduct.images || []"
                    :key="img._id"
                    class="position-relative"
                  >
                    <img
                      :src="img.url"
                      alt="Product Image"
                      class="rounded"
                      style="width: 100px; height: 100px; object-fit: cover"
                    />
                    <button
                      type="button"
                      class="btn btn-sm btn-danger position-absolute top-0 end-0 p-1"
                      @click="removeImage(img._id)"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                  <input
                    type="file"
                    multiple
                    @change="handleImageUpload"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeProductModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="savingProduct"
              >
                {{ savingProduct ? "Saving..." : "Save" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Product Modal: Detail (View Only) -->
    <div
      class="modal fade"
      id="productDetailModal"
      tabindex="-1"
      aria-hidden="true"
      ref="productDetailModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Product Details</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeProductDetailModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <h6>Name</h6>
                <p>{{ viewingProduct.name }}</p>

                <h6>Description</h6>
                <p>{{ viewingProduct.description || "-" }}</p>

                <h6>Price</h6>
                <p>Rp {{ viewingProduct.price?.toLocaleString() || "0" }}</p>

                <h6>Discount Price</h6>
                <p>
                  Rp {{ viewingProduct.discountPrice?.toLocaleString() || "-" }}
                </p>

                <h6>Stock</h6>
                <p>{{ viewingProduct.stock || "0" }}</p>

                <h6>Status</h6>
                <span
                  :class="`badge ${viewingProduct.isActive ? 'bg-success' : 'bg-warning'}`"
                >
                  {{ viewingProduct.isActive ? "Active" : "Inactive" }}
                </span>
              </div>
              <div class="col-md-6">
                <h6>Images</h6>
                <div
                  v-if="
                    viewingProduct.images && viewingProduct.images.length > 0
                  "
                  class="d-flex flex-wrap gap-2"
                >
                  <img
                    v-for="(img, idx) in viewingProduct.images"
                    :key="img._id || idx"
                    :src="img.url"
                    alt="Product"
                    class="rounded"
                    style="width: 100px; height: 100px; object-fit: cover"
                  />
                </div>
                <p v-else class="text-muted">No images available.</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeProductDetailModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {
  getCompanies,
  deleteCompany,
  createCompany,
  updateCompany,
} from "@/services/company.service.js";
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "@/services/product.service.js";
import { Modal } from "bootstrap";

export default {
  name: "DashboardView",
  data() {
    return {
      stats: [
        { title: "Produk Aktif", value: 0, icon: "bi bi-box" },
        { title: "Perusahaan Terdaftar", value: 0, icon: "bi bi-building" },
      ],
      companies: [],
      products: [],
      loadingCompanies: false,
      loadingProducts: false,
      savingCompany: false,
      savingProduct: false,

      // Company
      editingCompany: {},
      detailCompany: {},

      // Product
      editingProduct: {},
      viewingProduct: {},

      // Modals
      companyModal: null,
      companyDetailModal: null,
      productModal: null,
      productDetailModal: null,
    };
  },
  methods: {
    visibleImages(images) {
      return images.slice(0, 3);
    },

    async fetchProducts() {
      this.loadingProducts = true;
      try {
        const res = await getProducts();
        // 🔹 Trim URL gambar & pastikan struktur konsisten
        this.products = (res.data.data || []).map((p) => {
          const cleanImages = (p.images || []).map((img) => ({
            ...img,
            url: img.url ? img.url.trim() : "",
          }));
          return { ...p, images: cleanImages };
        });
        this.updateStats();
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        this.loadingProducts = false;
      }
    },

    updateStats() {
      this.stats[0].value = this.products.filter((p) => p.isActive).length;
      this.stats[1].value = this.companies.length;
    },

    // --- Company ---
    async fetchCompanies() {
      this.loading = true;
      this.error = "";
      try {
        const res = await getCompanies();
        const list = res?.data?.data || [];

        this.companies = list.map((c) => ({
          ...c,
          id: c.id || c._id,
          tempId: c.id || c._id || Date.now() + Math.random(),
        }));
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to load companies.";
      } finally {
        this.loading = false;
      }
    },

    /* =========================
     * HELPERS
     * ========================= */
    formatAddress(addr) {
      if (!addr) return "";
      return [addr.street, addr.city, addr.province].filter(Boolean).join(", ");
    },

    /* =========================
     * MODAL HANDLING
     * ========================= */
    openAddModal() {
      this.editingCompany = {
        id: null,
        name: "",
        industry: "",
        email: "",
        phone: "",
        addressText: "",
        description: "",
        vision: "",
        missions: [],
        lat: null,
        lng: null,
        isActive: true,
      };
      this.showModal();
    },

    openEditModal(company) {
      this.editingCompany = {
        id: company.id || company._id,
        name: company.name || "",
        industry: company.industry || "",
        email: company.email || "",
        phone: company.phone || "",
        addressText: company.address
          ? [
              company.address.street,
              company.address.city,
              company.address.province,
            ]
              .filter(Boolean)
              .join(", ")
          : "",
        description: company.description || "",
        vision: company.vision || "",
        missions: Array.isArray(company.mission) ? [...company.mission] : [],
        lat: company.location?.lat ?? null,
        lng: company.location?.lng ?? null,
        isActive: company.isActive ?? true,
      };
      this.showModal();
    },

    showModal() {
      if (!this.modalInstance) {
        this.modalInstance = new Modal(this.$refs.modal);
      }
      this.modalInstance.show();
    },

    closeModal() {
      this.modalInstance?.hide();
    },

    openDetailModal(company) {
      this.detailCompany = { ...company };
      if (!this.detailModalInstance) {
        this.detailModalInstance = new Modal(this.$refs.detailModal);
      }
      this.detailModalInstance.show();
    },

    closeDetailModal() {
      this.detailModalInstance?.hide();
    },

    /* =========================
     * MISSION HANDLER
     * ========================= */
    addMission() {
      this.editingCompany.missions.push("");
    },

    removeMission(index) {
      this.editingCompany.missions.splice(index, 1);
    },

    /* =========================
     * SAVE (FIX UTAMA)
     * ========================= */
    async saveCompany() {
      try {
        const addressParts = this.editingCompany.addressText
          .split(",")
          .map((v) => v.trim());

        const payload = {
          name: this.editingCompany.name,
          industry: this.editingCompany.industry,
          email: this.editingCompany.email,
          phone: this.editingCompany.phone,
          description: this.editingCompany.description,
          vision: this.editingCompany.vision,
          mission: (this.editingCompany.missions || []).filter(Boolean),
          isActive: this.editingCompany.isActive,
          address: {
            street: addressParts[0] || "",
            city: addressParts[1] || "",
            province: addressParts[2] || "",
            country: "Indonesia",
          },
          location: {
            lat: this.editingCompany.lat,
            lng: this.editingCompany.lng,
          },
        };

        if (this.editingCompany.id) {
          await updateCompany(this.editingCompany.id, payload);
        } else {
          await createCompany(payload);
        }

        await this.fetchCompanies();
        this.closeModal();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to save company.");
      }
    },

    /* =========================
     * DELETE
     * ========================= */
    async handleDelete(id) {
      if (!confirm("Are you sure you want to delete this company?")) return;
      try {
        await deleteCompany(id);
        this.companies = this.companies.filter(
          (c) => (c.id || c.tempId) !== id,
        );
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete company.");
      }
    },

    // --- Product ---
    viewProduct(product) {
      const cleanProduct = { ...product };
      cleanProduct.images = (product.images || []).map((img) => ({
        ...img,
        url: img.url ? img.url.trim() : "",
      }));
      this.viewingProduct = cleanProduct;
      if (!this.productDetailModal) {
        this.productDetailModal = new Modal(this.$refs.productDetailModal);
      }
      this.productDetailModal.show();
    },
    editProduct(product) {
      const cloned = JSON.parse(JSON.stringify(product));
      cloned.images = (cloned.images || []).map((img) => ({
        ...img,
        url: img.url ? img.url.trim() : "",
      }));
      this.editingProduct = cloned;
      if (!this.productModal) {
        this.productModal = new Modal(this.$refs.productModal);
      }
      this.productModal.show();
    },
    closeProductModal() {
      this.productModal?.hide();
    },
    closeProductDetailModal() {
      this.productDetailModal?.hide();
    },
    async saveProduct() {
      this.savingProduct = true;
      try {
        if (this.editingProduct._id) {
          await updateProduct(this.editingProduct._id, this.editingProduct);
        } else {
          await createProduct(this.editingProduct);
        }
        await this.fetchProducts();
        this.closeProductModal();
        this.editingProduct = {};
      } catch (err) {
        alert("Failed to save product.");
        console.error(err);
      } finally {
        this.savingProduct = false;
      }
    },
    async handleDeleteProduct(id) {
      if (!confirm("Are you sure want to delete this product?")) return;
      try {
        await deleteProduct(id);
        this.products = this.products.filter((p) => p._id !== id);
        this.updateStats();
      } catch (err) {
        alert("Failed to delete product.");
        console.error(err);
      }
    },

    // Helpers
    formatAddress(addr) {
      if (!addr) return "";
      return `${addr.street}, ${addr.city}, ${addr.province}, ${addr.postalCode}, ${addr.country}`;
    },
    handleImageUpload(event) {
      console.log("File selected:", event.target.files);
    },
    removeImage(imageId) {
      this.editingProduct.images = this.editingProduct.images.filter(
        (img) => img._id !== imageId,
      );
    },
  }, // 👈 KOMA DI SINI WAJIB!

  // Sekarang mounted() ada DI DALAM export default
  mounted() {
    this.fetchCompanies();
    this.fetchProducts();
  },
};
</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s;
}
.modal-body-scroll {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
