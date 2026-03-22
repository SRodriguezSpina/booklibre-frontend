import { ChevronLeft, ChevronRight } from "lucide-react"

export type PropsPaginacion = {
  pagina: number
  totalPaginas: number
  alCambiar: (pagina: number) => void
  className?: string
}

const rango = (inicio: number, fin: number) =>
  Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)

export const Paginacion = ({
  pagina,
  totalPaginas,
  alCambiar,
  className = "",
}: PropsPaginacion) => {
  if (totalPaginas <= 1) return null

  return (
    <div className={`flex justify-center items-center gap-3 py-6 ${className}`}>
      <button
        type="button"
        disabled={pagina === 1}
        onClick={() => alCambiar(pagina - 1)}
        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary-light disabled:opacity-30 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {rango(1, totalPaginas).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => alCambiar(page)}
          className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded transition-all ${
            pagina === page
              ? "bg-primary text-background shadow-[0_0_8px_rgba(247,189,72,0.3)]"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={pagina === totalPaginas}
        onClick={() => alCambiar(pagina + 1)}
        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary-light disabled:opacity-30 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
