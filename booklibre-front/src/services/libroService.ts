import axios from 'axios'
import { API_URL } from '../env'
import type { Libro } from '../models/libroModel'
import { librosMock } from '../mocks/librosMock'

class LibroService {
  async obtenerLibrosDeUsuario(_idUsuario: number): Promise<Libro[]> {
    if (!API_URL) return librosMock
    try {
      const response = await axios.get<Libro[]>(`${API_URL}/usuario/${_idUsuario}/libros`)
      return response.data
    } catch {
      return librosMock
    }
  }
}

export const libroService = new LibroService()

