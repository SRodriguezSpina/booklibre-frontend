import axios from 'axios'
import { API_BASE_URL } from '../env'
import type { UsuarioData } from '../classes/usuario'
import type { UsuarioUpdateRequest } from '../models/usuarioModel'

class UsuarioService {
  async obtenerUsuario(id: number): Promise<UsuarioData> {
    const res = await axios.get<UsuarioData>(`${API_BASE_URL}/usuarios/${id}`)
    return res.data
  }

  async actualizarUsuario(usuario: UsuarioData): Promise<UsuarioData> {
    const payload: UsuarioUpdateRequest = {
      nombre: usuario.nombre,
      desc: usuario.desc,
      email: usuario.email,
      celular: usuario.celular,
      ciudad: usuario.ciudad,
      tipoUsuario: usuario.tipoUsuario,
      imagenUrl: usuario.imagenUrl ?? null,
    }
    const res = await axios.put<UsuarioData>(
      `${API_BASE_URL}/usuarios/${usuario.id}`,
      payload,
    )
    return res.data
  }
}

export const usuarioService = new UsuarioService()
