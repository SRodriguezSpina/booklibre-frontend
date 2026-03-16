import { useState } from 'react';
import { homeService } from '../services/homeService'
import { SearchBar } from '../components/SearchBar';
import { Filters, INITIAL_FILTERS } from '../components/home/Filters';
import type { FiltersState } from '../components/home/Filters';
import type { LibroHome } from '../models/libroModel'
import { LibroCardHome } from '../components/home/LibroCardHome'
// import { Pager } from '../components/Pager';
import { useOnInit } from '../utils/hooks.ts'

export const Home = () => {
    const [query, setQuery] = useState('')
    const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS)
    const [books, setBooks] = useState<LibroHome[]>([])

    const getBooks = async () => {
        try {
            const data = await homeService.getAll()
            setBooks(data.content)
        } catch (error: unknown) {
            // terminar de pulir manejo de errores
            console.error(error)
        }
    }

    useOnInit(getBooks)
    const search = async (q: string, f: FiltersState) => {
        const data = await homeService.search({ query: q, ...f })
        setBooks(data.content)
    }

    const handleSearch = (q: string) => {
        setQuery(q)
        search(q, filters)
    }

    const handleApplyFilters = (f: FiltersState) => {
        setFilters(f)
        search(query, f)
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
                {/* <Pager /> */}
            </section>
        </main>
    )
}
