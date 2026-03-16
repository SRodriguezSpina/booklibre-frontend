import type { LibroHome } from '../models/libroModel'
import { API_BASE_URL } from "../env";
import axios from 'axios'
import type { FiltersState } from '../components/home/Filters'

export type SearchParams = FiltersState & {
    query?: string
    page?: number
}

interface SearchResponse {
    content: LibroHome[]
    page: number
    totalPages: number
}

class HomeService {
    async getAll(): Promise<SearchResponse> {
        const response = await axios.get<SearchResponse>(`${API_BASE_URL}/libros`)
        return response.data
    }

    async search(params: SearchParams): Promise<SearchResponse> {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== false && v !== undefined && v !== '')
        )
        const response = await axios.get<SearchResponse>(`${API_BASE_URL}/libros/search`, {
            params: cleanParams
        })
        return response.data
    }
}

export const homeService = new HomeService()