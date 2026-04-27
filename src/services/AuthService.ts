import axios from "axios"
import type { RegisterData, LoginData, AuthResponseUsuario } from "../types/UsuarioTypes"
import { API_BASE_URL, AUTH_PATH } from "../env"
import { tokenService } from "./tokenService"

class AuthService {
  async login(data: LoginData): Promise<AuthResponseUsuario> {
    const response = await axios.post<AuthResponseUsuario>(
      `${API_BASE_URL}${AUTH_PATH('login')}`,
      data,
    )
    if (response.data.success && response.data.usuario) {
      tokenService.setIdUsuario(response.data.usuario.id)
      tokenService.setNombreUsuario(response.data.usuario.nombre)
      tokenService.setTipoUsuario(response.data.usuario.tipoUsuario)
      tokenService.setToken(response.data.token)
    }
    return response.data
  }

  async registro(data: RegisterData): Promise<AuthResponseUsuario> {
    const response = await axios.post<AuthResponseUsuario>(
      `${API_BASE_URL}${AUTH_PATH('register')}`,
      data,
    )
    if (response.data.token) {
      tokenService.setToken(response.data.token)
    }
    return response.data
  }

  logout(): void {
    tokenService.clearAll()
  }

  obtenerToken(): string | null {
    return tokenService.getToken()
  }

  obtenerIdUsuarioActual(): number | null {
    return tokenService.getIdUsuario()
  }

  obtenerNombreUsuarioActual(): string | null {
    return tokenService.getNombreUsuario()
  }

  obtenerTipoUsuarioActual() : string | null {
    return tokenService.getTipoUsuario()
  }

  estaAutenticado(): boolean {
    return tokenService.estaAutenticado()
  }

  manejarError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.data?.message ?? "Error en la solicitud"
      }
      if (error.request) {
        return "No se pudo conectar con el servidor. Intentá más tarde."
      }
    }
    return "Ocurrió un error inesperado."
  }
}

export const authService = new AuthService()
