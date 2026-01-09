<template>
  <main class="p-3 p-md-4 flex-grow-1">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark">Company Management</h4>
      <button class="btn btn-primary">
        <i class="bi bi-building-add me-1"></i> Add Company
      </button>
    </div>

    <div class="row g-4">
      <div class="col-12 col-md-6 col-lg-4" v-for="company in companies" :key="company.id">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-start mb-3">
              <div class="bg-light rounded p-2 me-3">
                <i class="bi bi-building fs-4 text-primary"></i>
              </div>
              <div>
                <h5 class="mb-1">{{ company.name }}</h5>
                <p class="text-muted small mb-0">{{ company.industry }}</p>
              </div>
            </div>
            <p class="text-muted small">{{ company.address }}</p>
            <div class="mt-3 d-flex justify-content-between align-items-center">
              <span class="badge bg-info">{{ company.status }}</span>
              <div>
                <button class="btn btn-sm btn-outline-primary me-1">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'CompanyPage',
  data() {
    return {
      companies: [
        {
          id: 1,
          name: 'PT Reka Cipta Selera',
          industry: 'Food & Beverage',
          address: 'Jl. Sudirman No. 123, Jakarta',
          status: 'Active'
        },
        {
          id: 2,
          name: 'CV Digital Solusi',
          industry: 'IT Services',
          address: 'Jl. Gatot Subroto No. 45, Bandung',
          status: 'Active'
        },
        {
          id: 3,
          name: 'UD Mandiri Jaya',
          industry: 'Retail',
          address: 'Jl. Diponegoro No. 78, Surabaya',
          status: 'Inactive'
        }
      ]
    }
  }
}
</script>