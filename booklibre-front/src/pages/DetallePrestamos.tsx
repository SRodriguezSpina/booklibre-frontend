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

  // Carga inicial usando tu hook personalizado
  useOnInit(() => {
    fetchPrestamos("prestados-a-mi")
  })

  // Cambio de tab manual (sin useEffect)
  const handleTabChange = (id: string) => {
    const nuevoTipo = id as TipoPrestamo
    setActiveTab(nuevoTipo)
    fetchPrestamos(nuevoTipo)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <p className="text-gray-500 mb-4">
        Aquí vas a encontrar toda la información sobre el intercambio de libros
        con otros usuarios.
      </p>
      <Tabs tabs={tabs} active={activeTab} onChange={handleTabChange} />
      <main className="mt-6">
        {loading ? (
          <div className="flex justify-center py-10">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {libros.map((libro) => (
              <LibroCard
                key={libro.id}
                libro={libro}
                // Si es "prestados a mí", el usuario actual es el locatario
                // Si es "prestados por mí", el usuario actual es el dueño
                tipoVista={activeTab}
              />
            ))}
            {libros.length === 0 && (
              <p className="col-span-full text-center text-gray-400 py-10">
                No tienes libros en esta sección.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
