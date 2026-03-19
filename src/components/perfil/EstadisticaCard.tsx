import { Card } from '../ui'

export type PropsEstadisticaCard = {
  valor: number
  etiqueta: string
  claseFondo?: string
}

export const EstadisticaCard = ({
  valor,
  etiqueta,
  claseFondo = 'bg-accent/10',
}: PropsEstadisticaCard) => {
  return (
    <Card
      className={`flex flex-col items-center justify-center text-center border border-white/70 rounded-3xl shadow-sm ${claseFondo}`}
    >
      <div className="bg-white/80 w-full rounded-2xl px-5 py-5">
        <div className="text-4xl font-extrabold text-secondary leading-none">
          {valor}
        </div>
        <div className="mt-1.5 text-sm font-semibold text-secondary/60 leading-snug">
          {etiqueta}
        </div>
      </div>
    </Card>
  )
}

