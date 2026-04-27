import type { UsuarioData } from '../classes/usuario'
import type {
  UsuarioResponse,
  UsuarioUpdateRequest,
  UsuarioUpdateResponse,
} from '../models/usuarioModel'
import { apiClient } from './apiClient'
import { tokenService } from './tokenService'
import { mapUsuarioResponse } from '../utils/usuarioMapper'

class UsuarioService {
  
  async obtenerUsuario(id: number): Promise<UsuarioData> {
    const res = await apiClient.get<UsuarioResponse>(`/usuarios/${id}`)
    return mapUsuarioResponse(res.data)
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
    const res = await apiClient.put<UsuarioUpdateResponse>(`/usuarios/${usuario.id}`, payload)
    tokenService.setToken(res.data.token)
    tokenService.setNombreUsuario(res.data.usuario.nombre)
    return mapUsuarioResponse(res.data.usuario)
  }
}

export const usuarioService = new UsuarioService()
