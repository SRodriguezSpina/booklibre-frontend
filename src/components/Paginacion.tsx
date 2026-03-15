import { ChevronLeft, ChevronRight } from 'lucide-react'

export type PropsPaginacion = {
  pagina: number
  totalPaginas: number
  alCambiar: (pagina: number) => void
  className?: string
}

const rango = (inicio: number, fin: number) =>
  Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)

export const Paginacion = ({ pagina, totalPaginas, alCambiar, className = '' }: PropsPaginacion) => {
  if (totalPaginas <= 1) return null

  return (
    <div className={`flex justify-center items-center gap-2 py-4 ${className}`}>
      <button
        type="button"
        disabled={pagina === 1}
        onClick={() => alCambiar(pagina - 1)}
        className="w-8 h-8 flex items-center justify-center bg-surface border border-accent rounded-full disabled:opacity-30 hover:bg-primary-light transition-colors text-primary-dark"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {rango(1, totalPaginas).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => alCambiar(page)}
          className={`w-8 h-8 flex items-center justify-center border rounded-full text-sm font-bold transition-colors ${
            pagina === page
              ? 'bg-primary-dark text-surface border-primary-dark shadow-inner'
              : 'bg-surface text-secondary-dark border-accent hover:bg-accent hover:text-primary-dark'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={pagina === totalPaginas}
        onClick={() => alCambiar(pagina + 1)}
        className="w-8 h-8 flex items-center justify-center bg-surface border border-accent rounded-full disabled:opacity-30 hover:bg-primary-light transition-colors text-primary-dark"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
