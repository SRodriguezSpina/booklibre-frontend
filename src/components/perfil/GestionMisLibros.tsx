import { useState } from "react"
import { Plus } from "lucide-react"
import { Tabs } from "../ui"
import type { LibroUsuarioItemDTO } from "../../models/libroModel"
import { TablaLibros } from "./TablaLibros"
import { Paginacion } from "../ui/Paginacion"
import { useGestionMisLibros } from "../../utils/misLibros/useGestionMisLibros"
import { pestañasMisLibros } from "../../utils/misLibros/gestionMisLibros"

export type PropsGestionMisLibros = {
  libros: LibroUsuarioItemDTO[]
  onAgregar: () => void
  onEliminar?: (libroId: number) => void | Promise<void>
  cargando?: boolean
  error?: string | null
  onReintentar?: () => void
}

export const GestionMisLibros = ({
  libros,
  onAgregar,
  onEliminar,
  cargando = false,
  error = null,
  onReintentar,
}: PropsGestionMisLibros) => {
  const {
    alCambiarFiltro,
    cambiarOrden,
    campoOrden,
    filtro,
    librosFiltrados,
    librosPagina,
    paginaAjustada,
    rangoEtiqueta,
    sentidoOrden,
    setPagina,
    totalPaginas,
  } = useGestionMisLibros(libros)
  const [animating, setAnimating] = useState(false)

  const solicitarEliminar = (id: number) => {
    if (!onEliminar) return
    const ok = window.confirm(
      "¿Eliminar este libro? Esta acción no se puede deshacer.",
    )
    if (ok) void onEliminar(id)
  }

  const handleCambiarFiltro = (id: string) => {
    setAnimating(true)
    setTimeout(() => {
      alCambiarFiltro(id)
      setAnimating(false)
    }, 150)
  }

  const handleCambiarPagina = (nueva: number) => {
    setAnimating(true)
    setTimeout(() => {
      setPagina(nueva)
      setAnimating(false)
    }, 150)
  }

  const handleCambiarOrden = (campo: typeof campoOrden) => {
    setAnimating(true)
    setTimeout(() => {
      cambiarOrden(campo)
      setAnimating(false)
    }, 150)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-on-surface">
          Gestión de Mis Libros
        </h2>
        <button
          onClick={onAgregar}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-primary/30 text-primary-light hover:bg-primary/10 rounded transition-all"
        >
          <Plus className="h-4 w-4" />
          Agregar Libro
        </button>
      </div>

      <div className="bg-surface rounded border border-accent/15 shadow-[0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden">
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
                <div className="h-6 w-44 bg-surface-high rounded animate-pulse" />
                <div className="h-10 w-44 bg-surface-high rounded animate-pulse" />
              </div>
              <div className="h-11 bg-surface-high rounded animate-pulse" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="h-14 w-10 rounded bg-surface-high animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-surface-high animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-surface-high animate-pulse" />
                    </div>
                    <div className="h-7 w-20 rounded bg-surface-high animate-pulse" />
                    <div className="ml-auto flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-surface-high animate-pulse" />
                      <div className="h-9 w-9 rounded-full bg-surface-high animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-on-surface font-bold text-lg">
                No se pudieron cargar tus libros
              </div>
              <p className="text-on-surface-variant/50 text-sm mt-1 max-w-md">
                {error}
              </p>
              {onReintentar && (
                <button
                  onClick={onReintentar}
                  className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-accent/20 text-on-surface-variant hover:text-on-surface rounded transition-all"
                >
                  Reintentar
                </button>
              )}
            </div>
          ) : libros.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-surface-high rounded flex items-center justify-center mb-4 text-2xl">
                📚
              </div>
              <div className="text-on-surface font-bold text-lg">
                Aún no tenés libros
              </div>
              <p className="text-on-surface-variant/50 text-sm mt-1">
                ¡Agregá tu primer libro a la colección!
              </p>
            </div>
          ) : librosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-on-surface font-bold text-lg">
                No se encontraron resultados
              </div>
              <p className="text-on-surface-variant/50 text-sm mt-1">
                Probá cambiando el filtro.
              </p>
              <button
                onClick={() => handleCambiarFiltro("todos")}
                className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-accent/20 text-on-surface-variant hover:text-on-surface rounded transition-all"
              >
                Ver todos
              </button>
            </div>
          ) : (
            <>
              {/* Solo la tabla anima */}
              <div
                className={`transition-all duration-150 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
              >
                <div className="min-h-[21rem]">
                  <TablaLibros
                    libros={librosPagina}
                    campoOrden={campoOrden}
                    sentidoOrden={sentidoOrden}
                    alCambiarOrden={handleCambiarOrden}
                    alEliminar={solicitarEliminar}
                  />
                </div>
              </div>

              {/* Paginación fuera de la animación para no parpadear */}
              <div className="text-xs text-on-surface-variant/40 font-medium mt-4">
                Mostrando {rangoEtiqueta.desde}–{rangoEtiqueta.hasta} de{" "}
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
      </div>
    </div>
  )
}
