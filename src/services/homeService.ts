import type { LibroHome } from '../models/libroModel'
import { API_BASE_URL } from "../env";
import axios from 'axios'
import type { FiltersState } from '../components/home/Filters'
import { INITIAL_FILTERS } from '../components/home/Filters';

interface SearchResponse {
    content: LibroHome[]
    page: number
    totalPages: number
}

const GENERO_MAP: Record<string, string> = {
    cienciaFiccion: 'CIENCIA_FICCION',
    drama: 'DRAMA',
    autoayuda: 'AUTOAYUDA',
    romance: 'ROMANCE',
    disenio: 'DISENO',
    literaturaClasica: 'LITERATURA_CLASICA',
}

class HomeService {
    async search(
        query: string = '',
        filters: FiltersState = INITIAL_FILTERS,
        page: number = 0,
        size: number = 6,
        usuarioId: number
    ): Promise<SearchResponse> {
        const generos = Object.entries(filters)
            .filter(([key, value]) => value === true && Object.keys(GENERO_MAP).includes(key))
            .map(([key]) => GENERO_MAP[key])
            .join(',')

        const response = await axios.get<SearchResponse>(`${API_BASE_URL}/libros/home`, {
            params: {
                query, generos, page, size, usuarioId,
                paginasMin: filters.paginasMin || undefined,
                paginasMax: filters.paginasMax || undefined,
                fechaDesde: filters.fechaDesde || undefined,
                fechaHasta: filters.fechaHasta || undefined,
                isbn: filters.isbn || undefined,
                prestadoPor: filters.prestadoPor || undefined
            }
        })
        return response.data
    }
}

export const homeService = new HomeService()