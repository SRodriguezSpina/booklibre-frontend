import type { UsuarioData } from '../classes/usuario'
import type { UsuarioUpdateRequest } from '../models/usuarioModel'
import { apiClient } from './apiClient'

class UsuarioService {
  async obtenerUsuario(id: number): Promise<UsuarioData> {
    const res = await apiClient.get<UsuarioData>(`/usuarios/${id}`)
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
    const res = await apiClient.put<UsuarioData>(`/usuarios/${usuario.id}`, payload)
    return res.data
  }
}

export const usuarioService = new UsuarioService()
