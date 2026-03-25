import { useState } from "react"
import { useParams } from "react-router-dom"
import { useOnInit } from "../utils/hooks"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService"
import { Libro } from "../classes/Libro"
import { ReseniasLibro } from "../components/detalleLibros/ReseniasLibro"
import { ReservaCard } from "../components/detalleLibros/ReservaCard"
import { InfoLibro } from "../components/detalleLibros/InfoLibro"
import { Card } from "../components/ui/Card"

export const DetalleLibro = () => {
  const { id } = useParams()
  const [libro, setLibro] = useState<Libro>()
  const [loading, setLoading] = useState(true)

  // NUEVO: Estados de las fechas subidos al padre
  const [fechaDesde, setFechaDesde] = useState<string>("")
  const [fechaHasta, setFechaHasta] = useState<string>("")

  const usuarioId = authService.obtenerIdUsuarioActual() || 1
  const bibliokarmasUsuario = 0 // Ajustá a authService.obtenerBibliokarmasUsuarioActual()

  const fetchLibro = async () => {
    try {
      if (id) {
        const data = await libroService.getLibroById(Number(id))
        setLibro(data)
      }
    } catch (error) {
      console.error("Error fetching libro", error)
    } finally {
      setLoading(false)
    }
  }

  useOnInit(() => { fetchLibro() })

  let karmaCalculado = 0
  if (libro && fechaDesde && fechaHasta && fechaHasta >= fechaDesde) {
    karmaCalculado = libro.calcularBibliokarma(fechaDesde, fechaHasta, bibliokarmasUsuario)
  }

  if (loading) return <div className="p-10 text-center text-primary">Cargando...</div>
  if (!libro) return <div className="p-10 text-center text-red-500">Libro no encontrado</div>

  return (
    <main className="min-h-screen bg-background p-6 md:p-10 text-secondary-dark">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pt-20">

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <Card className="p-4 flex justify-center">
            <img src={libro.imagenUrl} alt={libro.titulo} className="w-full max-w-[280px] rounded-md shadow-md object-cover" />
          </Card>

          <ReservaCard
            libro={libro}
            usuarioId={usuarioId}
            onReservaExitosa={fetchLibro}
            fechaDesde={fechaDesde}
            setFechaDesde={setFechaDesde}
            fechaHasta={fechaHasta}
            setFechaHasta={setFechaHasta}
          />
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          <InfoLibro libro={libro} karmaCalculado={karmaCalculado} />

          {/* NUEVO */}
          <ReseniasLibro
            calificaciones={libro.ultimasCalificaciones}
          />
        </div>

      </div>
    </main>
  )
}