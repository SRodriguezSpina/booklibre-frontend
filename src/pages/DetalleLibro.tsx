import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useOnInit } from "../utils/hooks"
import { libroService } from "../services/libroService"
import { Libro } from "../classes/Libro"
import { ReseniasLibro } from "../components/detalleLibros/ReseniasLibro"
import { ReservaCard } from "../components/detalleLibros/ReservaCard"
import { InfoLibro } from "../components/detalleLibros/InfoLibro"
import { Card } from "../components/ui/Card"
import { useAuthContext } from "../utils/hooks"
import { ChevronRight } from "lucide-react"

export const DetalleLibro = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [libro, setLibro] = useState<Libro>()
  const [loading, setLoading] = useState(true)

  const [fechaDesde, setFechaDesde] = useState<string>("")
  const [fechaHasta, setFechaHasta] = useState<string>("")

  // Usamos el contexto
  const { usuario, actualizarUsuario } = useAuthContext()
  const usuarioId = usuario?.id || 1
  const bibliokarmasUsuario = usuario?.bibliokarmas || 0

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

  const handleReservaExitosa = async () => {
    await fetchLibro() // Actualizamos el libro localmente para ver las fechas ocupadas
    await actualizarUsuario() // Actualizamos el contexto global (Navbar)
  }

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
          
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex items-center gap-1.5 text-xs font-semibold text-secondary/50 hover:text-secondary transition-colors w-fit"
          >
            Explorar <ChevronRight size={14} /> <span className="text-secondary-dark">{libro.titulo}</span>
          </button>

          <Card className="p-4 flex justify-center">
            <img src={libro.imagenUrl} alt={libro.titulo} className="w-full max-w-[280px] rounded-md shadow-md object-cover" />
          </Card>

          {usuarioId && (
            <ReservaCard
              libro={libro}
              usuarioId={usuarioId}
              onReservaExitosa={handleReservaExitosa}
              fechaDesde={fechaDesde}
              setFechaDesde={setFechaDesde}
              fechaHasta={fechaHasta}
              setFechaHasta={setFechaHasta}
            />
          )}
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          <InfoLibro libro={libro} karmaCalculado={karmaCalculado} />

          <ReseniasLibro
            libroId={Number(id)}
            calificaciones={libro.ultimasCalificaciones}
            totalCalificaciones={libro.cantidadCalificaciones}
          />
        </div>

      </div>
    </main>
  )
}