import { Plus } from 'lucide-react'
import { useMemo, useState } from "react"
import { Boton, Card, Tabs, type Pestaña } from "../ui"
import type { LibroUsuarioItemDTO } from "../../models/libroModel"
import { TablaLibros } from "./TablaLibros"
import { Paginacion } from "../ui/Paginacion"

export type PropsGestionMisLibros = {
  libros: LibroUsuarioItemDTO[]
  onAgregar: () => void
  onEliminar?: (libroId: number) => void | Promise<void>
  cargando?: boolean
  error?: string | null
  onReintentar?: () => void
}

type Filtro = "todos" | "disponibles" | "prestados"
type CampoOrden = "titulo" | "estado" | "fecha"

const pestañas: Pestaña[] = [
  { id: "todos", etiqueta: "Todos" },
  { id: "disponibles", etiqueta: "Disponibles" },
  { id: "prestados", etiqueta: "Prestados" },
]

const ESTRATEGIAS_FILTRO: Record<Filtro, (l: LibroUsuarioItemDTO) => boolean> =
  {
    todos: () => true,
    disponibles: (l) => l.disponible,
    prestados: (l) => !l.disponible,
  }

const COMPARADORES_ORDEN: Record<
  CampoOrden,
  (a: LibroUsuarioItemDTO, b: LibroUsuarioItemDTO) => number
> = {
  titulo: (a, b) => a.titulo.localeCompare(b.titulo),
  estado: (a, b) => Number(a.disponible) - Number(b.disponible),
  fecha: (a, b) => {
    const fa = a.fechaAgregado ? new Date(a.fechaAgregado).getTime() : 0
    const fb = b.fechaAgregado ? new Date(b.fechaAgregado).getTime() : 0
    return fa - fb
  },
}

export const GestionMisLibros = ({
  libros,
  onAgregar,
  onEliminar,
  cargando = false,
  error = null,
  onReintentar,
}: PropsGestionMisLibros) => {
  const [filtro, setFiltro] = useState<Filtro>("todos")
  const [pagina, setPagina] = useState(1)
  const [campoOrden, setCampoOrden] = useState<CampoOrden>("titulo")
  const [sentidoOrden, setSentidoOrden] = useState<
    "ascendente" | "descendente"
  >("ascendente")
  const porPagina = 3

  const librosFiltrados = useMemo(
    () => libros.filter(ESTRATEGIAS_FILTRO[filtro]), //Filtramos los libros según el filtro seleccionado
    [libros, filtro],
  )

  const librosOrdenados = useMemo(() => { 
    const comparador = COMPARADORES_ORDEN[campoOrden] 
    return [...librosFiltrados].sort((a, b) => {
      const resultado = comparador(a, b)
      return sentidoOrden === "ascendente" ? resultado : -resultado
    })
  }, [librosFiltrados, campoOrden, sentidoOrden])

  const totalPaginas = Math.max(1,Math.ceil(librosOrdenados.length / porPagina)) // Math.max(1,Math.ceil(librosOrdenados.length / porPagina)) es el número de páginas que se necesitan para mostrar todos los libros
  const paginaAjustada = Math.min(pagina, totalPaginas)
  const inicio = (paginaAjustada - 1) * porPagina
  const fin = inicio + porPagina
  const librosPagina = librosOrdenados.slice(inicio, fin)

  const cambiarOrden = (campo: CampoOrden) => {
    if (campoOrden === campo) {
      setSentidoOrden(sentidoOrden === "ascendente" ? "descendente" : "ascendente") //Si el campo orden es el mismo, invertimos el sentido de orden
    } else {
      setCampoOrden(campo)
      setSentidoOrden("ascendente")
    }
    setPagina(1)
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
            pestañas={pestañas}
            idActivo={filtro}
            alCambiar={(id) => {
              setFiltro(id as Filtro)
              setPagina(1)
            }}
          />
        </div>

        <div className="px-6 pb-6 pt-2">
          {cargando ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-secondary font-bold text-lg">
                Cargando tus libros…
              </div>
              <p className="text-secondary/50 text-sm mt-1">
                Esto puede tardar unos segundos.
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
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
          ) : libros.length === 0 ? (
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
                onClick={() => setFiltro("todos")}
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
                alEliminar={(id) => {
                  if (!onEliminar) return
                  const ok = window.confirm('¿Eliminar este libro? Esta acción no se puede deshacer.')
                  if (ok) void onEliminar(id)
                }}
              />

              <div className="text-xs text-secondary/40 font-medium mt-4">
                Mostrando {inicio + 1}–{Math.min(fin, librosOrdenados.length)} de{" "}
                {librosOrdenados.length} libros
              </div>

              <Paginacion
                pagina={paginaAjustada}
                totalPaginas={totalPaginas}
                alCambiar={(nueva) => setPagina(nueva)}
              />
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
