import axios from 'axios'
import { API_BASE_URL } from '../env'
import type { Usuario, UsuarioUpdateRequest } from '../models/usuarioModel'

class UsuarioService {
  // ── Obtener usuario ────────────────────────────────────────────────────────
  async obtenerUsuario(id: number): Promise<Usuario> {
    const res = await axios.get<Usuario>(`${API_BASE_URL}/usuarios/${id}`)
    return res.data
  }

  // ── Actualizar usuario ─────────────────────────────────────────────────────
  async actualizarUsuario(usuario: Usuario): Promise<Usuario> {
    const payload: UsuarioUpdateRequest = {
      nombre: usuario.nombre,
      desc: usuario.desc,
      email: usuario.email,
      celular: usuario.celular,
      ciudad: usuario.ciudad,
      tipoUsuario: usuario.tipoUsuario,
    }

    const res = await axios.put<Usuario>(
      `${API_BASE_URL}/usuarios/${usuario.id}`,
      payload,
    )
    return res.data
  }
}

export const usuarioService = new UsuarioService()
