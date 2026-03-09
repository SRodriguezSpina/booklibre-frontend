import type { ReactNode } from 'react'

export type PropsCard = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: PropsCard) {
  return (
    <div
      className={`rounded-3xl border border-gray-200/80 bg-surface p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </div>
  )
}

export type PropsCardHeader = {
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

