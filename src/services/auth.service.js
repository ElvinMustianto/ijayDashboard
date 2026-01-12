import { apiPublic, apiAuth } from './api.js'

export const login = (data) => apiPublic.post('/auth/login', data)
export const refreshToken = (data) => apiPublic.post('/auth/refresh-token', data)
export const getProfile = () => apiAuth.get('/auth/me')
