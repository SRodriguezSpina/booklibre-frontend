export type SearchParams = {
    query?: string
        genero?: string
        isbn?: string
        prestadoPor?: string
        paginasMin?: number
        paginasMax?: number
        page?: number
}

export const homeService = {
    search: async (params: SearchParams) => {
        return { content: []}
        // TODO: terminar llamada real
    }
}