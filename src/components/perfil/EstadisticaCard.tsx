import { Card } from '../ui'

export type PropsEstadisticaCard = {
  valor: number
  etiqueta: string
  claseFondo?: string
}

export const EstadisticaCard = ({ valor, etiqueta, claseFondo = 'bg-accent/10' }: PropsEstadisticaCard) => {
  return (
    <Card className={`flex flex-col items-center justify-center py-8 border-none rounded-3xl shadow-sm ${claseFondo}`}>
      <div className="text-4xl font-extrabold text-secondary mb-1">{valor}</div>
      <div className="text-xs font-semibold text-secondary/40 uppercase tracking-tight text-center px-2">
        {etiqueta}
      </div>
    </Card>
  )
}

