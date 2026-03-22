export type PropsEstadisticaCard = {
  valor: number
  etiqueta: string
  icono?: string
}

export const EstadisticaCard = ({
  valor,
  etiqueta,
  icono,
}: PropsEstadisticaCard) => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-surface-high rounded-2xl p-5 border border-outline/20 shadow-sm gap-1">
      {icono && <span className="text-2xl mb-1">{icono}</span>}
      <span className="text-4xl font-black text-primary-light leading-none tabular-nums">
        {valor}
      </span>
      <span className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase leading-snug mt-1">
        {etiqueta}
      </span>
    </div>
  )
}
