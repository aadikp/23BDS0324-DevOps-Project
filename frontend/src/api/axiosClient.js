import axios from 'axios'

// ─── Base instance ────────────────────────────────────────────────────────────
const api = axios.create({
  // Use the live Render URL if running on Vercel/Netlify, otherwise fallback to local proxy
  baseURL: import.meta.env.VITE_API_URL || 'https://two3bds0324-devops-project.onrender.com/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request interceptor – attach JWT ────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ts_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor – handle 401 globally ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired / invalid → clear storage and redirect to login
      localStorage.removeItem('ts_token')
      localStorage.removeItem('ts_user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// ─── Auth helpers ─────────────────────────────────────────────────────────────
export const authApi = {
  login:    (data) => api.post('/auth/login',    data),
  register: (data) => api.post('/auth/register', data),
}

// ─── Destinations ─────────────────────────────────────────────────────────────
export const destinationsApi = {
  getAll:    ()         => api.get('/destinations'),
  getById:   (id)       => api.get(`/destinations/${id}`),
  create:    (data)     => api.post('/destinations', data),
  update:    (id, data) => api.put(`/destinations/${id}`, data),
  remove:    (id)       => api.delete(`/destinations/${id}`),
}

// ─── Recommendations ──────────────────────────────────────────────────────────
export const recommendApi = {
  get: (data) => api.post('/recommendations', data),
}

export default api
