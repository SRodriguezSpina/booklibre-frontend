import { Libro } from "../../classes/Libro"
import { useState } from "react"
import type { TipoPrestamo } from "../../models/libroModel"
import { ModalCalificacion } from "./ModalCalificacion"
import { libroService } from "../../services/libroService"
import { authService } from "../../services/AuthService"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { obtenerMensajeError } from "../../utils/errorHandler"

interface LibroCardProps {
  libro: Libro
  tipoVista: TipoPrestamo
}

export const LibroCard = ({ libro, tipoVista }: LibroCardProps) => {
  const [yaCalificado, setYaCalificado] = useState(libro.estaCalificado())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ratingLocal, setRatingLocal] = useState(libro.rating)
  const navigate = useNavigate()
  const esPrestamoRecibido = tipoVista === "prestados-a-mi"
  const proximoAVencer = libro.estaProximoAVencer()
  const estaDisponible = libro.estoyDisponible()
  const usuarioActualId = authService.obtenerIdUsuarioActual() || 1
  // Reemplazá el alert:
  const handleCalificar = async (valor: number, comentario: string) => {
    try {
      const res = await libroService.calificarLibro(
        libro.id,
        usuarioActualId,
        valor,
        comentario,
      )
      setRatingLocal(res.data.rating)
      setYaCalificado(true)
      setIsModalOpen(false)
      toast.success("¡Gracias por calificar! 📚")
    } catch (e: unknown) {
      const err = obtenerMensajeError(e)
      toast.error(err.mensaje || "No se pudo enviar la calificación.")
    }
  }
  const goToDetail = () => {
    navigate(`/libros/${libro.id}`)
  }
  const getEtiqueta = () => {
    if (libro.estaDevuelto()) return "DEVUELTO"
    if (proximoAVencer) return "PRÓXIMO A VENCER"
    if (estaDisponible) return "ACTIVO"
    return "EN PRÉSTAMO" // Estado por defecto si no es ninguna de las anteriores
  }

  const getBadgeStyles = () => {
    if (libro.estaDevuelto())
      return "bg-danger-bg text-danger border border-danger/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
    if (proximoAVencer)
      return "bg-warning-bg text-warning border border-warning/20 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
    if (estaDisponible)
      return "bg-[#0c2340] text-blue-400 border border-blue-400/20 shadow-[0_0_8px_rgba(96,165,250,0.2)]"
    return "bg-success-bg text-success border border-success/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
  }

  return (
    <div className="bg-surface rounded border border-accent/10 shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex flex-col h-full group hover:-translate-y-1 transition-transform duration-300">
      <div
        onClick={goToDetail}
        className="relative overflow-hidden cursor-pointer rounded-t"
        style={{ aspectRatio: "2/3" }}
      >
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold z-10 uppercase tracking-tighter ${getBadgeStyles()}`}
        >
          {getEtiqueta()}
        </div>
        <img
          src={libro.imagenUrl}
          alt={libro.titulo}
          className="w-full h-full object-contain bg-black/20 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="grow flex flex-col gap-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-serif text-xl text-on-surface line-clamp-2 leading-tight">
              {libro.titulo}
            </h3>
            <span className="text-primary-light text-sm font-extrabold shrink-0">
              ★{ratingLocal}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm italic mb-2">
            {libro.autor}
          </p>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent my-3" />

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant uppercase tracking-wider">
            <span>👤</span>
            <span className="font-bold shrink-0">
              {esPrestamoRecibido ? "Prestado por:" : "Prestado a:"}
            </span>
            <span className="text-on-surface font-semibold truncate">
              Usuario{" "}
              {esPrestamoRecibido ? libro.propietarioId : libro.alquiladoPorId}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant uppercase tracking-wider">
            <span>📅</span>
            <span className="font-bold shrink-0">Rango:</span>
            <span className="text-on-surface font-semibold">
              {libro.fechaDesde} / {libro.fechaHasta || "Sin fecha"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-primary-light uppercase tracking-wider font-bold">
            <span>💎</span>
            <span>Bibliokarma: {libro.bibliokarma}</span>
          </div>
        </div>

        <button
          onClick={() => !yaCalificado && setIsModalOpen(true)}
          className={`mt-auto w-full py-2 text-[10px] font-bold uppercase tracking-[0.1em] rounded transition-all border
          ${esPrestamoRecibido && libro.estaDevuelto() ? "visible" : "invisible pointer-events-none"}
          ${
            yaCalificado
              ? "bg-success-bg text-success border-success/20 cursor-default"
              : "border-primary/40 text-primary-light hover:bg-primary/10 cursor-pointer"
          }`}
        >
          {yaCalificado ? "✓ Calificado" : "★ Calificar"}
        </button>
      </div>
      <ModalCalificacion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCalificar}
        tituloLibro={libro.titulo}
      />
    </div>
  )
}
