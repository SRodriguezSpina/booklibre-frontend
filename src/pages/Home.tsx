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
import { SortBy } from "../components/home/SortBy.tsx"
import { obtenerMensajeError, type ErrorPersonalizado } from "../utils/errorHandler.ts"
import { ErrorCard } from "../components/ui/ErrorCard"

const ITEMS_POR_PAGINA = 6

export const Home = () => {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS)
  const [books, setBooks] = useState<LibroHome[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [sortBy, setSortBy] = useState("titulo")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorPersonalizado | null>(null)
  const [animating, setAnimating] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [filterKey, setFilterKey] = useState(0)

  const userId = authService.obtenerIdUsuarioActual()

  const search = async (q: string, f: FiltersState, page: number = 0, sort: string = sortBy) => {
    setAnimating(true)
    setLoading(true)
    setError(null)
    try {
      const data = await homeService.search(
        q,
        f,
        page,
        ITEMS_POR_PAGINA,
        userId,
        sort
      )
      setBooks(data.content)
      setTotalPaginas(data.totalPages)
    } catch (e: unknown) {
      const err = obtenerMensajeError(e)
      setError(err)
    } finally {
      setLoading(false)
      setTimeout(() => setAnimating(false), 150)
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

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setCurrentPage(1)
    search(query, filters, 0, sort)
  }

  const hasActiveFilters =
    Object.values(filters).some((v) => v !== false && v !== undefined && v !== "" && v !== 0)

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setCurrentPage(1)
    setFilterKey((k) => k + 1)
    search(query, INITIAL_FILTERS, 0, sortBy)
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen max-w-6xl mx-auto px-4 pt-22 pb-16">
        <ErrorCard
          error={error}
          alReintentar={() => search(query, filters, currentPage - 1, sortBy)}
        />
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 pt-22">
      <h1 className="text-2xl font-bold text-secondary-dark mb-1">
        Encuentra tu próxima lectura
      </h1>
      <p className="text-sm text-secondary-light mb-6">
        Explorá miles de libros disponibles para préstamo en nuestra
        comunidad.
      </p>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <aside className="w-full md:w-56 shrink-0">
          <button 
            type="button"
            className="md:hidden w-full flex items-center justify-between bg-surface border border-accent/20 rounded px-5 py-3.5 mb-2 text-secondary-dark font-semibold shadow-sm active:scale-[0.98] transition-all"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <span className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              {isFiltersOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </span>
            <svg className={`w-4 h-4 text-secondary-light transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>

          <div className={`transition-all duration-300 md:block ${isFiltersOpen ? 'block' : 'hidden'}`}>
            <Filters
              key={filterKey}
              onApplyFilters={(f: FiltersState) => handleApplyFilters(f)}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </aside>

        <div className="flex-1 flex flex-col gap-3">
          <SearchBar
            onSearch={(q) => handleSearch(q)}
            placeholder="Buscar por título..."
          />

          <div className="flex justify-end">
            <SortBy value={sortBy} onChange={handleSortChange} />
          </div>

          {loading ? (
            <Spinner />
          ) : books.length === 0 ? (
            <div data-testid="empty-state" className="text-center py-20 bg-surface rounded border border-accent/20">
              <p className="text-on-surface-variant opacity-60">
                No se encontraron libros.
              </p>
            </div>
          ) : (
            <>
              <div data-testid="libros-grid"
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-150 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
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
        </div>
      </div>
    </main>
  )
}
