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
import { BookOpen, SlidersHorizontal, X } from "lucide-react"

const ITEMS_POR_PAGINA = 10

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
      const hasFilters = Object.values(f).some(
        (v) => v !== false && v !== undefined && v !== "" && v !== 0
      )
      const isInitialLoad = q === "" && !hasFilters && page === 0 && sort === "titulo"

      if (isInitialLoad) {
        const data = await homeService.getPopulares(userId)
        setBooks(data.content)
        setTotalPaginas(data.totalPages)
      } else {
        const data = await homeService.search(q, f, page, ITEMS_POR_PAGINA, userId, sort)
        setBooks(data.content)
        setTotalPaginas(data.totalPages)
      }
    } catch (e: unknown) {
      setError(obtenerMensajeError(e))
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
    setIsFiltersOpen(false)
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

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== false && v !== undefined && v !== "" && v !== 0
  )

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setCurrentPage(1)
    setFilterKey((k) => k + 1)
    search(query, INITIAL_FILTERS, 0, sortBy)
  }

  if (error) {
    return (
      <div className="px-6 md:px-10 pt-24 pb-16">
        <ErrorCard
          error={error}
          alReintentar={() => search(query, filters, currentPage - 1, sortBy)}
        />
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {/* ── Hero header ─────────────────────────────────────── */}
      <div className="px-6 md:px-10 pt-24 pb-6 border-b border-accent/10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                Catálogo
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-on-surface leading-tight">
              Encuentra tu próxima<br className="hidden md:block" /> lectura
            </h1>
            <p className="text-sm text-on-surface-variant/70 mt-2">
              Explorá libros disponibles para préstamo en nuestra comunidad.
            </p>
          </div>

          {/* Buscador en header (desktop) */}
          <div className="w-full md:w-96">
            <SearchBar onSearch={handleSearch} placeholder="Buscar por título..." />
          </div>
        </div>
      </div>

      {/* ── Cuerpo principal ────────────────────────────────── */}
      <div className="flex px-6 md:px-10 py-6 gap-6">

        {/* ── Sidebar filtros ─── */}
        <aside className="hidden lg:flex flex-col gap-0 w-64 shrink-0">
          <Filters
            key={filterKey}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </aside>

        {/* ── Contenido principal ─── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Toolbar: filtros móvil + sort */}
          <div className="flex items-center justify-between gap-3">
            {/* Botón filtros (móvil) */}
            <button
              type="button"
              onClick={() => setIsFiltersOpen(true)}
              className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                hasActiveFilters
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-accent/30 bg-surface text-on-surface-variant hover:text-on-surface hover:border-accent/50"
              }`}
            >
              <SlidersHorizontal size={14} />
              Filtros
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>

            {/* Resultados count */}
            <span className="hidden md:block text-xs text-on-surface-variant/50">
              {loading ? "Buscando..." : `${books.length} resultado${books.length !== 1 ? "s" : ""} · Pág. ${currentPage}/${totalPaginas}`}
            </span>

            <SortBy value={sortBy} onChange={handleSortChange} />
          </div>

          {/* Grid de libros */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-32">
              <Spinner />
            </div>
          ) : books.length === 0 ? (
            <div
              data-testid="empty-state"
              className="flex flex-col items-center justify-center py-32 rounded-xl border border-accent/20 bg-surface/50"
            >
              <BookOpen size={40} className="text-on-surface-variant/20 mb-3" />
              <p className="text-on-surface-variant/50 text-sm font-medium">
                No se encontraron libros.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                data-testid="libros-grid"
                className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 transition-all duration-200 ${
                  animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                }`}
              >
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

      {/* ── Drawer de filtros en móvil ─────────────────────── */}
      {isFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFiltersOpen(false)}
          />
          {/* panel */}
          <div className="relative ml-auto h-full w-80 bg-surface shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-accent/15">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-primary" />
                <span className="font-bold text-sm text-on-surface">Filtros</span>
              </div>
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-high text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <Filters
                key={filterKey}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
