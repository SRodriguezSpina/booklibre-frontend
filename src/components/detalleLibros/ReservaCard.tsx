import { useState, useMemo } from "react"
import { Card, CardHeader } from "../ui/Card"
import { Boton } from "../ui/Boton"
import { calcularDiferenciaDias, obtenerFechaHoy, formatearFechaVisual } from "../../utils/dateHandlerReserva"
import { reservaService } from "../../services/reservaService"
import axios from "axios"

interface ReservaCardProps {
  libroId: number
  usuarioId: number
  onReservaExitosa: () => void
  estaOcupadoHoy: boolean
}

export const ReservaCard = ({ libroId, usuarioId, onReservaExitosa, estaOcupadoHoy}: ReservaCardProps) => {
  const [fechaDesde, setFechaDesde] = useState<string>("")
  const [fechaHasta, setFechaHasta] = useState<string>("")

  const duracionDias = useMemo(
    () => calcularDiferenciaDias(fechaDesde, fechaHasta),
    [fechaDesde, fechaHasta]
  )

  const hoy = obtenerFechaHoy()
  const esReservaValida = fechaDesde !== "" && fechaHasta !== "" && duracionDias > 0

  const handleConfirmar = async () => {
    if (!esReservaValida) return

    try {
      await reservaService.crearReserva({
        libroId,
        usuarioId,
        fechaDesde,
        fechaHasta
      })

      alert("¡Reserva confirmada con éxito!")
      setFechaDesde("")
      setFechaHasta("")
      onReservaExitosa()

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const mensajeDeSpring = error.response?.data?.message

        if (mensajeDeSpring) {
          alert(mensajeDeSpring)
          return
        }
      }
      alert("No se pudo confirmar la reserva. Intentá de nuevo.")
    }
  }

  return (
    <Card className="p-6">
      <CardHeader
        titulo="Tu Reserva"
        className="text-lg text-secondary-dark"
        icono={
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />

      <div className="flex flex-col gap-4 mb-6 mt-2">
        <div>
          <label className="text-xs font-bold text-secondary uppercase opacity-70 mb-1.5 block">
            Recogida
          </label>
          <input
            type="date"
            value={fechaDesde}
            min={hoy}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="w-full bg-background rounded-lg p-2.5 text-sm border border-accent outline-none focus:border-primary text-secondary-dark transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-secondary uppercase opacity-70 mb-1.5 block">
            Devolución
          </label>
          <input
            type="date"
            value={fechaHasta}
            min={fechaDesde || hoy}
            onChange={(e) => setFechaHasta(e.target.value)}
            disabled={!fechaDesde}
            className="w-full bg-background rounded-lg p-2.5 text-sm border border-accent outline-none focus:border-primary text-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-sm mb-3">
        <span className="text-secondary opacity-80">Recogida</span>
        <span className="font-bold capitalize">{formatearFechaVisual(fechaDesde)}</span>
      </div>
      <div className="flex justify-between items-center text-sm mb-4">
        <span className="text-secondary opacity-80">Devolución</span>
        <span className="font-bold capitalize">{formatearFechaVisual(fechaHasta)}</span>
      </div>

      <div className="flex justify-between items-center text-sm mb-6 bg-blue-50 p-3 rounded-lg text-blue-600 font-medium">
        <span>Duración</span>
        <span>{duracionDias} {duracionDias === 1 ? 'Día' : 'Días'}</span>
      </div>

      <Boton
        className="w-full"
        tipo="primario"
        onClick={handleConfirmar}
        deshabilitado={!esReservaValida || estaOcupadoHoy} 
      >
        {estaOcupadoHoy ? "Libro no disponible" : "Confirmar Reserva"}
      </Boton>
      <p className="text-xs text-center text-secondary opacity-60 mt-3 px-4">
        Con la reserva no se encontrará disponible en el rango de fechas
      </p>
    </Card>
  )
}