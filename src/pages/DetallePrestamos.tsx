import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { LibroCard } from "../components/libros/LibroCard"
import { Paginacion } from "../components/ui/Paginacion"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService"
import { useAuthContext, useOnInit } from "../utils/hooks"
import { Libro } from "../classes/Libro"
import type { TipoPrestamo } from "../models/libroModel"
import { SearchBar } from "../components/ui/SearchBar"
import { Tabs } from "../components/ui/Tabs"
import { ErrorCard } from "../components/ui/ErrorCard"
import {
  obtenerMensajeError,
  type ErrorPersonalizado,
} from "../utils/errorHandler"

export const DetallePrestamos = () => {
  const navigate = useNavigate()
  const [animating, setAnimating] = useState(false)
  const [todosLosLibros, setTodosLosLibros] = useState<Libro[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ErrorPersonalizado | null>(null)
  const [activeTab, setActiveTab] = useState<TipoPrestamo>("prestados-a-mi")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [tipoAnterior, setTipoAnterior] = useState<string | null>(null)


  const usuarioId = authService.obtenerIdUsuarioActual()
  const { usuario } = useAuthContext()
  const tipoUsuario = usuario?.tipoUsuario
  const tipo = (tipoUsuario ?? "").toUpperCase().replace(/\s+/g, "_")
  const puedeReservar = tipo === "LECTOR" || tipo === "LECTORPUBLICADOR"
  const puedePublicar = tipo === "PUBLICADOR" || tipo === "LECTORPUBLICADOR"
  const itemsPerPage = 4
  const pestañas = [
    ...(puedeReservar
      ? [{ id: "prestados-a-mi", etiqueta: "Prestados a mí" }]
      : []),
    ...(puedePublicar
      ? [{ id: "prestados-por-mi", etiqueta: "Prestados por mí" }]
      : []),
  ]

  const fetchTodosLosPrestamos = async (tipo: TipoPrestamo = activeTab) => {
    if (!usuarioId) {
      setError({
        estado: 401,
        mensaje:
          "No estás logueado. Por favor iniciá sesión para ver tus préstamos.",
      })
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await libroService.obtenerTodosLosPrestamos(usuarioId, tipo)
      setTodosLosLibros(data)
    } catch (e: unknown) {
      const err = obtenerMensajeError(e)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  if (tipoUsuario && tipoUsuario !== tipoAnterior) {
    setTipoAnterior(tipoUsuario)

    const nuevaTab = pestañas[0]?.id as TipoPrestamo

    setTodosLosLibros([]) // limpia lo viejo
    setActiveTab(nuevaTab)
    fetchTodosLosPrestamos(nuevaTab)
  }

  useOnInit(() => {
    const initialTab = pestañas[0]?.id as TipoPrestamo
    setActiveTab(initialTab)
    fetchTodosLosPrestamos()
  })

  const librosFiltrados = useMemo(() => {
    if (!usuarioId) return []
    const query = searchQuery.toLowerCase().trim()
    if (!query) return todosLosLibros
    return todosLosLibros.filter(
      (libro) =>
        libro.titulo.toLowerCase().includes(query) ||
        libro.autor.toLowerCase().includes(query),
    )
  }, [todosLosLibros, searchQuery, usuarioId])

  const handleSearch = (query: string) => {
    setAnimating(true)
    setTimeout(() => {
      setSearchQuery(query)
      setCurrentPage(1)
      setAnimating(false)
    }, 150)
  }

  const handlePageChange = (page: number) => {
    setAnimating(true)
    setTimeout(() => {
      setCurrentPage(page)
      setAnimating(false)
    }, 150)
  }

  const handleTabChange = (id: string) => {
    const nuevoTipo = id as TipoPrestamo
    setAnimating(true)
    setTimeout(() => {
      setActiveTab(nuevoTipo)
      setCurrentPage(1)
      setAnimating(false)
    }, 150)
    fetchTodosLosPrestamos(nuevoTipo)
  }

  const totalPages = Math.max(
    1,
    Math.ceil(librosFiltrados.length / itemsPerPage),
  )
  const librosAMostrar = librosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    const es401 = error.estado === 401
    return (
      <div className="flex flex-col min-h-screen max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16">
        <ErrorCard
          error={error}
          alReintentar={!es401 ? fetchTodosLosPrestamos : undefined}
          alVolver={es401 ? () => navigate("/login") : undefined}
        />
      </div>
    )
  }

  // ── Happy path ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-serif text-on-surface">
            Mis Préstamos
          </h1>
          <p className="text-on-surface-variant text-sm max-w-md">
            Gestiona los intercambios y devoluciones de tu colección.
          </p>
        </div>
        <div className="w-full md:w-96">
          <SearchBar
            placeholder="Buscar por título o autor..."
            onSearch={handleSearch}
          />
        </div>
      </header>
      <Tabs
        pestañas={pestañas}
        idActivo={activeTab}
        alCambiar={handleTabChange}
        className="mb-10"
      />
      <main className="flex flex-col flex-1 gap-6 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-light" />
            <span className="text-on-surface-variant font-medium">
              Cargando tus libros...
            </span>
          </div>
        ) : librosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded border border-accent/20">
            <p className="text-on-surface-variant opacity-60">
              No se encontraron libros en esta categoría.
            </p>
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch transition-all duration-150
                ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
            >
              {librosAMostrar.map((libro) => (
                <LibroCard key={libro.id} libro={libro} tipoVista={activeTab} />
              ))}
            </div>
            <Paginacion
              pagina={currentPage}
              totalPaginas={totalPages}
              alCambiar={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  )
}
