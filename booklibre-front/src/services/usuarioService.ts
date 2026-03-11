import axios from 'axios'
import { API_BASE_URL } from '../env'
import type { Usuario } from '../models/usuarioModel'

class UsuarioService {
  async obtenerUsuario(id: number): Promise<Usuario> {
    const response = await axios.get<Usuario>(`${API_BASE_URL}/usuarios/${id}`)
    return response.data
  }

  async actualizarUsuario(usuario: Usuario): Promise<Usuario> {
    const response = await axios.put<Usuario>(
      `${API_BASE_URL}/usuarios/${usuario.id}`,
      usuario,
    )
    return response.data
  }
}

export const usuarioService = new UsuarioService()
