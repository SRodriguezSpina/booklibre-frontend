export type TipoLibro = "Común" | "Con dedicatoria" | "Coleccionable"
export type EstadoLibro =
  | "Excelente"
  | "Muy bueno"
  | "Bueno"
  | "Regular"
  | "Malo"
export type TipoPrestamo = "prestados-a-mi" | "prestados-por-mi"
export type Genero =
  | "Drama"
  | "Ciencia ficcion"
  | "Romance"
  | "Autoayuda"
  | "Diseño"
  | "Literatura Clasica"
export type Idioma = "Español" | "Ingles" | "Frances" | "Portugues"

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
  propietarioId: number
  imagenUrl: string
  alquiladoPorId?: number
  fechaDevolucion?: string // ISO string
  bibliokarma?: number
}

export interface PrestamoDTO {
  id: number
  titulo: string
  autor: string
  estado: EstadoLibro // Usamos tu enum/tipo existente
  propietarioId: number
  imagenUrl: string
  alquiladoPorId: number | null
  fechaDesde: string | null
  fechaHasta: string | null
  rating: number
  bibliokarma: number | null
}

export interface LibroHome {
  id: number
  img: string
  genero: Genero
  titulo: string
  autor: string
  calificacion: number  /*o float?*/ 
  isbn: string
  idioma: Idioma
  tipo: TipoLibro
  biblokarma: number
  estado: EstadoLibro
  duenio: string
}