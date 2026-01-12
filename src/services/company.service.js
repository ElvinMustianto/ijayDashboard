import { apiPublic, apiAuth } from './api.js'

// ✅ Public endpoints
export const getCompanies = () => apiPublic.get('/companies')
export const getCompanyById = (id) => apiAuth.get(`/companies/${id}`) // jika detail juga public

// ✅ Protected endpoints (require auth)
export const createCompany = (data) => apiAuth.post('/companies', data)
export const updateCompany = (id, data) => apiAuth.put(`/companies/${id}`, data)
export const deleteCompany = (id) => apiAuth.delete(`/companies/${id}`)
