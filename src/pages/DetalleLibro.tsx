import { useState } from "react"
import { useParams } from "react-router-dom"
import { useOnInit } from "../utils/hooks"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService" // ¡Faltaba importar esto!
import { Libro } from "../classes/Libro"

export const DetalleLibro = () => {
  const { id } = useParams()
  const [libro, setLibro] = useState<Libro>()
  const [loading, setLoading] = useState(true)

  useOnInit(() => {
    const fetchLibro = async () => {
      try {
        if (id) {
          const usuarioId = authService.obtenerIdUsuarioActual() || 1
          const data = await libroService.getLibroById(Number(id), usuarioId)
          console.log(data)
          setLibro(data)
          console.log(usuarioId)
        }
      } catch (error) {
        console.error("Error fetching libro", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLibro()
  })

  if (loading)
    return <div className="p-10 text-center text-primary">Cargando...</div>
  if (!libro)
    return (
      <div className="p-10 text-center text-red-500">Libro no encontrado</div>
    )

  return (
    <main className="min-h-screen bg-background p-6 md:p-10 text-secondary-dark">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* COLUMNA IZQUIERDA (Imagen y Reserva) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* Portada */}
          <div className="bg-surface p-4 rounded-2xl shadow-sm flex justify-center">
            <img
              src={
                libro.imagenUrl ||
                "https://m.media-amazon.com/images/I/81af+MCATTL.jpg"
              }
              alt={libro.titulo}
              className="w-full max-w-70 rounded-md shadow-md object-cover"
            />
          </div>

          {/* Tarjeta de Reserva */}
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-accent/30">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              Tu Reserva
            </h3>

            <div className="mb-4">
              <label className="text-xs font-bold text-secondary uppercase opacity-70 mb-2 block">
                Fechas Seleccionadas:
              </label>
              <div className="bg-background rounded-md p-3 text-sm border border-accent flex items-center">
                <span>24 Oct - 07 Nov, 2023</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-secondary opacity-80">Recogida</span>
              <span className="font-bold">24 Oct, 2023</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-secondary opacity-80">Devolución</span>
              <span className="font-bold">07 Nov, 2023</span>
            </div>

            <div className="flex justify-between items-center text-sm mb-6 bg-blue-50 p-3 rounded-lg text-blue-600 font-medium">
              <span>Duración</span>
              <span>14 Días</span>
            </div>

            <button className="w-full bg-[#fc8b83] text-white font-bold py-3 rounded-xl transition-colors shadow-sm">
              Confirmar Reserva
            </button>
            <p className="text-xs text-center text-secondary opacity-60 mt-3 px-4">
              Con la reserva no se encontrará disponible en el rango de fechas
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA (Detalles e Info) */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* Header del libro */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {libro.genero || "CIENCIA FICCIÓN"}
              </span>
              <div className="flex text-yellow-400 text-sm">
                ★★★★★{" "}
                <span className="text-secondary opacity-60 ml-1">
                  ({/*libro.ranking ||*/})
                </span>
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-secondary-dark mb-4">
              {libro.titulo}
            </h1>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=11" alt="Autor" />
              </div>
              <div>
                <p className="text-xs text-secondary font-bold uppercase opacity-70">
                  Autor
                </p>
                <p className="font-semibold">{libro.autor}</p>
              </div>
            </div>
          </div>

          {/* Sinopsis */}
          <div>
            <h3 className="font-bold text-xl mb-3">Sinopsis</h3>
            <p className="text-secondary leading-relaxed mb-4">
              {libro.descripcion}
            </p>
          </div>

          {/* Tarjeta de Detalles */}
          <div className="bg-surface rounded-2xl shadow-sm border border-accent/30 p-6 md:p-8">
            <h3 className="font-bold text-xl mb-6">Detalles del Libro</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
              {/* Fila 1 */}
              <div className="col-span-2 md:col-span-3">
                <p className="text-xs text-secondary font-bold uppercase opacity-70 mb-1">
                  Tipo
                </p>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                  {libro.tipo}
                </span>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-xs text-secondary font-bold uppercase opacity-70 mb-1">
                  Bibliokarmas
                </p>
                <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-md">
                  +{libro.bibliokarma}
                </span>
              </div>

              {/* Fila 2 */}
              <div>
                <p className="text-xs text-secondary font-bold uppercase opacity-70 mb-1">
                  Género
                </p>
                <p className="font-semibold">{libro.genero}</p>
              </div>
              <div>
                <p className="text-xs text-secondary font-bold uppercase opacity-70 mb-1">
                  Páginas
                </p>
                <p className="font-semibold">{libro.paginas}</p>
              </div>
              <div>
                <p className="text-xs text-secondary font-bold uppercase opacity-70 mb-1">
                  Idioma
                </p>
                <p className="font-semibold">{libro.idioma}</p>
              </div>
              <div>
                <p className="text-xs text-secondary font-bold uppercase opacity-70 mb-1">
                  Editorial
                </p>
                <p className="font-semibold">{libro.editorial}</p>
              </div>

              {/* Fila 3 */}
              <div>
                <p className="text-xs text-secondary font-bold uppercase opacity-70 mb-1">
                  ISBN-13
                </p>
                <p className="font-semibold">{libro.isbn}</p>
              </div>
              <div>
                <p className="text-xs text-secondary font-bold uppercase opacity-70 mb-1">
                  Publicado
                </p>
                <p className="font-semibold">{libro.fechaPublicacion}</p>
              </div>
              <div>
                <p className="text-xs text-secondary font-bold uppercase opacity-70 mb-1">
                  Estado
                </p>
                <p className="font-semibold text-blue-500">{libro.estado}</p>
              </div>
              <div>
                <p className="text-xs text-secondary font-bold uppercase opacity-70 mb-1">
                  Ranking
                </p>
                <p className="font-semibold">{/*libro.ranking ||*/}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
