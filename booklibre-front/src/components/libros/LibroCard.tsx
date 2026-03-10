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
    if (proximoAVencer) return "bg-orange-100 text-orange-600"
    if (libro.alquiladoPorId) return "bg-blue-100 text-blue-600"
    return "bg-red-100 text-red-600"
  }

  const getEtiqueta = () => {
    if (proximoAVencer) return "PRÓXIMO A VENCER"
    if (libro.alquiladoPorId) return "ACTIVO"
    return "DEVUELTO"
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Contenedor de Imagen y Badge */}
      <div className="relative h-64 bg-gray-200">
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold z-10 ${getBadgeStyles()}`}
        >
          {getEtiqueta()}
        </div>
        <img
          src={`https://covers.openlibrary.org/b/isbn/${libro.id}-L.jpg`} // Placeholder usando el ID/ISBN
          alt={libro.titulo}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-800 line-clamp-1">
            {libro.titulo} [cite: 14]
          </h3>
          <span className="text-yellow-500 text-sm">★ 4.8</span>
        </div>
        <p className="text-xs text-gray-500">{libro.autor} [cite: 18]</p>

        <div className="mt-auto pt-3 border-t border-gray-50 space-y-2">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-gray-400">
              👤 {esPrestamoRecibido ? "Prestado por:" : "Prestado a:"}
            </span>
            <span className="text-gray-700 font-medium">
              Usuario{" "}
              {esPrestamoRecibido ? libro.propietarioId : libro.alquiladoPorId}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-gray-400">📅 Rango:</span>
            <span className="text-gray-700 font-medium">
              {libro.fechaDevolucion || "Sin fecha"}
            </span>{" "}
            [cite: 32]
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-gray-400">💎 BIBLOKARMA:</span>
            <span className="text-gray-700 font-bold">+240</span>
          </div>
        </div>

        {/* Acción de Calificar - Solo si me lo prestaron y está devuelto/cerca de vencer */}
        {esPrestamoRecibido && (
          <button
            onClick={() => console.log("Abrir modal calificación")}
            className="mt-3 w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
          >
            ★ Calificar
          </button>
        )}
      </div>
    </div>
  )
}
