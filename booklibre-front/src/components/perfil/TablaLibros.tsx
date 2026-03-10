import { Badge } from '../ui'
import type { Libro } from '../../models/libroModel'

export type PropsTablaLibros = {
  libros: Libro[]
  campoOrden: 'titulo' | 'estado' | 'fecha'
  sentidoOrden: 'ascendente' | 'descendente'
  alCambiarOrden: (campo: 'titulo' | 'estado' | 'fecha') => void
}

const badgePorEstado = (estado: Libro['estado']) => {
  if (estado === 'Disponible') return { variante: 'exito' as const, texto: 'Disponible' }
  return { variante: 'advertencia' as const, texto: 'Prestado' }
}

const IconoOrden = ({
  activo,
  sentido,
}: {
  activo: boolean
  sentido: 'ascendente' | 'descendente'
}) => {
  if (!activo) return <span className="ml-1 text-gray-300">↕</span>
  return <span className="ml-1 text-gray-500">{sentido === 'ascendente' ? '↑' : '↓'}</span>
}

export const TablaLibros = ({
  libros,
  campoOrden,
  sentidoOrden,
  alCambiarOrden,
}: PropsTablaLibros) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-secondary/60">
          <tr className="border-b border-gray-200">
            <th className="py-3 font-medium">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-secondary"
                onClick={() => alCambiarOrden('titulo')}
              >
                TÍTULO Y AUTOR
                <IconoOrden activo={campoOrden === 'titulo'} sentido={sentidoOrden} />
              </button>
            </th>
            <th className="py-3 font-medium">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-secondary"
                onClick={() => alCambiarOrden('estado')}
              >
                DISPONIBLE
                <IconoOrden activo={campoOrden === 'estado'} sentido={sentidoOrden} />
              </button>
            </th>
            <th className="py-3 font-medium">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-secondary"
                onClick={() => alCambiarOrden('fecha')}
              >
                AGREGADO
                <IconoOrden activo={campoOrden === 'fecha'} sentido={sentidoOrden} />
              </button>
            </th>
            <th className="py-3 text-right pr-4 font-medium">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {libros.map((libro) => {
            const badge = badgePorEstado(libro.estado)
            return (
              <tr key={libro.id} className="border-b border-secondary/10">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-14 rounded-md bg-secondary/10" />
                    <div>
                      <div className="font-semibold text-secondary">{libro.titulo}</div>
                      <div className="text-xs text-secondary/60">{libro.autor}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <Badge variante={badge.variante}>{badge.texto}</Badge>
                </td>
                <td className="py-4 text-secondary/70">{libro.fechaAgregado}</td>
                <td className="py-4">
                  <div className="flex justify-end gap-3 pr-4 text-secondary/70 text-lg">
                    <button type="button" className="hover:text-secondary" aria-label="Editar">
                      ✎
                    </button>
                    <button type="button" className="hover:text-secondary" aria-label="Eliminar">
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

