export type Pestaña = {
  id: string
  etiqueta: string
}

type PropsTabs = {
  pestañas: Pestaña[]
  idActivo: string
  alCambiar: (id: string) => void
  className?: string
}

export function Tabs({ pestañas, idActivo, alCambiar, className = '' }: PropsTabs) {
  return (
    <div className={`flex border-b border-secondary/30 ${className}`}>
      {pestañas.map((pestaña) => (
        <button
          key={pestaña.id}
          type="button"
          onClick={() => alCambiar(pestaña.id)}
          className={`flex-1 pb-2 text-center font-medium transition-colors cursor-pointer ${
            idActivo === pestaña.id
              ? 'text-primary border-b-2 border-primary'
              : 'text-secondary hover:text-primary'
          }`}
        >
          {pestaña.etiqueta}
        </button>
      ))}
    </div>
  )
}
