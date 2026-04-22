import axios from 'axios'
import { API_BASE_URL } from '../env'
import { toast } from 'react-toastify'
import { HttpStatusCodes } from '../constants/http'
import { tokenService } from './tokenService'

export const apiClient = axios.create({ baseURL: API_BASE_URL })

apiClient.interceptors.request.use((config) => {
  const token = tokenService.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === HttpStatusCodes.UNAUTHORIZED) {
      tokenService.clearAll()
      window.location.href = '/login'
    } else if (error.response?.status === HttpStatusCodes.FORBIDDEN) {
      toast.error('No tenés permisos para realizar esta acción.')
    }
    return Promise.reject(error)
  },
)
