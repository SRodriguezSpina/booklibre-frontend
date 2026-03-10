import { useMemo, useState } from 'react'
import { Boton, Card, Tabs, type Pestaña } from '../ui'
import type { Libro } from '../../models/libroModel'
import { TablaLibros } from './TablaLibros'
import { Paginacion } from './Paginacion'

export type PropsGestionMisLibros = {
  libros: Libro[]
}

type Filtro = 'todos' | 'disponibles' | 'prestados'
type CampoOrden = 'titulo' | 'estado' | 'fecha'

const pestañas: Pestaña[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'disponibles', etiqueta: 'Disponibles' },
  { id: 'prestados', etiqueta: 'Prestados' },
]

const filtrarLibros = (libros: Libro[], filtro: Filtro) => {
  if (filtro === 'disponibles') return libros.filter((l) => l.estado === 'Disponible')
  if (filtro === 'prestados') return libros.filter((l) => l.estado === 'Prestado')
  return libros
}

export const GestionMisLibros = ({ libros }: PropsGestionMisLibros) => {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [pagina, setPagina] = useState(1)
  const [campoOrden, setCampoOrden] = useState<CampoOrden>('titulo')
  const [sentidoOrden, setSentidoOrden] = useState<'ascendente' | 'descendente'>('ascendente')
  const porPagina = 3

  const librosFiltrados = useMemo(() => filtrarLibros(libros, filtro), [libros, filtro])

  const librosOrdenados = useMemo(() => {
    const copia = [...librosFiltrados]

    copia.sort((a, b) => {
      let resultado = 0
      if (campoOrden === 'titulo') {
        resultado = a.titulo.localeCompare(b.titulo)
      } else if (campoOrden === 'estado') {
        resultado = a.estado.localeCompare(b.estado)
      } else if (campoOrden === 'fecha') {
        resultado = new Date(a.fechaAgregado).getTime() - new Date(b.fechaAgregado).getTime()
      }

      return sentidoOrden === 'ascendente' ? resultado : -resultado
    })

    return copia
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
          alClic={() => {}}
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

      <div className="px-6 pt-4">
        <TablaLibros
          libros={librosPagina}
          campoOrden={campoOrden}
          sentidoOrden={sentidoOrden}
          alCambiarOrden={cambiarOrden}
        />
        <div className="text-xs text-secondary/60 mt-2">
          Mostrando {librosOrdenados.length === 0 ? 0 : inicio + 1}–
          {Math.min(fin, librosOrdenados.length)} de {librosOrdenados.length} libros
        </div>
        <Paginacion
          pagina={paginaAjustada}
          totalPaginas={totalPaginas}
          alCambiar={(nueva) => setPagina(nueva)}
        />
      </div>
    </Card>
  )
}

