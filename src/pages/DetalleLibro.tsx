import { useState } from "react"
import { useParams } from "react-router-dom"
import { useOnInit } from "../utils/hooks"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService"
import { usuarioService } from "../services/usuarioService"
import { Libro } from "../classes/Libro"
import { ReseniasLibro } from "../components/detalleLibros/ReseniasLibro"
import { ReservaCard } from "../components/detalleLibros/ReservaCard"
import { InfoLibro } from "../components/detalleLibros/InfoLibro"
import { Card } from "../components/ui/Card"

export const DetalleLibro = () => {
  const { id } = useParams()
  const [libro, setLibro] = useState<Libro>()
  const [loading, setLoading] = useState(true)
  const [fechaDesde, setFechaDesde] = useState<string>("")
  const [fechaHasta, setFechaHasta] = useState<string>("")
  
  const [bibliokarmasUsuario, setBibliokarmasUsuario] = useState<number>(0)
  const usuarioId = authService.obtenerIdUsuarioActual() 
  const fetchDatos = async () => {
    try {
      if (id && usuarioId) {  
        const [dataLibro, dataUsuario] = await Promise.all([
          libroService.getLibroById(Number(id)),
          usuarioService.obtenerUsuario(usuarioId)
        ])
        
        setLibro(dataLibro)
        setBibliokarmasUsuario(dataUsuario.bibliokarmas)  
      }
    } catch (error) {
      console.error("Error fetching datos", error)
    } finally {
      setLoading(false)
    }
  }
  useOnInit(() => { fetchDatos() })

  let karmaCalculado = 0
  if (libro && fechaDesde && fechaHasta && fechaHasta >= fechaDesde) {
    karmaCalculado = libro.calcularBibliokarma(fechaDesde, fechaHasta, bibliokarmasUsuario)
  }

  if (loading) return <div className="p-10 text-center text-primary">Cargando...</div>
  if (!libro) return <div className="p-10 text-center text-red-500">Libro no encontrado</div>

  return (
    <main className="min-h-screen bg-background p-6 md:p-10 text-secondary-dark">
      <section className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pt-20">

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <Card className="p-4 flex justify-center">
            <img src={libro.imagenUrl} alt={libro.titulo} className="w-full max-w-[280px] rounded-md shadow-md object-cover" />
          </Card>

          {usuarioId && (
            <ReservaCard
              libro={libro}
              usuarioId={usuarioId}
              onReservaExitosa={fetchDatos} 
              fechaDesde={fechaDesde}
              setFechaDesde={setFechaDesde}
              fechaHasta={fechaHasta}
              setFechaHasta={setFechaHasta}
            />
          )}
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          <InfoLibro libro={libro} karmaCalculado={karmaCalculado} />

          <ReseniasLibro
            libroId={Number(id)}
            calificaciones={libro.ultimasCalificaciones}
            totalCalificaciones={libro.cantidadCalificaciones}
          />
        </div>

      </section>
    </main>
  )
}