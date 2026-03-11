import axios from "axios"
import { Libro } from "../classes/Libro"
import type { LibroDTO, TipoPrestamo } from "../models/libroModel"
import { API_BASE_URL } from "../env"

export const libroService = {
  async obtenerPrestamos(usuarioId: number, tipo: TipoPrestamo): Promise<Libro[]> {
    const res = await axios.get<LibroDTO[]>(
      `${API_BASE_URL}/usuarios/${usuarioId}/prestamos`,
      { params: { tipo } },
    )
    return res.data.map(Libro.fromJson)
  },

  async obtenerLibrosDeUsuario(usuarioId: number): Promise<Libro[]> {
    const res = await axios.get<LibroDTO[]>(
      `${API_BASE_URL}/usuarios/${usuarioId}/libros`,
    )
    return res.data.map(Libro.fromJson)
  },
}
