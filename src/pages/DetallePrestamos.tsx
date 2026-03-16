import { useState, useMemo } from "react"
import { Tabs } from "../components/ui/Tabs"
import { LibroCard } from "../components/libros/LibroCard"
import { Paginacion } from "../components/ui/Paginacion"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService"
import { useOnInit } from "../utils/hooks"
import { Libro } from "../classes/Libro"
import type { TipoPrestamo } from "../models/libroModel"
import { SearchBar } from "../components/ui/SearchBar"

export const DetallePrestamos = () => {
  // 1. Cargamos TODOS los libros aquí
  const [todosLosLibros, setTodosLosLibros] = useState<Libro[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<TipoPrestamo>("prestados-a-mi")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>("")

  const usuarioId = authService.obtenerIdUsuarioActual() || 1
  const itemsPerPage = 4
  const pestañas = [
    { id: "prestados-a-mi", etiqueta: "Prestados a mí" },
    { id: "prestados-por-mi", etiqueta: "Prestados por mí" },
  ]

  // 2. Carga inicial: Solo trae los datos una vez
  const fetchTodosLosPrestamos = async () => {
    setLoading(true)
    try {
      const data = await libroService.obtenerTodosLosPrestamos(usuarioId)
      setTodosLosLibros(data)
    } catch (error) {
      console.error("Error cargando préstamos:", error)
    } finally {
      setLoading(false)
    }
  }

  useOnInit(() => {
    fetchTodosLosPrestamos()
  })

  // 3. FILTRADO EN MEMORIA (Instantáneo)
  const librosFiltrados = useMemo(() => {
    return libroService.filtrarPrestamos(
      todosLosLibros,
      activeTab,
      usuarioId,
      searchQuery,
    )
  }, [todosLosLibros, activeTab, searchQuery, usuarioId])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleTabChange = (id: string) => {
    setActiveTab(id as TipoPrestamo)
    setCurrentPage(1)
  }

  const totalPages = Math.max(
    1,
    Math.ceil(librosFiltrados.length / itemsPerPage),
  )
  const librosAMostrar = librosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-8 bg-background px-4">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2 mt-4">
          Préstamos de libros
        </h1>
        <p className="text-secondary-dark opacity-70">
          Gestiona los intercambios y devoluciones de tu colección.
        </p>
      </header>

      <div className="mb-1 max-w-md">
        <SearchBar
          placeholder="Buscar por título o autor..."
          onSearch={handleSearch}
        />
      </div>

      <Tabs
        pestañas={pestañas}
        idActivo={activeTab}
        alCambiar={handleTabChange}
      />

      <main className="mt-6 flex flex-col flex-1 gap-6 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <span className="text-secondary font-medium">
              Cargando tus libros...
            </span>
          </div>
        ) : librosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl border border-accent">
            <p className="text-secondary opacity-60">
              No se encontraron libros en esta categoría.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {librosAMostrar.map((libro) => (
                <LibroCard key={libro.id} libro={libro} tipoVista={activeTab} />
              ))}
            </div>

            <Paginacion
              pagina={currentPage}
              totalPaginas={totalPages}
              alCambiar={setCurrentPage}
            />
          </>
        )}
      </main>
    </div>
  )
}
