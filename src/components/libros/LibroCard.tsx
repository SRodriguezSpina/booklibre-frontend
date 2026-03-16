import { Libro } from "../../classes/Libro"
import { useState } from "react"
import type { TipoPrestamo } from "../../models/libroModel"
import { ModalCalificacion } from "./ModalCalificacion"
import { libroService } from "../../services/libroService"
import { authService } from "../../services/AuthService"

interface LibroCardProps {
  libro: Libro
  tipoVista: TipoPrestamo
}

export const LibroCard = ({ libro, tipoVista }: LibroCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
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
    console.log("Enviando:", { valor, comentario })
    setIsModalOpen(false)
    alert("¡Gracias por calificar!")
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
      {/* 1. Contenedor de Imagen: Altura fija */}
      <div className="relative h-90 bg-gray-100 flex items-center justify-center">
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
        {/* ESTE DIV es la clave: flex-grow hace que esta sección ocupe todo el espacio 
            disponible, empujando el footer (mt-auto) hacia el final */}
        <div className="grow flex flex-col gap-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-secondary-dark line-clamp-2 leading-tight">
              {libro.titulo}
            </h3>
            <span className="text-accent text-sm font-extrabold shrink-0">
              ★{libro.rating}
            </span>
          </div>
          <p className="text-xs text-secondary opacity-80">{libro.autor}</p>
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

          {/* Botón de Calificar modificado */}
          {/* Solo mostramos "Calificar" si el préstamo fue devuelto */}
          {esPrestamoRecibido && libro.estaDevuelto() && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 w-full py-2 bg-background rounded-lg text-xs font-bold hover:bg-primary-dark hover:text-white transition-all shadow-sm border border-accent/20"
            >
              ★ Calificar
            </button>
          )}
        </div>
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
