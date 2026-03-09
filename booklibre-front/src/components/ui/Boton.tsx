import type { ButtonHTMLAttributes, ReactNode } from 'react'

type VarianteBoton = 'primario' | 'secundario' | 'gris' | 'outline' | 'ghost'

type PropsBoton = {
  tipo?: VarianteBoton
  children?: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  deshabilitado?: boolean
  className?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  'data-testid'?: string
}

const estilosPorVariante: Record<VarianteBoton, string> = {
  primario: 'bg-primary text-white hover:bg-primary-dark border-transparent',
  secundario: 'bg-surface border border-secondary text-secondary hover:bg-secondary/10',
  gris: 'bg-secondary/20 text-secondary hover:bg-secondary/30',
  outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/10',
  ghost: 'text-secondary hover:bg-secondary/10',
}

export function Boton({
  tipo = 'primario',
  children,
  onClick,
  deshabilitado = false,
  className = '',
  type = 'button',
  'data-testid': idPrueba = 'boton',
}: PropsBoton) {
  const clasesBase = 'inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  return (
    <button
      type={type}
      className={`${clasesBase} ${estilosPorVariante[tipo]} ${className}`}
      onClick={onClick}
      disabled={deshabilitado}
      data-testid={idPrueba}
    >
      {children}
    </button>
  )
}
