import type { ReservaAnualUsuarioResponse, UsuarioReservasDevueltasResponse } from "../models/usuarioModel"
import { apiClient } from "./apiClient"

export const adminService = {
    async obtenerUsuariosConMasDe2Devoluciones(): Promise<UsuarioReservasDevueltasResponse[]> {
        const res = await apiClient.get(
            `/reservas/usuarios-con-devoluciones`
        )
        return res.data
    },

    async obtenerUsuariosConMasDeNReservas(minReservas: number): Promise<UsuarioReservasDevueltasResponse[]> {
        const res = await apiClient.get(
            `/reservas/usuarios-con-mas-de-n-reservas`, { params: { minReservas }, }
        )
        return res.data
    },

    async obtenerReservasAnualesUsuario(id: number): Promise<ReservaAnualUsuarioResponse[]> {
        const res = await apiClient.get<ReservaAnualUsuarioResponse[]>(
            `/usuarios/${id}/reservas/anuales`
        )

        return res.data
    },

    async obtenerLibrosConReservasCumplidas(): Promise<any[]> {
        const res = await apiClient.get(
            `/libros/reservas-cumplidas`
        )
        return res.data
    }
}
