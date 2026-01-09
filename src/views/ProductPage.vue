<template>
  <main class="p-3 p-md-4 flex-grow-1">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark">Product Management</h4>
      <button class="btn btn-primary">
        <i class="bi bi-plus-circle me-1"></i> Add New Product
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Product Name</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in products" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td><span class="badge bg-secondary">{{ item.category }}</span></td>
                <td>Rp {{ item.price.toLocaleString() }}</td>
                <td>
                  <span :class="`badge ${item.status === 'Active' ? 'bg-success' : 'bg-warning'}`">
                    {{ item.status }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <nav>
            <ul class="pagination pagination-sm">
              <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">Next</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'ProductPage',
  data() {
    return {
      products: [
        { id: 101, name: 'Wireless Headphones', category: 'Electronics', price: 850000, status: 'Active' },
        { id: 102, name: 'Office Chair', category: 'Furniture', price: 1200000, status: 'Inactive' },
        { id: 103, name: 'Smart Watch', category: 'Electronics', price: 2500000, status: 'Active' },
        { id: 104, name: 'Coffee Maker', category: 'Appliances', price: 750000, status: 'Active' }
      ]
    }
  }
}
</script>