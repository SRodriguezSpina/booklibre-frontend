export type PerfilUsuarioTipo = 'Lector' | 'Publicador'

export type Usuario = {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  tipoPerfil: PerfilUsuarioTipo
  rol: string
  fechaUnion: string
  ubicacion: string
  bibliokarma: number
  avatarUrl?: string | null
}

