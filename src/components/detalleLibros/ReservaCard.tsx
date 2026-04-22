import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Card, CardHeader } from "../ui/Card"
import { Boton } from "../ui/Boton"
import { formatearFechaVisual, calcularDiferenciaDias } from "../../utils/dateHandlerReserva"
import { reservaService } from "../../services/reservaService"
import { Libro } from "../../classes/Libro"
import { CalendarDays, Package, RotateCcw, Clock, Pencil, CheckCircle2 } from "lucide-react"
import { Calendario } from "../ui/Calendario"
import { toast } from "react-toastify"
import { obtenerMensajeError } from "../../utils/errorHandler"

interface ReservaCardProps {
  libro: Libro
  usuarioId: number
  onReservaExitosa: () => void
  fechaDesde: string
  setFechaDesde: (fecha: string) => void
  fechaHasta: string
  setFechaHasta: (fecha: string) => void
}

const strToDate = (str: string) => new Date(str + "T12:00:00")
const dateToStr = (d: Date) => format(d, "yyyy-MM-dd")

export const ReservaCard = ({
  libro, usuarioId, onReservaExitosa,
  fechaDesde, setFechaDesde, fechaHasta, setFechaHasta
}: ReservaCardProps) => {
  const [loading, setLoading] = useState(false)
  const [calendarAbierto, setCalendarAbierto] = useState(true)
  const [reservaConfirmada, setReservaConfirmada] = useState<{ desde: string; hasta: string } | null>(null)

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const diasDeshabilitados = [{ before: hoy }]

  const rangeSeleccionado: DateRange | undefined = fechaDesde
    ? { from: strToDate(fechaDesde), to: fechaHasta ? strToDate(fechaHasta) : undefined }
    : undefined

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      setFechaDesde("")
      setFechaHasta("")
      return
    }

    const nuevoDesde = range.from ? dateToStr(range.from) : ""
    const nuevoHasta = range.to ? dateToStr(range.to) : ""

    const esPrimerClic = nuevoDesde && nuevoHasta && nuevoDesde === nuevoHasta && !fechaDesde

    setFechaDesde(nuevoDesde)

    if (esPrimerClic) {
      setFechaHasta("")
    } else {
      setFechaHasta(nuevoHasta)
      if (nuevoHasta) {
        setCalendarAbierto(false)
      }
    }
  }

  const duracionDias = fechaDesde && fechaHasta
    ? calcularDiferenciaDias(fechaDesde, fechaHasta)
    : 0

  const handleReservar = async () => {
    if (!fechaDesde || !fechaHasta) return
    setLoading(true)
    try {
      await reservaService.crearReserva({ libroId: libro.id, usuarioId, fechaDesde, fechaHasta })
      setReservaConfirmada({ desde: fechaDesde, hasta: fechaHasta })
      setFechaDesde("")
      setFechaHasta("")
      setCalendarAbierto(true)
      toast.success("¡Reserva confirmada con éxito!")
      onReservaExitosa()
    } catch (error) {
      const err = obtenerMensajeError(error)
      toast.error(err.mensaje || "No se pudo confirmar la reserva. Intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleModificarFechas = () => {
    setFechaDesde("")
    setFechaHasta("")
    setCalendarAbierto(true)
  }

  const hayFechasSeleccionadas = !!(fechaDesde && fechaHasta)

  return (
    <Card className="flex flex-col gap-0 overflow-hidden p-0">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100/10">
        <CardHeader
          titulo={reservaConfirmada ? "Reserva Confirmada" : "Tu Reserva"}
          icono={
            reservaConfirmada
              ? <CheckCircle2 size={18} className="text-success" />
              : <CalendarDays size={18} className="text-primary" />
          }
          className="text-lg mb-0"
        />
      </div>

      {reservaConfirmada ? (
        <div className="px-5 py-8 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center">
            <CheckCircle2 size={28} className="text-success" />
          </div>
          <p className="text-sm font-semibold text-secondary-dark">
            ¡El libro está reservado para vos!
          </p>
          <div className="w-full flex flex-col gap-0">
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100/10">
              <div className="flex items-center gap-2 text-secondary/60">
                <Package size={13} />
                <span className="text-xs font-semibold">Retiro</span>
              </div>
              <span className="text-xs font-bold text-secondary-dark">
                {formatearFechaVisual(reservaConfirmada.desde)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2 text-secondary/60">
                <RotateCcw size={13} />
                <span className="text-xs font-semibold">Devolución</span>
              </div>
              <span className="text-xs font-bold text-secondary-dark">
                {formatearFechaVisual(reservaConfirmada.hasta)}
              </span>
            </div>
          </div>
          <p className="text-xs text-secondary/40">
            El libro quedará reservado a tu nombre hasta el{" "}
            <span className="font-semibold text-secondary/60">{formatearFechaVisual(reservaConfirmada.hasta)}</span>
          </p>
        </div>
      ) : (
        <>

      {hayFechasSeleccionadas && !calendarAbierto && (
        <div className="px-5 py-4 border-b border-gray-100/10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/50">
              Fechas Seleccionadas
            </p>
            <button
              type="button"
              onClick={handleModificarFechas}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary/70 hover:text-primary transition-colors"
            >
              <Pencil size={10} />
              Modificar
            </button>
          </div>
          <div className="flex items-center gap-3 mb-3 bg-primary/10 rounded-lg px-3 py-2.5">
            <CalendarDays size={14} className="text-primary shrink-0" />
            <span className="text-sm font-semibold text-secondary-dark">
              {formatearFechaVisual(fechaDesde)} → {formatearFechaVisual(fechaHasta)}
            </span>
          </div>
          <div className="flex flex-col gap-0">
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100/10">
              <div className="flex items-center gap-2 text-secondary/60">
                <Package size={13} />
                <span className="text-xs font-semibold">Recogido</span>
              </div>
              <span className="text-xs font-bold text-secondary-dark">
                {formatearFechaVisual(fechaDesde)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100/10">
              <div className="flex items-center gap-2 text-secondary/60">
                <RotateCcw size={13} />
                <span className="text-xs font-semibold">Devolución</span>
              </div>
              <span className="text-xs font-bold text-secondary-dark">
                {formatearFechaVisual(fechaHasta)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2 text-secondary/60">
                <Clock size={13} />
                <span className="text-xs font-semibold">Duración</span>
              </div>
              <span className="text-xs font-bold text-primary">
                {duracionDias} {duracionDias === 1 ? "día" : "días"}
              </span>
            </div>
          </div>
        </div>
      )}

      {calendarAbierto && (
        <div className="border-b border-gray-100/10">
          <Calendario
            rangeSeleccionado={rangeSeleccionado}
            onSelect={handleSelect}
            diasDeshabilitados={diasDeshabilitados}
          />
        </div>
      )}

        <div className="px-5 py-4 flex flex-col gap-2">
          <Boton
            tipo="primario"
            className="w-full"
            onClick={handleReservar}
            deshabilitado={loading || !fechaDesde || !fechaHasta}
          >
            {loading ? "Procesando..." : "Confirmar Reserva ✓"}
          </Boton>

          {hayFechasSeleccionadas && (
            <p className="text-xs text-secondary/40 text-center">
              El libro quedará reservado a tu nombre hasta el {formatearFechaVisual(fechaHasta)}
            </p>
          )}
        </div>
        </>
      )}
    </Card>
  )
}