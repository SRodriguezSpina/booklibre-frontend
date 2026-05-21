import { useCallback, useMemo, useState } from 'react'
import type { LibroUsuarioItemDTO } from '../../models/libroModel'
import {
  filtrarMisLibros,
  ordenarMisLibros,
  paginarMisLibros,
  rangoEtiquetaPaginacion,
  siguienteSentidoOrden,
  POR_PAGINA_MIS_LIBROS,
  type CampoOrdenMisLibros,
  type FiltroMisLibros,
  type OpcionPorPagina,
  type SentidoOrden,
} from './gestionMisLibros'

/** Estado de filtro, orden, paginación y listas derivadas para la gestión de libros del perfil. */
export function useGestionMisLibros(libros: LibroUsuarioItemDTO[]) {
  const [filtro, setFiltro] = useState<FiltroMisLibros>('todos')
  const [pagina, setPagina] = useState(1)
  const [campoOrden, setCampoOrden] = useState<CampoOrdenMisLibros>('titulo')
  const [sentidoOrden, setSentidoOrden] = useState<SentidoOrden>('ascendente')
  const [porPagina, setPorPaginaInterna] = useState<OpcionPorPagina>(POR_PAGINA_MIS_LIBROS)

  const librosFiltrados = useMemo(() => filtrarMisLibros(libros, filtro), [libros, filtro])

  const librosOrdenados = useMemo(() =>
    ordenarMisLibros(librosFiltrados, campoOrden, sentidoOrden), [librosFiltrados, campoOrden, sentidoOrden])

  const { totalPaginas, paginaAjustada, inicio, fin, librosPagina } = useMemo(() =>
    paginarMisLibros(librosOrdenados, pagina, porPagina), [librosOrdenados, pagina, porPagina])

  const rangoEtiqueta = useMemo(() =>
    rangoEtiquetaPaginacion(inicio, fin, librosOrdenados.length), [inicio, fin, librosOrdenados.length])

  const cambiarOrden = useCallback((campo: CampoOrdenMisLibros) => {
    const { campo: c, sentido: s } = siguienteSentidoOrden(campoOrden, sentidoOrden, campo)
    setCampoOrden(c)
    setSentidoOrden(s)
    setPagina(1)
  }, [campoOrden, sentidoOrden])

  const alCambiarFiltro = useCallback((id: string) => {
    setFiltro(id as FiltroMisLibros)
    setPagina(1)
  }, [])

  const setPorPagina = useCallback((valor: OpcionPorPagina) => {
    setPorPaginaInterna(valor)
    setPagina(1)
  }, [])

  return {
    filtro,
    pagina,
    setPagina,
    porPagina,
    setPorPagina,
    campoOrden,
    sentidoOrden,
    cambiarOrden,
    alCambiarFiltro,
    librosFiltrados,
    librosPagina,
    totalPaginas,
    paginaAjustada,
    rangoEtiqueta,
  }
}
