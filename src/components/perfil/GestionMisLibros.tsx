import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Boton, Card, Tabs } from '../ui'
import type { LibroUsuarioItemDTO } from '../../models/libroModel'
import { TablaLibros } from './TablaLibros'
import { Paginacion } from '../ui/Paginacion'
import { useGestionMisLibros } from '../../utils/misLibros/useGestionMisLibros'
import { pestañasMisLibros } from '../../utils/misLibros/gestionMisLibros'

export type PropsGestionMisLibros = {
  libros: LibroUsuarioItemDTO[]
  onAgregar: () => void
  onEliminar?: (libroId: number) => void | Promise<void>
  cargando?: boolean
  error?: string | null
  onReintentar?: () => void
}


export const GestionMisLibros = ({libros,onAgregar,onEliminar,cargando = false,error = null,onReintentar}: PropsGestionMisLibros) => {
  const {alCambiarFiltro,cambiarOrden,campoOrden,filtro,librosFiltrados,librosPagina,paginaAjustada,rangoEtiqueta,sentidoOrden,setPagina,totalPaginas} = useGestionMisLibros(libros)
  const [animating, setAnimating] = useState(false)

  const solicitarEliminar = (id: number) => {
    if (!onEliminar) return
    const ok = window.confirm(
      '¿Eliminar este libro? Esta acción no se puede deshacer.',
    )
    if (ok) void onEliminar(id)
  }

// Animación para el cambio de filtro
  const handleCambiarFiltro = (id: string) => {
    setAnimating(true)
    setTimeout(() => {
      alCambiarFiltro(id)
      setAnimating(false)
    }, 150)
  }
// Animación para el cambio de página
  const handleCambiarPagina = (nueva: number) => {
    setAnimating(true)
    setTimeout(() => {
      setPagina(nueva)
      setAnimating(false)
    }, 150)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-secondary">
          Gestión de Mis Libros
        </h2>
        <Boton
          tipo="secundario"
          onClick={onAgregar}
          className="bg-rose-100 text-rose-700 hover:bg-rose-200 border border-black/40 px-4 py-2 text-sm rounded-2xl shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Agregar Nuevo Libro
        </Boton>
      </div>

      <Card className="p-0 overflow-hidden rounded-3xl">
        <div className="px-6 pt-6">
          <Tabs
            pestañas={pestañasMisLibros}
            idActivo={filtro}
            alCambiar={handleCambiarFiltro}
          />
        </div>

        <div className="px-6 pb-6 pt-2">
          {cargando ? (
            <div className="py-10 px-2 space-y-5" aria-label="Cargando libros">
              <div className="flex items-center justify-between gap-4">
                <div className="h-6 w-44 bg-secondary/10 rounded animate-pulse" />
                <div className="h-10 w-44 bg-secondary/10 rounded animate-pulse" />
              </div>

              <div className="h-11 bg-secondary/10 rounded animate-pulse" />

              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="h-14 w-10 rounded bg-secondary/10 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-secondary/10 animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-secondary/10 animate-pulse" />
                      <div className="h-3 w-2/3 rounded bg-secondary/10 animate-pulse" />
                    </div>
                    <div className="h-7 w-20 rounded bg-secondary/10 animate-pulse" />
                    <div className="ml-auto flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-secondary/10 animate-pulse" />
                      <div className="h-9 w-9 rounded-full bg-secondary/10 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-300"
              style={{ animationDelay: "40ms" }}
            >
              <div className="text-secondary font-bold text-lg">
                No se pudieron cargar tus libros
              </div>
              <p className="text-secondary/50 text-sm mt-1 max-w-md">
                {error}
              </p>
              {onReintentar && (
                <Boton
                  tipo="secundario"
                  onClick={onReintentar}
                  className="mt-4 px-4 py-2 text-xs"
                >
                  Reintentar
                </Boton>
              )}
            </div>
          ) : (
            <div
              className={`transition-all duration-150 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
            >
              {libros.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    📚
                  </div>
                  <div className="text-secondary font-bold text-lg">
                    Aún no tienes libros
                  </div>
                  <p className="text-secondary/50 text-sm max-w-62.5 mt-1">
                    ¡Comienza agregando tu primer libro a la colección!
                  </p>
                </div>
              ) : librosFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-secondary font-bold text-lg">
                    No se encontraron resultados
                  </div>
                  <p className="text-secondary/50 text-sm mt-1">
                    Prueba cambiando el filtro de búsqueda.
                  </p>
                  <Boton
                    tipo="secundario"
                    onClick={() => handleCambiarFiltro('todos')}
                    className="mt-4 px-4 py-2 text-xs"
                  >
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
                    alEliminar={solicitarEliminar}
                  />

                  <div className="text-xs text-secondary/40 font-medium mt-4">
                    Mostrando {rangoEtiqueta.desde}–{rangoEtiqueta.hasta} de{' '}
                    {rangoEtiqueta.total} libros
                  </div>

                  <Paginacion
                    pagina={paginaAjustada}
                    totalPaginas={totalPaginas}
                    alCambiar={handleCambiarPagina}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
