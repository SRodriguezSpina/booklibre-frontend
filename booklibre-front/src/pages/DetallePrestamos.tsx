import { useState } from "react"
import { Tabs } from "../components/Tabs"
import { LibroCard } from "../components/libros/LibroCard"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService"
import { useOnInit } from "../utils/hooks"
import { Libro } from "../classes/Libro"
import type { TipoPrestamo } from "../models/libroModel"

export const DetallePrestamos = () => {
  const [libros, setLibros] = useState<Libro[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<TipoPrestamo>("prestados-a-mi")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 4

  const tabs: { id: TipoPrestamo; label: string }[] = [
    { id: "prestados-a-mi", label: "Prestados a mí" },
    { id: "prestados-por-mi", label: "Prestados por mí" },
  ]

  const fetchPrestamos = async (tipo: TipoPrestamo) => {
    setLoading(true)
    try {
      const usuarioId = authService.obtenerIdUsuarioActual()
      if (!usuarioId) return
      const data = await libroService.obtenerPrestamos(usuarioId, tipo)
      setLibros(data)
    } catch (error) {
      console.error("Error al obtener libros:", error)
    } finally {
      setLoading(false)
    }
  }

  useOnInit(() => {
    fetchPrestamos("prestados-a-mi")
  })

  const handleTabChange = (id: string) => {
    const nuevoTipo = id as TipoPrestamo
    setActiveTab(nuevoTipo)
    setCurrentPage(1)
    fetchPrestamos(nuevoTipo)
  }

  const totalPages = Math.ceil(libros.length / itemsPerPage)
  const librosAMostrar = libros.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className="flex flex-col h-full bg-background p-6">
      <h1>Préstamos de libros</h1>
      <p className="text-secondary-dark mb-4 opacity-70">
        Aquí vas a encontrar toda la información sobre el intercambio de libros
        con otros usuarios.
      </p>

      <Tabs tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <main className="mt-6 flex flex-col flex-1 gap-6">
        {loading ? (
          <div className="flex justify-center py-10 italic text-primary font-medium">
            Cargando...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {librosAMostrar.map((libro) => (
                <LibroCard key={libro.id} libro={libro} tipoVista={activeTab} />
              ))}
            </div>

            {libros.length === 0 && (
              <p className="col-span-full text-center text-secondary-light py-10">
                No tienes libros en esta sección.
              </p>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-surface border border-accent rounded-full disabled:opacity-30 hover:bg-primary-light transition-colors text-primary-dark"
                >
                  &lt;
                </button>

                {range(1, totalPages).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center border rounded-full text-sm font-bold transition-colors ${
                      currentPage === page
                        ? "bg-primary-dark text-surface border-primary-dark shadow-inner"
                        : "bg-surface text-secondary-dark border-accent hover:bg-accent hover:text-primary-dark"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-surface border border-accent rounded-full disabled:opacity-30 hover:bg-primary-light transition-colors text-primary-dark"
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
