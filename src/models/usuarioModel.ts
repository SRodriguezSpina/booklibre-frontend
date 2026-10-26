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
  esAdmin?: boolean
}

export type UsuarioUpdateResponse = {
  usuario: UsuarioResponse
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

export type UsuarioReservasDevueltasResponse = {
  usuarioId: number
  usuarioNombre: string
  cantidadReservasDevueltas: number
}

export type ReservaAnualUsuarioResponse = {
  reservaId: number
  usuarioId: number
  usuarioNombre: string
  libroId: number
  libroTitulo: string
  libroAutor: string
  fechaDesde: string
  fechaHasta: string
  anioReserva: number
}