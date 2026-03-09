import { Boton } from '../ui'

export type PropsPaginacion = {
  pagina: number
  totalPaginas: number
  alCambiar: (pagina: number) => void
  className?: string
}

export const Paginacion = ({ pagina, totalPaginas, alCambiar, className = '' }: PropsPaginacion) => {
  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <div className="text-xs text-secondary/60">
        Página {pagina} de {totalPaginas}
      </div>
      <div className="flex gap-2">
        <Boton
          tipo="gris"
          deshabilitado={pagina <= 1}
          alClic={() => alCambiar(pagina - 1)}
          className="px-3 py-2"
        >
          ‹
        </Boton>
        <Boton
          tipo="gris"
          deshabilitado={pagina >= totalPaginas}
          alClic={() => alCambiar(pagina + 1)}
          className="px-3 py-2"
        >
          ›
        </Boton>
      </div>
    </div>
  )
}

