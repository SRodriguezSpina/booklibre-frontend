export type PropsAvatar = {
  src?: string | null
  alt?: string
  tamaño?: 'chico' | 'mediano' | 'grande'
  className?: string
}

const clasesPorTamaño = {
  chico: 'w-8 h-8',
  mediano: 'w-12 h-12',
  grande: 'w-24 h-24',
}

export function Avatar({ src, alt = '', tamaño = 'mediano', className = '' }: PropsAvatar) {
  const claseTamaño = clasesPorTamaño[tamaño]

  return (
    <div
      className={`${claseTamaño} rounded-full overflow-hidden bg-secondary/20 flex items-center justify-center ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-secondary text-lg" aria-hidden>
          ?
        </span>
      )}
    </div>
  )
}

