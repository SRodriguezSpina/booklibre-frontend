import { useMemo, useState } from 'react'
import { Boton, Card, Tabs, type Pestaña } from '../ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Libro } from '../../models/libroModel'
import { TablaLibros } from './TablaLibros'

export type PropsGestionMisLibros = {
  libros: Libro[]
  onAgregar: () => void
}

type Filtro = 'todos' | 'disponibles' | 'prestados'
type CampoOrden = 'titulo' | 'estado' | 'fecha'

const pestañas: Pestaña[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'disponibles', etiqueta: 'Disponibles' },
  { id: 'prestados', etiqueta: 'Prestados' },
]

const ESTRATEGIAS_FILTRO: Record<Filtro, (l: Libro) => boolean> = {
  todos: () => true,
  disponibles: (l) => l.estado === 'Disponible',
  prestados: (l) => l.estado === 'Prestado',
}

const COMPARADORES_ORDEN: Record<CampoOrden, (a: Libro, b: Libro) => number> = {
  titulo: (a, b) => a.titulo.localeCompare(b.titulo),
  estado: (a, b) => a.estado.localeCompare(b.estado),
  fecha: (a, b) => new Date(a.fechaAgregado).getTime() - new Date(b.fechaAgregado).getTime(),
}

export const GestionMisLibros = ({ libros, onAgregar }: PropsGestionMisLibros) => {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [pagina, setPagina] = useState(1)
  const [campoOrden, setCampoOrden] = useState<CampoOrden>('titulo')
  const [sentidoOrden, setSentidoOrden] = useState<'ascendente' | 'descendente'>('ascendente')
  const porPagina = 3

  const librosFiltrados = useMemo(() => libros.filter(ESTRATEGIAS_FILTRO[filtro]), [libros, filtro])

  const librosOrdenados = useMemo(() => {
    const comparador = COMPARADORES_ORDEN[campoOrden]
    return [...librosFiltrados].sort((a, b) => {
      const resultado = comparador(a, b)
      return sentidoOrden === 'ascendente' ? resultado : -resultado
    })
  }, [librosFiltrados, campoOrden, sentidoOrden])

  const totalPaginas = Math.max(1, Math.ceil(librosOrdenados.length / porPagina))
  const paginaAjustada = Math.min(pagina, totalPaginas)
  const inicio = (paginaAjustada - 1) * porPagina
  const fin = inicio + porPagina
  const librosPagina = librosOrdenados.slice(inicio, fin)

  const cambiarOrden = (campo: CampoOrden) => {
    if (campoOrden === campo) {
      setSentidoOrden(sentidoOrden === 'ascendente' ? 'descendente' : 'ascendente')
    } else {
      setCampoOrden(campo)
      setSentidoOrden('ascendente')
    }
    setPagina(1)
  }

  return (
    <Card className="p-0 overflow-hidden rounded-3xl">
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-secondary">Gestión de Mis Libros</h2>
        <Boton
          tipo="secundario"
          alClic={onAgregar}
          className="px-5 py-2 text-sm rounded-full shadow-sm"
        >
          + Agregar nuevo libro
        </Boton>
      </div>

      <div className="px-6">
        <Tabs
          pestañas={pestañas}
          idActivo={filtro}
          alCambiar={(id) => {
            setFiltro(id as Filtro)
            setPagina(1)
          }}
        />
      </div>

      <div className="px-6 pb-6 pt-2">
        {libros.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              📚
            </div>
            <div className="text-secondary font-bold text-lg">Aún no tienes libros</div>
            <p className="text-secondary/50 text-sm max-w-[250px] mt-1">
              ¡Comienza agregando tu primer libro a la colección!
            </p>
          </div>
        ) : librosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-secondary font-bold text-lg">No se encontraron resultados</div>
            <p className="text-secondary/50 text-sm mt-1">
              Prueba cambiando el filtro de búsqueda.
            </p>
            <Boton tipo="secundario" alClic={() => setFiltro('todos')} className="mt-4 px-4 py-2 text-xs">
              Ver todos los libros
            </Boton>
          </div>
        ) : (
          <>
            <TablaLibros
              libros={librosPagina}
              campoOrden={campoOrden}
              sentidoOrden={sentidoOrden}
              alCambiarOrden={cambiarOrden}
            />

            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-secondary/40 font-medium">
                Mostrando {inicio + 1}–{Math.min(fin, librosOrdenados.length)} de {librosOrdenados.length} libros
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPagina(paginaAjustada - 1)}
                  disabled={paginaAjustada <= 1}
                  className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-20 disabled:hover:bg-transparent transition-colors text-secondary"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPagina(paginaAjustada + 1)}
                  disabled={paginaAjustada >= totalPaginas}
                  className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-20 disabled:hover:bg-transparent transition-colors text-secondary"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
