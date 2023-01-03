import axios from 'axios'
import configs from './dev.config'

const instance = axios.create({
  baseURL: configs.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'text/json',
  },
})

instance.interceptors.request.use((config) => {
  const token = localStorage.accessToken
  if (config.headers) {
    config.headers.Authorization = `Bearer ${token}` || ''
  }
  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (window.location.pathname !== '/sign-up' && error.response.status === 401) {
      localStorage.clear()
      window.location.href = '/sign-in'
    }
    return error
  },
)

export default instance
