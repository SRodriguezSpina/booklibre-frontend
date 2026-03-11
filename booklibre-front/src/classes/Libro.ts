import type { LibroDTO, TipoLibro, EstadoLibro } from "../models/libroModel"

export class Libro {
  // Declaración explícita de propiedades
  id: number
  titulo: string
  autor: string
  tipo: TipoLibro
  paginas: number
  estado: EstadoLibro
  propietarioId: number
  alquiladoPorId?: number
  fechaDevolucion?: string

  constructor(
    id: number,
    titulo: string,
    autor: string,
    tipo: TipoLibro,
    paginas: number,
    estado: EstadoLibro,
    propietarioId: number,
    alquiladoPorId?: number,
    fechaDevolucion?: string,
  ) {
    // Asignación manual
    this.id = id
    this.titulo = titulo
    this.autor = autor
    this.tipo = tipo
    this.paginas = paginas
    this.estado = estado
    this.propietarioId = propietarioId
    this.alquiladoPorId = alquiladoPorId
    this.fechaDevolucion = fechaDevolucion
  }

  static fromJson(json: LibroDTO): Libro {
    return new Libro(
      json.id,
      json.titulo,
      json.autor,
      json.tipo,
      json.paginas,
      json.estado,
      json.propietarioId,
      json.alquiladoPorId,
      json.fechaDevolucion,
    )
  }

  estoyDisponible(): boolean {
    return !this.alquiladoPorId
  }

  estaProximoAVencer(): boolean {
    if (!this.fechaDevolucion) return false
    const hoy = new Date()
    const fechaFin = new Date(this.fechaDevolucion)
    const diffTiempo = fechaFin.getTime() - hoy.getTime()
    const diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24))

    return diffDias >= 0 && diffDias <= 2
  }
}
