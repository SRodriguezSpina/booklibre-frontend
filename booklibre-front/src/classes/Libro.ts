import type {
  LibroDTO,
  TipoLibro,
  EstadoLibro,
  Genero,
  Idioma,
  PrestamoDTO,
} from "../models/libroModel"

export class Libro {
  // ... propiedades anteriores ...
  id: number
  titulo: string
  autor: string
  estado: EstadoLibro
  propietarioId: number
  imagenUrl: string
  alquiladoPorId?: number
  bibliokarma?: number
  rating: number
  fechaDesde?: string
  fechaDevolucion?: string // Mapea a fechaHasta del DTO
  tipo?: TipoLibro
  descripcion?: string
  genero?: Genero
  paginas?: number
  isbn?: number
  idioma?: Idioma
  editorial?: string
  fechaPublicacion?: string

  constructor(data: Partial<Libro>) {
    Object.assign(this, data)
    // Aseguramos valores por defecto para los obligatorios si fuera necesario
    this.id = data.id || 0
    this.titulo = data.titulo || ""
    this.autor = data.autor || ""
    this.estado = data.estado || ("DISPONIBLE" as EstadoLibro)
    this.propietarioId = data.propietarioId || 0
    this.imagenUrl = data.imagenUrl || ""
    this.rating = data.rating || 0
  }

  // Mapeador para el DTO de Libro completo (el que ya tenías)
  static fromJson(json: LibroDTO): Libro {
    return new Libro({
      ...json,
      // Adaptamos nombres si varían
    })
  }

  // NUEVO: Mapeador para el DTO de Préstamo
  static fromPrestamoJson(json: PrestamoDTO): Libro {
    return new Libro({
      id: json.id,
      titulo: json.titulo,
      autor: json.autor,
      estado: json.estado,
      propietarioId: json.propietarioId,
      imagenUrl: json.imagenUrl,
      alquiladoPorId: json.alquiladoPorId ?? undefined,
      fechaDesde: json.fechaDesde ?? undefined,
      fechaDevolucion: json.fechaHasta ?? undefined, // fechaHasta -> fechaDevolucion
      rating: json.rating,
      bibliokarma: json.bibliokarma ?? undefined,
      // Los campos faltantes quedan como undefined
    })
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
