import type { CantidadColeccionablesResponse, TasaConversionLibroResponse } from "../models/libroModel"
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
    },

    async obtenerLibrosColeccionables(): Promise<CantidadColeccionablesResponse> {
        const res = await apiClient.get(
            `/libros/coleccionables/count`
        )
        return res.data
    },

    async obtenerLibrosMejorCalificados(): Promise<any[]> {
        const res = await apiClient.get(
            `/libros/mejor-calificados`
        )
        return res.data
    },

    async obtenerLibrosConReservasActivas(minReservas: number = 3): Promise<any[]> {
        const res = await apiClient.get(
            `/libros/reservas-activas`, { params: { minReservas } }
        )
        return res.data
    },

    async obtenerTasaConversion(): Promise<TasaConversionLibroResponse[]> {
        const query = `
            query {
                tasaConversion {
                    libroId
                    titulo
                    clicks
                    reservas
                    tasaConversion
                }
            }
        `
        const res = await apiClient.post('/graphql', { query })
        return res.data.data.tasaConversion
    }
}
