import axios from 'axios'
import { API_URL } from '../env'
import type { Libro } from '../models/libroModel'
import { librosMock } from '../mocks/librosMock'

class LibroService {
  async obtenerLibrosDeUsuario(idUsuario: number): Promise<Libro[]> {
    if (!API_URL) return librosMock
    try {
      const response = await axios.get<Libro[]>(`${API_URL}/usuario/${idUsuario}/libros`)
      return response.data
    } catch {
      return librosMock
    }
  }

  async agregarLibro(idUsuario: number, libro: Partial<Libro>): Promise<Libro> {
    if (!API_URL) {
      const nuevoLibro = {
        ...libro,
        id: (Math.max(...librosMock.map(l => parseInt(l.id))) + 1).toString(),
        estado: 'Disponible',
        fechaAgregado: new Date().toISOString().split('T')[0]
      } as Libro
      return nuevoLibro
    }
    const response = await axios.post<Libro>(`${API_URL}/usuario/${idUsuario}/libros`, libro)
    return response.data
  }
}

export const libroService = new LibroService()

