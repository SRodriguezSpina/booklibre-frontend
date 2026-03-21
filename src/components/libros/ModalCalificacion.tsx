import { useState } from "react"
import { createPortal } from "react-dom"
interface ModalCalificacionProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (valor: number, comentario: string) => void
  tituloLibro: string
}

export const ModalCalificacion = ({
  isOpen,
  onClose,
  onSubmit,
  tituloLibro,
}: ModalCalificacionProps) => {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comentario, setComentario] = useState("")
  const MAX_CARACTERES = 200

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface rounded border border-accent/20 shadow-[0_24px_48px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-serif text-on-surface mb-1">
            Calificar Libro
          </h2>
          <p className="text-sm text-on-surface-variant mb-6">{tituloLibro}</p>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-3xl transition-transform hover:scale-110 ${
                  star <= (hover || rating)
                    ? "text-primary-light"
                    : "text-accent/40"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Tu comentario
            </label>
            <textarea
              className="w-full h-32 p-3 rounded border border-accent/30 bg-surface-high text-on-surface text-sm focus:ring-1 focus:ring-primary focus:outline-none resize-none placeholder:text-on-surface-variant/40"
              placeholder="Cuéntanos qué te pareció el libro..."
              maxLength={MAX_CARACTERES}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <div className="flex justify-end">
              <span
                className={`text-[10px] font-bold ${comentario.length >= MAX_CARACTERES ? "text-danger" : "text-on-surface-variant"}`}
              >
                {comentario.length} / {MAX_CARACTERES}
              </span>
            </div>
          </div>
        </div>

        <div className="flex border-t border-accent/20">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-sm font-bold text-on-surface-variant hover:bg-surface-high transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSubmit(rating, comentario)}
            disabled={rating === 0}
            className="flex-1 py-4 text-sm font-bold bg-primary text-background hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Enviar Calificación
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
