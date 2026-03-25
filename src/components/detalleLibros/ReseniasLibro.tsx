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
        {totalCalificaciones != null && totalCalificaciones > 0 && (
          <span className="text-xs text-secondary/50 font-medium">
            {totalCalificaciones} reseña{totalCalificaciones !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calificaciones.map((c, i) => (
          <div
            key={i}
            className="bg-surface-high border border-accent/30 rounded-2xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-light text-xs font-bold shrink-0">
                U{c.usuarioId}
              </div>
              <div>
                <p className="text-xs font-bold text-secondary-dark">Usuario {c.usuarioId}</p>
                <div className="flex text-sm">{ESTRELLAS(c.valor)}</div>
              </div>
            </div>
            {c.comentario && (
              <p className="text-xs text-secondary/70 leading-relaxed line-clamp-3">
                {c.comentario}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}