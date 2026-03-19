import axios from "axios"
import { API_BASE_URL } from "../env"

export interface CrearReservaDTO {
  libroId: number
  usuarioId: number
  fechaDesde: string
  fechaHasta: string
}

export const reservaService = {
  async crearReserva(dto: CrearReservaDTO) {
    const res = await axios.post(`${API_BASE_URL}/reservas`, dto)
    return res.data
  }
}