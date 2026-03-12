import type { LibroDTO, TipoLibro, EstadoLibro, Genero, Idioma } from "../models/libroModel"

export class Libro {
  // Declaración explícita de propiedades
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
  imagenUrl: string
  alquiladoPorId?: number
  fechaDevolucion?: string

  constructor(
    id: number,
    titulo: string,
    tipo: TipoLibro,
    descripcion: string,
    genero: Genero,
    autor: string,
    paginas: number,
    isbn: number,
    idioma: Idioma,
    estado: EstadoLibro,
    fechaPublicacion: string,
    propietarioId: number,
    imagenUrl: string,
    alquiladoPorId?: number,
    fechaDevolucion?: string,
  ) {
    // Asignación manual
    this.id = id
    this.titulo = titulo
    this.tipo = tipo
    this.descripcion = descripcion
    this.genero = genero
    this.autor = autor
    this.paginas = paginas
    this.isbn = isbn
    this.idioma = idioma
    this.estado = estado
    this.fechaPublicacion = fechaPublicacion
    this.propietarioId = propietarioId
    this.imagenUrl = imagenUrl
    this.alquiladoPorId = alquiladoPorId
    this.fechaDevolucion = fechaDevolucion
  }

  static fromJson(json: LibroDTO): Libro {
    return new Libro(
      json.id,
      json.titulo,
      json.tipo,
      json.descripcion,
      json.genero,
      json.autor,
      json.paginas,
      json.isbn,
      json.idioma,
      json.estado,
      json.fechaPublicacion,
      json.propietarioId,
      json.imagenUrl,
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
