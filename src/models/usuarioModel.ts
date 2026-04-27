export type TipoUsuario = "Lector" | "Publicador" | "LectorPublicador"

export type UsuarioResponse = {
  id: number
  nombre: string
  desc: string
  email: string
  celular: string
  ciudad: string
  tipoUsuario: string
  bibliokarmas: number
  imagenUrl?: string | null
  reservados: number
  leidos: number
}

export type UsuarioUpdateResponse = {
  usuario: UsuarioResponse
  token: string
}

export type UsuarioUpdateRequest = {
  nombre: string
  desc: string
  email: string
  celular: string
  ciudad: string
  tipoUsuario: string
  imagenUrl?: string | null
}
