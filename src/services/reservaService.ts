import { apiClient } from "./apiClient"

export interface CrearReservaDTO {
  libroId: number
  usuarioId: number
  fechaDesde: string
  fechaHasta: string
}

export const reservaService = {
  async crearReserva(dto: CrearReservaDTO) {
    const res = await apiClient.post(`/reservas/crear`, dto)
    return res.data
  },
}
