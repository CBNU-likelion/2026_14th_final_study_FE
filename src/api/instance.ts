import axios from 'axios'

const BACKEND_URL = import.meta.env.DEV ? '/api' : 'http://158.247.237.175:8080/api'

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status

    if (status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }

    if (status === 403) {
      window.location.href = '/forbidden'
    }

    return Promise.reject(error)
  },
)

export default api
