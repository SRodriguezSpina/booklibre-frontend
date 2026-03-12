import axios from "axios"
import type { RegisterData, LoginData, AuthResponseUsuario } from "../types/UsuarioTypes"
import { API_BASE_URL, AUTH_PATH } from "../env"

class AuthService {
  // ── Auth ──────────────────────────────────────────────────────────────────

  async login(data: LoginData): Promise<AuthResponseUsuario> {
    const response = await axios.post<AuthResponseUsuario>(
      `${API_BASE_URL}${AUTH_PATH('login')}`,
      data,
    )
    if (response.data.success && response.data.usuario) {
      localStorage.setItem("idUsuario", response.data.usuario.id.toString())
      localStorage.setItem("nombreUsuario", response.data.usuario.nombre)
    }
    return response.data
  }

  async registro(data: RegisterData): Promise<AuthResponseUsuario> {
    const response = await axios.post<AuthResponseUsuario>(
      `${API_BASE_URL}${AUTH_PATH('registro')}`,
      data,
    )
    return response.data
  }

  logout(): void {
    localStorage.removeItem("idUsuario")
    localStorage.removeItem("nombreUsuario")
  }

  // ── Session helpers ───────────────────────────────────────────────────────

  obtenerIdUsuarioActual(): number | null {
    const id = localStorage.getItem("idUsuario")
    return id ? Number(id) : null
  }

  obtenerNombreUsuarioActual(): string | null {
    return localStorage.getItem("nombreUsuario")
  }

  estaAutenticado(): boolean {
    return this.obtenerIdUsuarioActual() !== null
  }

  // ── Error handling ────────────────────────────────────────────────────────

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