export type EstadoLibro = 'Disponible' | 'Prestado'

export type Libro = {
  id: string
  titulo: string
  autor: string
  genero?: string
  portadaUrl?: string | null
  estado: EstadoLibro
  fechaAgregado: string
}

