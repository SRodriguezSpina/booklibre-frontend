import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { LibroUsuarioItemDTO } from '../../models/libroModel'
import { libroService, type LibrosUsuarioPaginaResponse } from '../../services/libroService'
import {
  POR_PAGINA_MIS_LIBROS,
  siguienteSentidoOrden,
  rangoEtiquetaPaginacion,
  type CampoOrdenMisLibros,
  type FiltroMisLibros,
  type OpcionPorPagina,
  type SentidoOrden,
} from './gestionMisLibros'

type EstadoCargaLibros = {
  cargando: boolean
  error: string | null
}

/** Estado de filtro, orden y paginación server-side para la gestión de libros del perfil. */
export function useGestionMisLibros(usuarioId: number | null, habilitado: boolean) {
  const [filtro, setFiltro] = useState<FiltroMisLibros>('todos')
  const [pagina, setPagina] = useState(1)
  const [campoOrden, setCampoOrden] = useState<CampoOrdenMisLibros>('titulo')
  const [sentidoOrden, setSentidoOrden] = useState<SentidoOrden>('ascendente')
  const [porPagina, setPorPaginaInterna] = useState<OpcionPorPagina>(POR_PAGINA_MIS_LIBROS)

  const [librosPagina, setLibrosPagina] = useState<LibroUsuarioItemDTO[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [estado, setEstado] = useState<EstadoCargaLibros>({ cargando: false, error: null })

  const requestIdRef = useRef(0)

  const fetchPagina = useCallback(async () => {
    if (!habilitado || usuarioId == null) {
      setLibrosPagina([])
      setTotalElements(0)
      setTotalPaginas(1)
      setEstado({ cargando: false, error: null })
      return
    }
    const requestId = ++requestIdRef.current
    setEstado({ cargando: true, error: null })
    try {
      const res: LibrosUsuarioPaginaResponse = await libroService.obtenerLibrosUsuarioPerfil(usuarioId, {
        page: pagina - 1,
        size: porPagina,
        filtro,
        ordenarPor: campoOrden,
        direccion: sentidoOrden,
      })
      if (requestId !== requestIdRef.current) return
      setLibrosPagina(res.content)
      setTotalElements(res.totalElements)
      setTotalPaginas(Math.max(1, res.totalPages))
      setEstado({ cargando: false, error: null })
    } catch (e: unknown) {
      if (requestId !== requestIdRef.current) return
      const mensaje = e instanceof Error ? e.message : 'No se pudieron cargar tus libros.'
      setLibrosPagina([])
      setTotalElements(0)
      setTotalPaginas(1)
      setEstado({ cargando: false, error: mensaje })
    }
  }, [usuarioId, habilitado, pagina, porPagina, filtro, campoOrden, sentidoOrden])

  useEffect(() => {
    void fetchPagina()
  }, [fetchPagina])

  const inicio = (pagina - 1) * porPagina
  const fin = inicio + librosPagina.length
  const rangoEtiqueta = useMemo(
    () => rangoEtiquetaPaginacion(inicio, fin, totalElements),
    [inicio, fin, totalElements],
  )

  const paginaAjustada = Math.min(pagina, totalPaginas)

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

  const recargar = useCallback(() => {
    void fetchPagina()
  }, [fetchPagina])

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
    librosPagina,
    totalPaginas,
    paginaAjustada,
    rangoEtiqueta,
    totalElements,
    cargando: estado.cargando,
    error: estado.error,
    recargar,
  }
}
