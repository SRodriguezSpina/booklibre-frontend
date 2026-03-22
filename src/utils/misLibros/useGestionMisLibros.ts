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
  type SentidoOrden,
} from './gestionMisLibros'

/** Estado de filtro, orden, paginación y listas derivadas para la gestión de libros del perfil. */
export function useGestionMisLibros(libros: LibroUsuarioItemDTO[]) {
  const [filtro, setFiltro] = useState<FiltroMisLibros>('todos')
  const [pagina, setPagina] = useState(1)
  const [campoOrden, setCampoOrden] = useState<CampoOrdenMisLibros>('titulo')
  const [sentidoOrden, setSentidoOrden] = useState<SentidoOrden>('ascendente')

  const librosFiltrados = useMemo(
    () => filtrarMisLibros(libros, filtro),
    [libros, filtro],
  )

  const librosOrdenados = useMemo(
    () => ordenarMisLibros(librosFiltrados, campoOrden, sentidoOrden),
    [librosFiltrados, campoOrden, sentidoOrden],
  )

  const { totalPaginas, paginaAjustada, inicio, fin, librosPagina } = useMemo(
    () => paginarMisLibros(librosOrdenados, pagina, POR_PAGINA_MIS_LIBROS),
    [librosOrdenados, pagina],
  )

  const rangoEtiqueta = useMemo(
    () => rangoEtiquetaPaginacion(inicio, fin, librosOrdenados.length),
    [inicio, fin, librosOrdenados.length],
  )

  const cambiarOrden = useCallback((campo: CampoOrdenMisLibros) => {
    const { campo: c, sentido: s } = siguienteSentidoOrden(
      campoOrden,
      sentidoOrden,
      campo,
    )
    setCampoOrden(c)
    setSentidoOrden(s)
    setPagina(1)
  }, [campoOrden, sentidoOrden])

  const alCambiarFiltro = useCallback((id: string) => {
    setFiltro(id as FiltroMisLibros)
    setPagina(1)
  }, [])

  return {
    filtro,
    pagina,
    setPagina,
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
