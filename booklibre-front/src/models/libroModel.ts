export type TipoLibro = "Común" | "Con dedicatoria" | "Coleccionable"
export type EstadoLibro =
  | "Excelente"
  | "Muy bueno"
  | "Bueno"
  | "Regular"
  | "Malo"
export type TipoPrestamo = "prestados-a-mi" | "prestados-por-mi"

export interface LibroDTO {
  id: number
  titulo: string
  autor: string
  tipo: TipoLibro
  paginas: number
  estado: EstadoLibro
  imagenUrl?: string
  propietarioId: number
  alquiladoPorId?: number
  fechaDevolucion?: string // ISO string
}
