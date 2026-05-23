import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { libroService } from "../services/libroService"
import { Libro } from "../classes/Libro"
import { ReseniasLibro } from "../components/detalleLibros/ReseniasLibro"
import { ReservaCard } from "../components/detalleLibros/ReservaCard"
import { InfoLibro } from "../components/detalleLibros/InfoLibro"
import { useAuthContext } from "../utils/hooks"
import { ChevronRight, Lock, CalendarDays } from "lucide-react"
import { formatearFechaVisual } from "../utils/dateHandlerReserva"
import { Card } from "../components/ui/Card"

export const DetalleLibro = () => {
  const { id } = useParams()
  const [libro, setLibro] = useState<Libro>()
  const [loading, setLoading] = useState(true)

  const [fechaDesde, setFechaDesde] = useState<string>("")
  const [fechaHasta, setFechaHasta] = useState<string>("")

  const { usuario, cargandoUsuario, actualizarUsuario } = useAuthContext()
  const usuarioId = usuario?.id ?? 0
  const bibliokarmasUsuario = usuario?.bibliokarmas || 0
  const esElegible = !!usuarioId && usuario?.tipoUsuario !== "Publicador" && libro?.propietarioId !== usuarioId
  const puedeReservar = esElegible && !libro?.estoyReservado

  const fetchLibro = async () => {
    try {
      if (id) {
        const data = await libroService.getLibroById(Number(id), usuarioId)
        setLibro(data)
      }
    } catch (error) {
      console.error("Error fetching libro", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!cargandoUsuario) {
      fetchLibro()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, cargandoUsuario])

  const handleReservaExitosa = async (desde: string, hasta: string) => {
    setLibro(prev => {
      if (!prev) return prev
      return new Libro({
        ...prev,
        estoyReservado: true,
        miReservaFechaHasta: hasta,
        reservas: [...(prev.reservas ?? []), { fechaDesde: desde, fechaHasta: hasta }],
      })
    })
    await actualizarUsuario()
  }

  const karmaEstimado = libro?.bibliokarma ?? 0
  let karmaCalculado = karmaEstimado
  if (libro && fechaDesde && fechaHasta && fechaHasta >= fechaDesde) {
    karmaCalculado = libro.calcularBibliokarma(fechaDesde, fechaHasta, bibliokarmasUsuario)
  }

  if (loading) return <div className="p-10 text-center text-primary">Cargando...</div>
  if (!libro) return <div className="p-10 text-center text-red-500">Libro no encontrado</div>

  return (
    <main className="min-h-screen bg-background text-secondary-dark">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-24 pb-16">

        {/* Breadcrumb */}
        <Link
          to="/home"
          className="flex items-center gap-1.5 text-xs font-semibold text-secondary/50 hover:text-secondary transition-colors mb-8"
        >
          Explorar <ChevronRight size={14} /> <span className="text-secondary-dark">{libro.titulo}</span>
        </Link>

        {/* Main grid: cover | info+reviews | columna reservas  */}
        <div
          className={
            esElegible
              ? "grid gap-8 items-start lg:grid-cols-[240px_1fr_320px] xl:grid-cols-[260px_1fr_340px]"
              : "grid gap-8 items-start lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]"
          }
        >
          {/* Column 1: cover — sticky */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-3 mx-auto w-48 sm:w-56 lg:w-auto lg:mx-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/5">
              {libro.imagenUrl ? (
                <img
                  src={libro.imagenUrl}
                  alt={libro.titulo}
                  className="w-full object-cover"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-surface-high border border-accent flex items-center justify-center text-secondary/30 text-6xl select-none">
                  📖
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 pt-1">
              {!libro.estoyReservado ? (
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-success-bg text-success border border-success/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Disponible
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-danger-bg text-danger border border-danger/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                    No Disponible
                  </span>
                  {libro.miReservaFechaHasta && (
                    <p className="text-xs text-secondary/50 text-center leading-relaxed">
                      Tu reserva vence el<br />
                      <span className="font-semibold text-secondary/70">{formatearFechaVisual(libro.miReservaFechaHasta)}</span>
                    </p>
                  )}
                </>
              )}
              {(libro.cantidadReservas ?? 0) > 0 && (
                <p className="text-xs text-secondary/40">
                  {libro.cantidadReservas} {libro.cantidadReservas === 1 ? "préstamo histórico" : "préstamos históricos"}
                </p>
              )}
            </div>
          </div>

          {/* Column 2: info + reviews */}
          <div className="flex flex-col gap-8 min-w-0">
            <InfoLibro libro={libro} karmaCalculado={karmaCalculado} mostrarKarma={esElegible} />
            <ReseniasLibro
              libroId={Number(id)}
              calificaciones={libro.ultimasCalificaciones}
              totalCalificaciones={libro.cantidadCalificaciones}
            />
          </div>

          {/* Column 3: reservation card or unavailable state */}
          {esElegible && (
            <div className="lg:sticky lg:top-24">
              {puedeReservar ? (
                <ReservaCard
                  libro={libro}
                  usuarioId={usuarioId}
                  onReservaExitosa={handleReservaExitosa}
                  fechaDesde={fechaDesde}
                  setFechaDesde={setFechaDesde}
                  fechaHasta={fechaHasta}
                  setFechaHasta={setFechaHasta}
                />
              ) : (
                <Card className="flex flex-col gap-0 overflow-hidden p-0">
                  <div className="px-5 pt-5 pb-4 border-b border-gray-100/10 flex items-center gap-2">
                    <Lock size={18} className="text-danger/70" />
                    <span className="text-lg font-bold text-secondary-dark">No disponible</span>
                  </div>
                  <div className="px-5 py-8 flex flex-col items-center gap-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-danger-bg flex items-center justify-center">
                      <Lock size={24} className="text-danger" />
                    </div>
                    <p className="text-sm text-secondary/70 leading-relaxed">
                      Ya tenés una reserva activa para este libro.
                    </p>
                    {libro.miReservaFechaHasta && (
                      <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-4 py-3">
                        <CalendarDays size={14} className="text-primary shrink-0" />
                        <p className="text-xs font-semibold text-secondary-dark">
                          Tu reserva vence el{" "}
                          <span className="text-primary">{formatearFechaVisual(libro.miReservaFechaHasta)}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}