import { Badge } from '../ui'
import { Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { Libro } from '../../models/libroModel'

export type PropsTablaLibros = {
  libros: Libro[]
  campoOrden: 'titulo' | 'estado' | 'fecha'
  sentidoOrden: 'ascendente' | 'descendente'
  alCambiarOrden: (campo: 'titulo' | 'estado' | 'fecha') => void
}

const CONFIG_ESTADOS: Record<Libro['estado'], { variante: 'exito' | 'advertencia'; texto: string }> = {
  Disponible: { variante: 'exito', texto: 'Disponible' },
  Prestado: { variante: 'advertencia', texto: 'Prestado' },
}

const IconoOrden = ({ activo, sentido }: { activo: boolean; sentido: 'ascendente' | 'descendente' }) => {
  if (!activo) return <ChevronsUpDown className="ml-1 w-3 h-3 text-gray-300" />
  return sentido === 'ascendente'
    ? <ChevronUp className="ml-1 w-3 h-3 text-secondary" />
    : <ChevronDown className="ml-1 w-3 h-3 text-secondary" />
}

export const TablaLibros = ({ libros, campoOrden, sentidoOrden, alCambiarOrden }: PropsTablaLibros) => {

  // Formateador de fecha simple (ej: 05 Ago, 2023)
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).replace('.', '')
  }

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
                Estado
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
            const { variante, texto } = CONFIG_ESTADOS[libro.estado]
            return (
              <tr key={libro.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    {libro.portadaUrl ? (
                      <img src={libro.portadaUrl} alt={libro.titulo} className="w-10 h-14 rounded-md object-cover shadow-sm" />
                    ) : (
                      <div className="w-10 h-14 rounded-md bg-secondary/5 flex items-center justify-center text-[10px] text-secondary/30 border border-secondary/10">
                        No image
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-secondary text-base">{libro.titulo}</div>
                      <div className="text-xs text-secondary/50 font-medium">{libro.autor}</div>
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

