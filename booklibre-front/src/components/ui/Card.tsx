import type { ReactNode } from 'react'

type PropsCard = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: PropsCard) {
  return (
    <div
      className={`rounded-xl border border-secondary/20 bg-surface p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

type PropsCardHeader = {
  titulo: string
  icono?: ReactNode
  className?: string
}

export function CardHeader({ titulo, icono, className = '' }: PropsCardHeader) {
  return (
    <div className={`flex items-center gap-2 mb-4 font-semibold text-secondary ${className}`}>
      {icono}
      <span>{titulo}</span>
    </div>
  )
}
