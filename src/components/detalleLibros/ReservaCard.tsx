import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { Card, CardHeader } from "../ui/Card"
import { Boton } from "../ui/Boton"
import { formatearFechaVisual, calcularDiferenciaDias } from "../../utils/dateHandlerReserva"
import { reservaService } from "../../services/reservaService"
import { Libro } from "../../classes/Libro"
import { CalendarDays, ChevronDown, ChevronUp, Package, RotateCcw, Clock } from "lucide-react"
import axios from "axios"
import { Calendario} from "../ui/Calendario"

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
const dateToStr = (d: Date) => d.toISOString().split("T")[0]

export const ReservaCard = ({
  libro, usuarioId, onReservaExitosa,
  fechaDesde, setFechaDesde, fechaHasta, setFechaHasta
}: ReservaCardProps) => {
  const [loading, setLoading] = useState(false)
  const [calendarAbierto, setCalendarAbierto] = useState(true)

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const diasDeshabilitados = [
    { before: hoy },
    ...libro.reservas.map(r => ({
      from: strToDate(r.fechaDesde),
      to: strToDate(r.fechaHasta),
    })),
  ]

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

  const errorValidacion: string | null = (() => {
    if (!fechaDesde || !fechaHasta) return null
    const inicio = strToDate(fechaDesde)
    const fin = strToDate(fechaHasta)
    const conflicto = libro.reservas.find(r => {
      const rDesde = strToDate(r.fechaDesde)
      const rHasta = strToDate(r.fechaHasta)
      return inicio <= rHasta && fin >= rDesde
    })
    if (conflicto) {
      return `El libro ya está reservado del ${formatearFechaVisual(conflicto.fechaDesde)} al ${formatearFechaVisual(conflicto.fechaHasta)}.`
    }
    return null
  })()

  const duracionDias = fechaDesde && fechaHasta
    ? calcularDiferenciaDias(fechaDesde, fechaHasta)
    : 0

  const handleReservar = async () => {
    if (!fechaDesde || !fechaHasta || errorValidacion) return
    setLoading(true)
    try {
      await reservaService.crearReserva({ libroId: libro.id, usuarioId, fechaDesde, fechaHasta })
      setFechaDesde("")
      setFechaHasta("")
      setCalendarAbierto(true)
      onReservaExitosa()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert("No se pudo confirmar la reserva. Intentá de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  const limpiarFechas = () => {
    setFechaDesde("")
    setFechaHasta("")
    setCalendarAbierto(true)
  }

  const hayFechasSeleccionadas = fechaDesde && fechaHasta && !errorValidacion

  return (
    <Card className="flex flex-col gap-0 overflow-hidden p-0">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100/10">
        <CardHeader
          titulo="Tu Reserva"
          icono={<CalendarDays size={18} className="text-primary" />}
          className="text-lg mb-0"
        />
      </div>

      {hayFechasSeleccionadas && !calendarAbierto && (
        <div className="px-5 py-4 border-b border-gray-100/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/50 mb-3">
            Fechas Seleccionadas:
          </p>
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

      <button
        type="button"
        onClick={() => setCalendarAbierto(v => !v)}
        className="flex items-center justify-between px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-secondary/50 hover:text-secondary/80 transition-colors border-b border-gray-100/10"
      >
        <span>{calendarAbierto ? "Cerrar Calendario" : "Cambiar Fechas"}</span>
        {calendarAbierto ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>


      {calendarAbierto && (
        <div className="border-b border-gray-100/10">
          <Calendario
            rangeSeleccionado={rangeSeleccionado}
            onSelect={handleSelect}
            diasDeshabilitados={diasDeshabilitados}
          />

          {libro.reservas.length > 0 && (
            <div className="px-5 pb-4 flex flex-col gap-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-0.5">
                No disponible:
              </p>
              {libro.reservas.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] text-secondary/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger/60 shrink-0" />
                  {formatearFechaVisual(r.fechaDesde)} → {formatearFechaVisual(r.fechaHasta)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {errorValidacion && (
        <div className="px-5 py-3 border-b border-gray-100/10">
          <p className="text-xs text-danger">{errorValidacion}</p>
        </div>
      )}

      <div className="px-5 py-4 flex flex-col gap-2">
        <Boton
          tipo="primario"
          className="w-full"
          onClick={handleReservar}
          deshabilitado={loading || !fechaDesde || !fechaHasta || !!errorValidacion}
        >
          {loading ? "Procesando..." : "Confirmar Reserva ✓"}
        </Boton>

        {hayFechasSeleccionadas && !errorValidacion && (
          <p
            onClick={limpiarFechas}
            className="text-[10px] text-secondary/40 hover:text-secondary/60 transition-colors text-center cursor-pointer"
          >
            Con la reserva no se encontrará disponible en el rango de fechas
          </p>
        )}
      </div>
    </Card>
  )
}