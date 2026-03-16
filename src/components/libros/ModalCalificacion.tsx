import { useState } from "react"

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-secondary-dark mb-1">
            Calificar Libro
          </h2>
          <p className="text-sm text-secondary opacity-70 mb-6">
            {tituloLibro}
          </p>

          {/* Selector de Estrellas */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-3xl transition-transform hover:scale-110 ${
                  star <= (hover || rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </button>
            ))}
          </div>

          {/* Área de Comentario */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-secondary-light">
              Tu comentario
            </label>
            <textarea
              className="w-full h-32 p-3 rounded-xl border border-accent bg-gray-50 text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              placeholder="Cuéntanos qué te pareció el libro..."
              maxLength={MAX_CARACTERES}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <div className="flex justify-end">
              <span
                className={`text-[10px] font-bold ${comentario.length >= MAX_CARACTERES ? "text-red-500" : "text-secondary-light"}`}
              >
                {comentario.length} / {MAX_CARACTERES}
              </span>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex border-t border-accent">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-sm font-bold text-secondary hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSubmit(rating, comentario)}
            disabled={rating === 0}
            className="flex-1 py-4 text-sm font-bold bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Enviar Calificación
          </button>
        </div>
      </div>
    </div>
  )
}
