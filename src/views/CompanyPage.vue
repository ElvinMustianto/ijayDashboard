<template>
  <main class="p-3 p-md-4 flex-grow-1">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark">Company Management</h4>
      <div>
        <button class="btn btn-primary me-2" @click="openAddModal">
          <i class="bi bi-building-add me-1"></i> Add Company
        </button>
      </div>
    </div>

    <!-- Loading & Error -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Companies List -->
    <div class="row g-4" v-else>
      <div
        class="col-12 col-md-6 col-lg-4"
        v-for="(company, index) in companies"
        :key="company.id || company.tempId"
      >
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-start mb-3">
              <div class="bg-light rounded p-2 me-3">
                <i class="bi bi-building fs-4 text-primary"></i>
              </div>
              <div>
                <h5 class="mb-1">{{ index + 1 }}. {{ company.name }}</h5>
                <p class="text-muted small mb-0">{{ company.industry }}</p>
              </div>
            </div>
            <p class="text-muted small">{{ formatAddress(company.address) }}</p>
            <div class="mt-3 d-flex justify-content-between align-items-center">
              <span
                class="badge"
                :class="company.isActive ? 'bg-success' : 'bg-warning'"
              >
                {{ company.isActive ? "Active" : "Inactive" }}
              </span>
              <div>
                <button
                  class="btn btn-sm btn-outline-info me-1"
                  @click="openDetailModal(company)"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-primary me-1"
                  @click="openEditModal(company)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="handleDelete(company.id || company.tempId)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Add/Edit Company -->
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

    <!-- Modal Detail -->
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
  </main>
</template>

<script>
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "@/services/company.service.js";
import { Modal } from "bootstrap";

export default {
  name: "CompanyPage",

  data() {
    return {
      companies: [],
      loading: false,
      error: "",
      editingCompany: {},
      detailCompany: {},
      modalInstance: null,
      detailModalInstance: null,
    };
  },

  methods: {
    /* =========================
     * FETCH DATA
     * ========================= */
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
  },

  mounted() {
    this.fetchCompanies();
  },
};
</script>

<style scoped>
.modal-body-scroll {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
