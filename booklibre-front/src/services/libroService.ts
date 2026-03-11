import axios from "axios"
import { Libro } from "../classes/Libro"
import type { LibroDTO, TipoPrestamo } from "../models/libroModel"

const REST_SERVER_URL = "http://localhost:8080"

export const libroService = {
  async obtenerPrestamos(
    usuarioId: number,
    tipo: TipoPrestamo,
  ): Promise<Libro[]> {
    const res = await axios.get<LibroDTO[]>(
      `${REST_SERVER_URL}/usuarios/${usuarioId}/prestamos`,
      {
        params: { tipo },
      },
    )
    return res.data.map(Libro.fromJson)
  },

  async getLibroById(id: number): Promise<Libro> {
    const res = await axios.get<LibroDTO>(`${REST_SERVER_URL}/libros/${id}`)
    return Libro.fromJson(res.data)
  },

  async crearLibro(dto: LibroDTO): Promise<Libro> {
    const res = await axios.post<LibroDTO>(`${REST_SERVER_URL}/libros`, dto)
    return Libro.fromJson(res.data)
  },

  async actualizarLibro(dto: LibroDTO): Promise<Libro> {
    const res = await axios.put<LibroDTO>(`${REST_SERVER_URL}/libros/${dto.id}`, dto)
    return Libro.fromJson(res.data)
  },
}
