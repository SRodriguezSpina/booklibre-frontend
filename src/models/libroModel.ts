export type EstadoLibro =
  | "EXCELENTE"
  | "MUY_BUENO"
  | "BUENO"
  | "REGULAR"
  | "MALO"
export type Genero =
  | "DRAMA"
  | "CIENCIA_FICCION"
  | "ROMANCE"
  | "AUTOAYUDA"
  | "DISENO"
  | "LITERATURA_CLASICA"
export type Idioma = "ESPANOL" | "INGLES" | "FRANCES" | "PORTUGUES"
export type TipoLibro = "Comun" | "ConDedicatoria" | "Coleccionable"
export type TipoPrestamo = "prestados-a-mi" | "prestados-por-mi"

export type RangoReservaDTO = {
  fechaDesde: string
  fechaHasta: string
}

export type CalificacionDTO = {
  usuarioId: number
  nombreUsuario: string
  valor: number
  comentario: string
}

export interface LibroDTO {
  id: number
  titulo: string
  tipo: TipoLibro
  descripcion: string
  genero: Genero
  autor: string
  paginas: number
  isbn: string
  idioma: Idioma
  editorial: string
  estado: EstadoLibro
  fechaPublicacion: string
  fechaAgregado: string
  propietarioId: number
  imagenUrl: string
  estoyReservado: boolean
  alquiladoPorId?: number
  bibliokarma?: number
  reservas: RangoReservaDTO[]
  cantidadCalificaciones?: number
  ultimasCalificaciones: CalificacionDTO[]
}

export interface PrestamoDTO {
  id: number
  titulo: string
  autor: string
  estado: EstadoLibro
  propietarioId: number
  imagenUrl: string
  alquiladoPorId: number | null
  fechaDesde: string | null
  fechaHasta: string | null
  rating: number
  bibliokarma: number | null
  disponibilidad: "DISPONIBLE" | "RESERVADO"
}

export interface LibroHome {
  id: number
  imagenUrl: string
  genero: Genero
  titulo: string
  autor: string
  calificacion: number
  isbn: string
  idioma: Idioma
  tipo: TipoLibro
  bibliokarma: number
  estado: EstadoLibro
  duenio: string
}

export type LibroUsuarioItemDTO = {
  id: number
  titulo: string
  autor: string
  genero: string
  disponible: boolean
  fechaAgregado: string | null
  imagenUrl?: string | null
}

export const GENERO_LABEL: Record<string, string> = {
  CIENCIA_FICCION: "Ciencia Ficción",
  DRAMA: "Drama",
  AUTOAYUDA: "Autoayuda",
  ROMANCE: "Romance",
  DISENO: "Diseño",
  LITERATURA_CLASICA: "Literatura Clásica",
}

export const IDIOMA_LABEL: Record<string, string> = {
  ESPANOL: "Español",
  INGLES: "Inglés",
  FRANCES: "Francés",
  PORTUGUES: "Portugués",
}

export const ESTADO_LABEL: Record<string, string> = {
  EXCELENTE: "Excelente",
  MUY_BUENO: "Muy bueno",
  BUENO: "Bueno",
  REGULAR: "Regular",
  MALO: "Malo",
}

export const TIPO_LABEL: Record<string, string> = {
  Comun: "Común",
  ConDedicatoria: "Con dedicatoria",
  Coleccionable: "Coleccionable",
}
