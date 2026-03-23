import { useState } from "react"
import { Card, CardHeader } from "../ui/Card"
import { Boton } from "../ui/Boton"
import { obtenerFechaHoy, formatearFechaVisual } from "../../utils/dateHandlerReserva"
import { reservaService } from "../../services/reservaService"
import { Libro } from "../../classes/Libro"
import axios from "axios"

interface ReservaCardProps {
  libro: Libro
  usuarioId: number
  onReservaExitosa: () => void
  estaOcupadoHoy: boolean
  fechaDesde: string
  setFechaDesde: (fecha: string) => void
  fechaHasta: string
  setFechaHasta: (fecha: string) => void
}

export const ReservaCard = ({ 
  libro, usuarioId, onReservaExitosa, estaOcupadoHoy, 
  fechaDesde, setFechaDesde, fechaHasta, setFechaHasta 
}: ReservaCardProps) => {

  const [loading, setLoading] = useState<boolean>(false)
  const hoyStr = obtenerFechaHoy()

  let errorValidacion = ""

  if (fechaDesde && fechaHasta) {
    if (fechaHasta < fechaDesde) {
      errorValidacion = "La fecha de devolución no puede ser anterior al inicio."
    }
    else if (libro.fechaDesde && libro.fechaHasta) { 
      const inicioElegido = new Date(fechaDesde + "T12:00:00")
      const finElegido = new Date(fechaHasta + "T12:00:00")
      const reservaActivaInicio = new Date(libro.fechaDesde + "T12:00:00")
      const reservaActivaFin = new Date(libro.fechaHasta + "T12:00:00")

      if (inicioElegido <= reservaActivaFin && finElegido >= reservaActivaInicio) {
        const visualDesde = formatearFechaVisual(libro.fechaDesde)
        const visualHasta = formatearFechaVisual(libro.fechaHasta)
        errorValidacion = `El libro ya está reservado del ${visualDesde} al ${visualHasta}. Por favor, elegí otro rango.`
      }
    }
  }


  const handleReservar = async () => {
    if (!fechaDesde || !fechaHasta || errorValidacion) return

    setLoading(true)

    try {
      await reservaService.crearReserva({
        libroId: libro.id,
        usuarioId: usuarioId,
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta
      })

      setFechaDesde("")
      setFechaHasta("")
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

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader
        titulo="Solicitar Reserva"
        className="text-xl border-b border-gray-100 pb-2 mb-2"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold">¿Cuándo lo pasás a buscar?</label>
        <input
          type="date"
          min={hoyStr}
          value={fechaDesde}
          onChange={(e) => {
            setFechaDesde(e.target.value)
          }}
          className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold">¿Cuándo lo devolvés?</label>
        <input
          type="date"
          min={fechaDesde || hoyStr}
          value={fechaHasta}
          onChange={(e) => {
            setFechaHasta(e.target.value)
          }}
          className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
        />
      </div>

      <Boton
        tipo="primario"
        className="w-full mt-2"
        onClick={handleReservar}
        deshabilitado={loading || !fechaDesde || !fechaHasta || !!errorValidacion} 
      >
        {loading ? "Procesando..." : "Confirmar Reserva"}
      </Boton>

      {estaOcupadoHoy && libro.fechaDesde && libro.fechaHasta && (
        <div className="p-3 text-sm rounded-md flex flex-col gap-1">
          <p>
            Con reserva actual no se encontrara disponible en el rango de fechas <b>{formatearFechaVisual(libro.fechaDesde)}</b> al <b>{formatearFechaVisual(libro.fechaHasta)}</b>.
          </p>
        </div>
      )}
    </Card>
  )
}