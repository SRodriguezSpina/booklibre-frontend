import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useOnInit } from "../utils/hooks"
import { libroService } from "../services/libroService"
import { Libro } from "../classes/Libro"
import { ReseniasLibro } from "../components/detalleLibros/ReseniasLibro"
import { ReservaCard } from "../components/detalleLibros/ReservaCard"
import { InfoLibro } from "../components/detalleLibros/InfoLibro"
import { useAuthContext } from "../utils/hooks"
import { ChevronRight } from "lucide-react"

export const DetalleLibro = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [libro, setLibro] = useState<Libro>()
  const [loading, setLoading] = useState(true)

  const [fechaDesde, setFechaDesde] = useState<string>("")
  const [fechaHasta, setFechaHasta] = useState<string>("")

  const { usuario, actualizarUsuario } = useAuthContext()
  const usuarioId = usuario?.id || 1
  const bibliokarmasUsuario = usuario?.bibliokarmas || 0
  const puedeReservar = !!usuarioId && usuario?.tipoUsuario !== "Publicador" && libro?.propietarioId !== usuarioId

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
    await fetchLibro()
    await actualizarUsuario()
  }

  let karmaCalculado = 0
  if (libro && fechaDesde && fechaHasta && fechaHasta >= fechaDesde) {
    karmaCalculado = libro.calcularBibliokarma(fechaDesde, fechaHasta, bibliokarmasUsuario)
  }

  if (loading) return <div className="p-10 text-center text-primary">Cargando...</div>
  if (!libro) return <div className="p-10 text-center text-red-500">Libro no encontrado</div>

  return (
    <main className="min-h-screen bg-background text-secondary-dark">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-24 pb-16">

        {/* Breadcrumb */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="flex items-center gap-1.5 text-xs font-semibold text-secondary/50 hover:text-secondary transition-colors mb-8"
        >
          Explorar <ChevronRight size={14} /> <span className="text-secondary-dark">{libro.titulo}</span>
        </button>

        {/* Main grid: cover | info+reviews | calendar */}
        <div
          className={
            puedeReservar
              ? "grid gap-8 items-start lg:grid-cols-[240px_1fr_320px] xl:grid-cols-[260px_1fr_340px]"
              : "grid gap-8 items-start lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]"
          }
        >
          {/* Column 1: cover — sticky */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-3 mx-auto w-48 sm:w-56 lg:w-auto lg:mx-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/5">
              <img
                src={libro.imagenUrl}
                alt={libro.titulo}
                className="w-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center gap-2 pt-1">
              {libro.disponibilidad === "DISPONIBLE" ? (
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-success-bg text-success border border-success/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Disponible
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-danger-bg text-danger border border-danger/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                  Reservado
                </span>
              )}
              {(libro.cantidadReservas ?? 0) > 0 && (
                <p className="text-xs text-secondary/40">
                  {libro.cantidadReservas} {libro.cantidadReservas === 1 ? "reserva histórica" : "reservas históricas"}
                </p>
              )}
            </div>
          </div>

          {/* Column 2: info + reviews */}
          <div className="flex flex-col gap-8 min-w-0">
            <InfoLibro libro={libro} karmaCalculado={karmaCalculado} mostrarKarma={puedeReservar} />
            <ReseniasLibro
              libroId={Number(id)}
              calificaciones={libro.ultimasCalificaciones}
              totalCalificaciones={libro.cantidadCalificaciones}
            />
          </div>

          {/* Column 3: reservation calendar — sticky, only for non-Publicador */}
          {puedeReservar && (
            <div className="lg:sticky lg:top-24">
              <ReservaCard
                libro={libro}
                usuarioId={usuarioId}
                onReservaExitosa={handleReservaExitosa}
                fechaDesde={fechaDesde}
                setFechaDesde={setFechaDesde}
                fechaHasta={fechaHasta}
                setFechaHasta={setFechaHasta}
              />
            </div>
          )}
        </div>

      </div>
    </main>
  )
}