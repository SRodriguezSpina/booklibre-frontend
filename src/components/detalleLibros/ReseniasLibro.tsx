import type { CalificacionDTO } from "../../models/libroModel"

interface ReseniasLibroProps {
  calificaciones: CalificacionDTO[]
  totalCalificaciones?: number
}

const ESTRELLAS = (valor: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < valor ? "text-yellow-400" : "text-accent/30"}>★</span>
  ))

export const ReseniasLibro = ({ calificaciones, totalCalificaciones }: ReseniasLibroProps) => {
  if (calificaciones.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-secondary-dark">Reseñas de la Comunidad</h3>

        {totalCalificaciones !== undefined && totalCalificaciones > 2 && (
          <button
            type="button"
            className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            onClick={() => console.log("Abrir todas las reseñas")}
          >
            Ver las {totalCalificaciones} reseñas &rarr;
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calificaciones.map((calificacion, i) => (
          <div
            key={i}
            className="bg-surface-high border border-accent/30 rounded-2xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-light text-xs font-bold shrink-0">
                U{calificacion.usuarioId}
              </div>
              <div>
                <p className="text-xs font-bold text-secondary-dark">{calificacion.nombreUsuario}</p>
                <div className="flex text-sm">{ESTRELLAS(calificacion.valor)}</div>
              </div>
            </div>
            {calificacion.comentario && (
              <p className="text-xs text-secondary/70 leading-relaxed line-clamp-3">
                {calificacion.comentario}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}