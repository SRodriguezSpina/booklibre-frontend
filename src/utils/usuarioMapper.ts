import type { UsuarioData } from "../classes/usuario"
import type { TipoUsuario, UsuarioResponse } from "../models/usuarioModel"

export function mapTipoUsuario(tipoUsuario: string): TipoUsuario {
  switch (tipoUsuario) {
    case "Lector":
    case "Publicador":
    case "LectorPublicador":
      return tipoUsuario
    default:
      return "Lector"
  }
}

export function mapUsuarioResponse(usuario: UsuarioResponse): UsuarioData {
  return {
    ...usuario,
    tipoUsuario: mapTipoUsuario(usuario.tipoUsuario),
  }
}
