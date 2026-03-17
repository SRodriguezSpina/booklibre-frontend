import { useState } from 'react';
import { homeService } from '../services/homeService'
import { SearchBar } from '../components/ui/SearchBar';
import { Filters, INITIAL_FILTERS } from '../components/home/Filters';
import type { FiltersState } from '../components/home/Filters';
import type { LibroHome } from '../models/libroModel'
import { LibroCardHome } from '../components/home/LibroCardHome'
import { Paginacion } from '../components/ui/Paginacion'
import { useOnInit } from '../utils/hooks.ts'

const ITEMS_POR_PAGINA = 6

export const Home = () => {
    const [query, setQuery] = useState('')
    const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS)
    const [books, setBooks] = useState<LibroHome[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPaginas, setTotalPaginas] = useState(1)

    const search = async (q: string, f: FiltersState, page: number = 0) => {
        try {
            const data = await homeService.search(q, f, page, ITEMS_POR_PAGINA)
            setBooks(data.content)
            setTotalPaginas(data.totalPages)
        } catch (error: unknown) {
            console.error(error)
        }
    }

    useOnInit(() => search('', INITIAL_FILTERS, 0))

    const handleSearch = (q: string) => {
        setQuery(q)
        setCurrentPage(1)
        search(q, filters, 0)
    }

    const handleApplyFilters = (f: FiltersState) => {
        setFilters(f)
        setCurrentPage(1)
        search(query, f, 0)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        search(query, filters, page - 1)
    }

    return (
        <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
            <section>
                <SearchBar
                    onSearch={(query) => handleSearch(query)}
                    placeholder='Buscar por título...'
                />
            </section>
            <section>
                <Filters
                    onApplyFilters={(filters: FiltersState) => handleApplyFilters(filters)}
                />
            </section>
            <section>
                {/* resultados y el paginador abajo */}
                {books.map((book) => (
                    <LibroCardHome key={book.id} {...book} />
                ))}
                <Paginacion
                    pagina={currentPage}
                    totalPaginas={totalPaginas}
                    alCambiar={handlePageChange}
                />
            </section>
        </main>
    )
}
