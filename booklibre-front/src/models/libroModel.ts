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
export type Idioma =
  | "Español"
  | "Ingles"
  | "Frances"
  | "Portugues"

export interface LibroDTO {
  id: number
  titulo: string
  tipo: TipoLibro
  descripcion: string
  genero: Genero
  autor: string
  paginas: number
  isbn: number
  idioma: Idioma
  estado: EstadoLibro
  fechaPublicacion: string
  propietarioId: number
  alquiladoPorId?: number
  fechaDevolucion?: string // ISO string
}
