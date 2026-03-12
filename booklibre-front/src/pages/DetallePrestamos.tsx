import { useState } from "react"
import { Tabs } from "../components/ui/Tabs"
import { LibroCard } from "../components/libros/LibroCard"
import { Paginacion } from "../components/perfil/Paginacion"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService"
import { useOnInit } from "../utils/hooks"
import { Libro } from "../classes/Libro"
import type { TipoPrestamo } from "../models/libroModel"
import { SearchBar } from "../components/SearchBar"

export const DetallePrestamos = () => {
  const [libros, setLibros] = useState<Libro[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<TipoPrestamo>("prestados-a-mi")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>("") // Se usa para la petición
  const itemsPerPage = 4
  const pestañas = [
    { id: "prestados-a-mi", etiqueta: "Prestados a mí" },
    { id: "prestados-por-mi", etiqueta: "Prestados por mí" },
  ]
  // Función de carga centralizada
  const fetchPrestamos = async (tipo: TipoPrestamo, query: string = "") => {
    setLoading(true)
    try {
      const usuarioId = authService.obtenerIdUsuarioActual() || 1
      const data = await libroService.obtenerPrestamos(usuarioId, tipo, query)
      setLibros(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Al buscar, actualizamos estado y pedimos al service
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    fetchPrestamos(activeTab, query)
  }
  const totalPages = Math.ceil(libros.length / itemsPerPage)
  const librosAMostrar = libros.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleTabChange = (id: string) => {
    const nuevoTipo = id as TipoPrestamo
    setActiveTab(nuevoTipo)
    setCurrentPage(1)
    fetchPrestamos(nuevoTipo, searchQuery) // Mantiene el filtro al cambiar de tab
  }

  useOnInit(() => {
    fetchPrestamos(activeTab)
  })

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-8 bg-background">
      {/* ... Títulos y Párrafos ... */}
      <h1 className="text-3xl text-primary mb-4 mt-1">Préstamos de libros</h1>

      <p className="text-secondary-dark mb-4 opacity-70">
        Aquí vas a encontrar toda la información sobre el intercambio de libros
        con otros usuarios.
      </p>
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

      <main className="mt-6 flex flex-col flex-1 gap-6">
        {loading ? (
          <div className="flex justify-center py-10">Cargando...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
