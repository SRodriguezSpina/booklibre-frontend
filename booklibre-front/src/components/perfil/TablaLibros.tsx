import { Badge } from '../ui'
import { Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { LibroUsuarioItemDTO } from '../../models/libroModel'

export type PropsTablaLibros = {
  libros: LibroUsuarioItemDTO[]
  campoOrden: 'titulo' | 'estado' | 'fecha'
  sentidoOrden: 'ascendente' | 'descendente'
  alCambiarOrden: (campo: 'titulo' | 'estado' | 'fecha') => void
}

const getBadge = (disponible: boolean) =>
  disponible
    ? { variante: 'exito' as const, texto: 'Disponible' }
    : { variante: 'advertencia' as const, texto: 'Prestado' }

const IconoOrden = ({ activo, sentido }: { activo: boolean; sentido: 'ascendente' | 'descendente' }) => {
  if (!activo) return <ChevronsUpDown className="ml-1 w-3 h-3 text-gray-300" />
  return sentido === 'ascendente'
    ? <ChevronUp className="ml-1 w-3 h-3 text-secondary" />
    : <ChevronDown className="ml-1 w-3 h-3 text-secondary" />
}

const formatearFecha = (fechaStr: string | null) => {
  if (!fechaStr) return '—'
  return new Date(fechaStr)
    .toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace('.', '')
}

export const TablaLibros = ({ libros, campoOrden, sentidoOrden, alCambiarOrden }: PropsTablaLibros) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-secondary/60 uppercase tracking-wider">
          <tr className="border-b border-gray-100">
            <th className="py-4 font-semibold">
              <button
                type="button"
                className="inline-flex items-center hover:text-secondary transition-colors"
                onClick={() => alCambiarOrden('titulo')}
              >
                Título y Autor
                <IconoOrden activo={campoOrden === 'titulo'} sentido={sentidoOrden} />
              </button>
            </th>
            <th className="py-4 font-semibold">
              <button
                type="button"
                className="inline-flex items-center hover:text-secondary transition-colors"
                onClick={() => alCambiarOrden('estado')}
              >
                Disponible
                <IconoOrden activo={campoOrden === 'estado'} sentido={sentidoOrden} />
              </button>
            </th>
            <th className="py-4 font-semibold">
              <button
                type="button"
                className="inline-flex items-center hover:text-secondary transition-colors"
                onClick={() => alCambiarOrden('fecha')}
              >
                Agregado
                <IconoOrden activo={campoOrden === 'fecha'} sentido={sentidoOrden} />
              </button>
            </th>
            <th className="py-4 text-right pr-4 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {libros.map((libro) => {
            const { variante, texto } = getBadge(libro.disponible)
            return (
              <tr key={libro.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-14 rounded-md bg-secondary/5 flex items-center justify-center text-[10px] text-secondary/30 border border-secondary/10 shrink-0">
                      📖
                    </div>
                    <div>
                      <div className="font-bold text-secondary text-base">{libro.titulo}</div>
                      <div className="text-xs text-secondary/50 font-medium">{libro.autor}</div>
                      <div className="text-xs text-secondary/40 font-medium">{libro.genero}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <Badge variante={variante}>{texto}</Badge>
                </td>
                <td className="py-4 text-secondary/60 font-medium">
                  {formatearFecha(libro.fechaAgregado)}
                </td>
                <td className="py-4">
                  <div className="flex justify-end gap-2 pr-4 text-secondary/40">
                    <button type="button" className="p-2 hover:bg-white hover:text-secondary hover:shadow-md rounded-full transition-all" aria-label="Editar">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-white hover:text-red-500 hover:shadow-md rounded-full transition-all" aria-label="Eliminar">
                      <Trash2 className="w-4 h-4" />
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
