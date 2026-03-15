export type TipoUsuario = 'Lector' | 'Publicador' | 'LectorPublicador'

export type Usuario = {
  id: number
  nombre: string
  desc: string
  email: string
  celular: string
  ciudad: string
  tipoUsuario: TipoUsuario
  bibliokarmas: number
  fechaRegistro?: string
}
export type UsuarioResponse = {
  id: number
  nombre: string
  desc: string
  email: string
  celular: string
  ciudad: string
  tipoUsuario: string
  bibliokarmas: number
}

export type UsuarioUpdateRequest = {
  nombre: string
  desc: string
  email: string
  celular: string
  ciudad: string
  tipoUsuario: string
}