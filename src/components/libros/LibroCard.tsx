import { Libro } from "../../classes/Libro"
import { useState } from "react"
import type { TipoPrestamo } from "../../models/libroModel"
import { ModalCalificacion } from "./ModalCalificacion"
import { libroService } from "../../services/libroService"
import { authService } from "../../services/AuthService"
import { useNavigate } from "react-router-dom"

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
  const handleCalificar = async (valor: number, comentario: string) => {
    await libroService.calificarLibro(
      libro.id,
      usuarioActualId,
      valor,
      comentario,
    )
    setRatingLocal(valor)
    setYaCalificado(true)
    console.log("Enviando:", { valor, comentario })
    setIsModalOpen(false)
    alert("¡Gracias por calificar!")
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
    if (libro.estaDevuelto()) return "bg-red-600 text-white"
    if (proximoAVencer) return "bg-yellow-400 text-yellow-950"
    if (estaDisponible) return "bg-blue-600 text-white"
    return "bg-green-600 text-white"
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-accent overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div
        onClick={goToDetail}
        className="relative h-90 bg-gray-100 flex items-center justify-center cursor-pointer group"
      >
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black z-10 shadow-md uppercase tracking-wider ${getBadgeStyles()}`}
        >
          {getEtiqueta()}
        </div>
        <img
          src={libro.imagenUrl}
          alt={libro.titulo}
          className="h-full object-cover"
        />
      </div>

      {/* 2. Contenedor de Información: flex-1 lo hace crecer para ocupar el alto sobrante */}
      <div className="p-4 flex flex-col flex-1 grow">
        <div className="grow flex flex-col gap-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-secondary-dark line-clamp-2 leading-tight">
              {libro.titulo}
            </h3>
            <span className="text-primary text-sm font-extrabold shrink-0">
              ★{ratingLocal}
            </span>
          </div>
          <p className="text-xs text-primary opacity-80">{libro.autor}</p>
        </div>

        {/* 3. Footer: mt-auto asegura que siempre esté abajo del flex-grow anterior */}
        <div className="mt-auto pt-3 border-t border-accent space-y-2 flex flex-col">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-secondary-light font-bold uppercase tracking-tighter shrink-0">
              👤 {esPrestamoRecibido ? "Prestado por:" : "Prestado a:"}
            </span>
            <span className="text-secondary-dark font-semibold truncate">
              Usuario{" "}
              {esPrestamoRecibido ? libro.propietarioId : libro.alquiladoPorId}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-secondary-light font-bold uppercase tracking-tighter shrink-0">
              📅 Rango:
            </span>
            <span className="text-secondary-dark font-semibold">
              {libro.fechaDesde} / {libro.fechaDevolucion || "Sin fecha"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-secondary-light font-bold uppercase tracking-tighter shrink-0">
              💎 Bibliokarma:
            </span>
            <span className="text-primary font-black">{libro.bibliokarma}</span>
          </div>
        </div>
        {/* Botón de Calificar modificado */}
        {/* Solo mostramos "Calificar" si el préstamo fue devuelto */}
        <button
          onClick={() => !yaCalificado && setIsModalOpen(true)}
          className={`mt-2 w-full py-2 rounded-lg text-xs font-bold transition-all shadow-sm border
          ${
            esPrestamoRecibido && libro.estaDevuelto()
              ? "visible"
              : "invisible pointer-events-none"
          }
          ${
            yaCalificado
              ? "bg-green-100 text-green-700 border-green-200 cursor-default"
              : "bg-background hover:bg-primary-dark hover:text-white border-accent/20 cursor-pointer"
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
