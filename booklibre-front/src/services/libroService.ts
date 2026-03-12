import axios from "axios"
import { Libro } from "../classes/Libro"
import type { LibroDTO, PrestamoDTO, TipoPrestamo } from "../models/libroModel"
import { API_BASE_URL } from "../env"

export const libroService = {
  async obtenerPrestamos(
    usuarioId: number,
    tipo: TipoPrestamo,
    searchQuery: string = "",
  ): Promise<Libro[]> {
    const res = await axios.get<PrestamoDTO[]>(
      `${API_BASE_URL}/usuarios/${usuarioId}/prestamos`,
      {
        params: {
          tipo,
        },
      },
    )
    const libros = res.data.map(Libro.fromPrestamoJson)
    if (!searchQuery.trim()) {
      return libros
    }
    const query = searchQuery.toLowerCase()
    return libros.filter(
      (libro) =>
        libro.titulo.toLowerCase().includes(query) ||
        libro.autor.toLowerCase().includes(query),
    )
  },

  async obtenerLibrosDeUsuario(usuarioId: number): Promise<Libro[]> {
    const res = await axios.get<LibroDTO[]>(
      `${API_BASE_URL}/usuarios/${usuarioId}/libros`,
    )
    return res.data.map(Libro.fromJson)
  },

  async getLibroById(id: number): Promise<Libro> {
    const res = await axios.get<LibroDTO>(`${API_BASE_URL}/libros/${id}`)
    return Libro.fromJson(res.data)
  },

  async crearLibro(dto: LibroDTO): Promise<Libro> {
    const res = await axios.post<LibroDTO>(`${API_BASE_URL}/libros`, dto)
    return Libro.fromJson(res.data)
  },

  async actualizarLibro(dto: LibroDTO): Promise<Libro> {
    const res = await axios.put<LibroDTO>(
      `${API_BASE_URL}/libros/${dto.id}`,
      dto,
    )
    return Libro.fromJson(res.data)
  },

  async obtenerPrestamosFiltrados(
    usuarioId: number,
    tipo: TipoPrestamo,
    query: string = "",
  ): Promise<Libro[]> {
    const todosLosLibros = await this.obtenerPrestamos(usuarioId, tipo)

    if (!query) return todosLosLibros

    const q = query.toLowerCase()
    return todosLosLibros.filter(
      (libro) =>
        libro.titulo.toLowerCase().includes(q) ||
        libro.autor.toLowerCase().includes(q),
    )
  },
}
