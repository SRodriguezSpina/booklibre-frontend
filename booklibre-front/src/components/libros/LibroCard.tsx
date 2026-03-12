import { Libro } from "../../classes/Libro"
import type { TipoPrestamo } from "../../models/libroModel"

interface LibroCardProps {
  libro: Libro
  tipoVista: TipoPrestamo
}

export const LibroCard = ({ libro, tipoVista }: LibroCardProps) => {
  const esPrestamoRecibido = tipoVista === "prestados-a-mi"
  const proximoAVencer = libro.estaProximoAVencer()

  const getBadgeStyles = () => {
    // Próximo a vencer: Fondo amarillo, texto negro/café para contraste
    if (proximoAVencer) return "bg-yellow-400 text-yellow-950"

    // Activo (Alquilado): Fondo azul, texto blanco
    if (libro.alquiladoPorId) return "bg-blue-600 text-white"

    // Devuelto: Fondo rojo, texto blanco
    return "bg-red-600 text-white"
  }

  const getEtiqueta = () => {
    if (proximoAVencer) return "PRÓXIMO A VENCER"
    if (libro.alquiladoPorId) return "ACTIVO"
    return "DEVUELTO"
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-accent overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="relative h-64 bg-gray-100">
        {/* Badge con los nuevos estilos */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black z-10 shadow-md uppercase tracking-wider ${getBadgeStyles()}`}
        >
          {getEtiqueta()}
        </div>

        <img
          src={libro.imagenUrl}
          alt={libro.titulo}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-secondary-dark line-clamp-1">
            {libro.titulo}
          </h3>
          <span className="text-accent text-sm font-extrabold">
            ★{libro.rating}
          </span>
        </div>
        <p className="text-xs text-secondary opacity-80">{libro.autor}</p>

        <div className="mt-auto pt-3 border-t border-accent space-y-2">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-secondary-light font-bold uppercase tracking-tighter">
              👤 {esPrestamoRecibido ? "Prestado por:" : "Prestado a:"}
            </span>
            <span className="text-secondary-dark font-semibold">
              Usuario{" "}
              {esPrestamoRecibido ? libro.propietarioId : libro.alquiladoPorId}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-secondary-light font-bold uppercase tracking-tighter">
              📅 Rango:
            </span>
            <span className="text-secondary-dark font-semibold">
              {libro.fechaDesde}-{libro.fechaDevolucion || "Sin fecha"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-secondary-light font-bold uppercase tracking-tighter">
              💎 Bibliokarma:
            </span>
            <span className="text-primary font-black">{libro.bibliokarma}</span>
          </div>
        </div>

        {esPrestamoRecibido && (
          <button
            onClick={() => console.log("Abrir modal calificación")}
            className="mt-3 w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark active:bg-accent transition-all shadow-sm"
          >
            ★ Calificar
          </button>
        )}
      </div>
    </div>
  )
}
