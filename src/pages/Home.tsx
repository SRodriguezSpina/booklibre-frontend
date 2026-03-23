import { useState } from "react"
import { homeService } from "../services/homeService"
import { authService } from "../services/AuthService.ts"
import { SearchBar } from "../components/ui/SearchBar"
import { Paginacion } from "../components/ui/Paginacion"
import { Spinner } from "../components/ui/Spinner.tsx"
import { Filters, INITIAL_FILTERS } from "../components/home/Filters"
import type { FiltersState } from "../components/home/Filters"
import type { LibroHome } from "../models/libroModel"
import { LibroCardHome } from "../components/home/LibroCardHome"

import { useOnInit } from "../utils/hooks.ts"

const ITEMS_POR_PAGINA = 6

export const Home = () => {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS)
  const [books, setBooks] = useState<LibroHome[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [loading, setLoading] = useState(false)

  const userId = authService.obtenerIdUsuarioActual() ?? 1

  const search = async (q: string, f: FiltersState, page: number = 0) => {
    setLoading(true)
    try {
      const data = await homeService.search(
        q,
        f,
        page,
        ITEMS_POR_PAGINA,
        userId,
      )
      setBooks(data.content)
      setTotalPaginas(data.totalPages)
    } catch (error: unknown) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useOnInit(() => search("", INITIAL_FILTERS, 0))

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
    <main className="max-w-6xl mx-auto px-4 py-6 pt-22">
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-dark mb-1">
          Encuentra tu próxima lectura
        </h1>
        <p className="text-sm text-secondary-light mb-4">
          {" "}
          Explorá miles de libros disponibles para préstamo en nuestra
          comunidad.
        </p>
        <SearchBar
          onSearch={(query) => handleSearch(query)}
          placeholder="Buscar por título..."
        />
      </section>

      <div className="flex gap-6">
        <aside className="w-56 shrink-0">
          <Filters
            onApplyFilters={(filters: FiltersState) =>
              handleApplyFilters(filters)
            }
          />
        </aside>

        <section className="flex-1 flex flex-col gap-6">
          {loading ? (
            <Spinner />
          ) : books.length === 0 ? (
            <>
              <div className="text-center py-20 bg-surface rounded border border-accent/20">
                <p className="text-on-surface-variant opacity-60">
                  No se encontraron libros en esta categoría.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book) => (
                  <LibroCardHome key={book.id} {...book} />
                ))}
              </div>
              <Paginacion
                pagina={currentPage}
                totalPaginas={totalPaginas}
                alCambiar={handlePageChange}
              />
            </>
          )}
        </section>
      </div>
    </main>
  )
}
