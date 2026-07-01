import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const TokenManager = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem('access_token')
  },
  set: (token: string): void => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem('access_token', token)
  },
  clear: (): void => {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem('access_token')
  },
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenManager.get()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        TokenManager.clear()
        window.location.href = '/login'
      }
      
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

