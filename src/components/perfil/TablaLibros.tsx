import { Badge } from '../ui'
import { Pencil, Trash2 } from 'lucide-react'
import type { LibroUsuarioItemDTO } from '../../models/libroModel'
import { useNavigate } from 'react-router-dom'
import { TablaLibrosIconoOrden } from './TablaLibrosIconoOrden'
import {badgeDisponibilidad,formatearFechaAgregadoLibro,rutaEditarLibro} from '../../utils/misLibros/tablaLibros'
import type {CampoOrdenMisLibros,SentidoOrden} from '../../utils/misLibros/gestionMisLibros'

export type PropsTablaLibros = {
  libros: LibroUsuarioItemDTO[]
  campoOrden: CampoOrdenMisLibros
  sentidoOrden: SentidoOrden
  alCambiarOrden: (campo: CampoOrdenMisLibros) => void
  alEliminar: (libroId: number) => void
}

export const TablaLibros = ({libros,campoOrden,sentidoOrden,alCambiarOrden,alEliminar}: PropsTablaLibros) => {
  const navigate = useNavigate()

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
                <TablaLibrosIconoOrden
                  activo={campoOrden === 'titulo'}
                  sentido={sentidoOrden}
                />
              </button>
            </th>
            <th className="py-4 font-semibold">
              <button
                type="button"
                className="inline-flex items-center hover:text-secondary transition-colors"
                onClick={() => alCambiarOrden('estado')}
              >
                Disponible
                <TablaLibrosIconoOrden
                  activo={campoOrden === 'estado'}
                  sentido={sentidoOrden}
                />
              </button>
            </th>
            <th className="py-4 font-semibold">
              <button
                type="button"
                className="inline-flex items-center hover:text-secondary transition-colors"
                onClick={() => alCambiarOrden('fecha')}
              >
                Agregado
                <TablaLibrosIconoOrden
                  activo={campoOrden === 'fecha'}
                  sentido={sentidoOrden}
                />
              </button>
            </th>
            <th className="py-4 text-right pr-4 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {libros.map((libro) => {
            const { variante, texto } = badgeDisponibilidad(libro.disponible)
            return (
              <tr
                key={libro.id}
                className="group hover:bg-accent/5 transition-all duration-150 cursor-default"
              >
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    {libro.imagenUrl ? (
                      <img
                        src={libro.imagenUrl}
                        alt={`Portada de ${libro.titulo}`}
                        className="w-10 h-14 rounded-md object-cover border border-secondary/10 shrink-0 transition-transform duration-150 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-14 rounded-md bg-secondary/5 flex items-center justify-center text-[10px] text-secondary/30 border border-secondary/10 shrink-0">
                        📖
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-secondary text-base">
                        {libro.titulo}
                      </div>
                      <div className="text-xs text-secondary/50 font-medium">
                        {libro.autor}
                      </div>
                      <div className="text-xs text-secondary/40 font-medium">
                        {libro.genero}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <Badge variante={variante}>{texto}</Badge>
                </td>
                <td className="py-4 text-secondary/60 font-medium">
                  {formatearFechaAgregadoLibro(libro.fechaAgregado)}
                </td>
                <td className="py-4">
                  <div className="flex justify-end gap-2 pr-4 text-secondary/40">
                    <button
                      onClick={() => navigate(rutaEditarLibro(libro.id))}
                      type="button"
                      className="p-2 hover:bg-white hover:text-secondary hover:shadow-md rounded-full transition-all"
                      aria-label="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={!libro.disponible}
                      title={
                        libro.disponible
                          ? 'Eliminar libro'
                          : 'No se puede eliminar un libro prestado'
                      }
                      className="p-2 rounded-full transition-all hover:bg-white hover:shadow-md disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none disabled:cursor-not-allowed hover:text-red-500"
                      aria-label="Eliminar"
                      onClick={() => alEliminar(libro.id)}
                    >
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
