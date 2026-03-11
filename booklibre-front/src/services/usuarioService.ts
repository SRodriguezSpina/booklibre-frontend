import axios from 'axios'
import { API_URL } from '../env'
import type { Usuario } from '../models/usuarioModel'
import { usuarioMock } from '../mocks/usuarioMock'

class UsuarioService {
  async obtenerUsuario(idUsuario: number): Promise<Usuario> {
    if (!API_URL) return usuarioMock
    try {
      const response = await axios.get<Usuario>(`${API_URL}/usuario/${idUsuario}`)
      return response.data
    } catch {
      return usuarioMock
    }
  }

  async actualizarUsuario(usuario: Usuario): Promise<Usuario> {
    if (!API_URL) return usuario
    try {
      const response = await axios.put<Usuario>(`${API_URL}/usuario/${usuario.id}`, usuario)
      return response.data
    } catch {
      // Si falla la API en desarrollo, devolvemos el usuario para que la UI no se rompa
      return usuario
    }
  }
}

export const usuarioService = new UsuarioService()

