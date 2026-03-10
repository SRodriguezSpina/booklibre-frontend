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
}

export const usuarioService = new UsuarioService()

