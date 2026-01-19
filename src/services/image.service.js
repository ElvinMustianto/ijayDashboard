import { apiAuth } from './api.js'

// ✅ Protected endpoints (require auth)

/**
 * Menghapus gambar berdasarkan ID
 * @param {string} id - ID gambar yang akan dihapus
 * @returns {Promise<AxiosResponse>}
 */
export const deleteImage = (id) => apiAuth.delete(`/images/${id}`)

/**
 * Menetapkan gambar sebagai gambar utama (primary)
 * @param {string} id - ID gambar yang akan dijadikan primary
 * @returns {Promise<AxiosResponse>}
 */
export const setPrimaryImage = (id) => apiAuth.patch(`/images/${id}/primary`)