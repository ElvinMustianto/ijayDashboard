import { apiPublic, apiAuth } from './api.js'

// ✅ Public endpoints
export const getProducts = () => apiPublic.get('/products')
export const getProductById = (id) => apiAuth.get(`/products/${id}`)

// ✅ Protected endpoints (require auth, multipart for create/update)
export const createProduct = (formData) =>
  apiAuth.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const updateProduct = (id, formData) =>
  apiAuth.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteProduct = (id) => apiAuth.delete(`/products/${id}`)
