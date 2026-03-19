import type {
  LibroDTO,
  TipoLibro,
  EstadoLibro,
  Genero,
  Idioma,
  PrestamoDTO,
} from "../models/libroModel"

export class Libro {
  id: number
  prestamoId?: number // Para el caso de PrestamoDTO, donde el ID del libro viene como "id" pero queremos mapearlo a "libroId"
  titulo: string
  autor: string
  autorImg?: string
  estado: EstadoLibro
  propietarioId: number
  imagenUrl: string
  alquiladoPorId?: number
  bibliokarma?: number
  rating: number
  estoyReservado: boolean 
  fechaDesde?: string
  fechaDevolucion?: string // Mapea a fechaHasta del DTO
  tipo?: TipoLibro
  descripcion?: string
  genero?: Genero
  paginas?: number
  isbn?: string
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
    this.estoyReservado = data.estoyReservado ?? false
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

  estaDevuelto(): boolean {
    if (!this.fechaDevolucion) return false
    const hoy = new Date()
    const fechaFin = new Date(this.fechaDevolucion)
    // Seteamos ambos a medianoche para comparar solo el día
    hoy.setHours(0, 0, 0, 0)
    fechaFin.setHours(0, 0, 0, 0)
    return fechaFin < hoy
  }

  estoyDisponible(): boolean {
    // Está disponible si no tiene fecha de devolución o si ya se devolvió
    return !this.fechaDevolucion || this.estaDevuelto()
  }

  estaProximoAVencer(): boolean {
    if (!this.fechaDevolucion || this.estaDevuelto()) return false
    const hoy = new Date()
    const fechaFin = new Date(this.fechaDevolucion)
    // Calculamos la diferencia en días
    const diffTiempo = fechaFin.getTime() - hoy.getTime()
    const diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24))
    // Por ejemplo, avisar si faltan 3 días o menos
    return diffDias >= 0 && diffDias <= 3
  }

  estaCalificado(): boolean {
    return this.rating > 0
  }
}
