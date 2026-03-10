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
}
