import { Card } from '../ui'

export type PropsEstadisticaCard = {
  valor: number
  etiqueta: string
  claseFondo?: string
}

export const EstadisticaCard = ({ valor, etiqueta, claseFondo = 'bg-accent/10' }: PropsEstadisticaCard) => {
  return (
    <Card className={`flex flex-col items-center justify-center py-6 border-none ${claseFondo}`}>
      <div className="text-2xl font-semibold text-secondary">{valor}</div>
      <div className="text-sm text-secondary/70">{etiqueta}</div>
    </Card>
  )
}

