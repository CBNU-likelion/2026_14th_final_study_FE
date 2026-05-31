import axios from 'axios'

let navigateFn: ((path: string) => void) | null = null

export function setNavigate(fn: (path: string) => void) {
  navigateFn = fn
}

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error.response?.status

    if (status === 401) {
      localStorage.removeItem('accessToken')
      navigateFn?.('/login')
    } else if (status === 403) {
      navigateFn?.('/forbidden')
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
