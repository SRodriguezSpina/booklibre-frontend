import { useState } from "react"
import { useParams } from "react-router-dom"
import { useOnInit } from "../utils/hooks"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService"
import { Libro } from "../classes/Libro"

import { ReservaCard } from "../components/detalleLibros/ReservaCard"
import { InfoLibro } from "../components/detalleLibros/InfoLibro"
import { Card } from "../components/ui"

export const DetalleLibro = () => {
  const { id} = useParams()
  const [libro, setLibro] = useState<Libro>()
  const [loading, setLoading] = useState(true)
  const usuarioId = authService.obtenerIdUsuarioActual() || 1

  const fetchLibro = async () => {
    try {
      if (id) {
        const data = await libroService.getLibroById(Number(id))
        console.log("Libro obtenido:", data)
        setLibro(data)
      }
    } catch (error) {
      console.error("Error fetching libro", error)
    } finally {
      setLoading(false)
    }
  }

  useOnInit(() => {
    fetchLibro()
  })

  if (loading) return <div className="p-10 text-center text-primary">Cargando...</div>
  if (!libro) return <div className="p-10 text-center text-red-500">Libro no encontrado</div>

  return (
    <main className="min-h-screen bg-background p-6 md:p-10 text-secondary-dark">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <Card className="p-4 flex justify-center">
            <img 
              src={libro.imagenUrl || "https://m.media-amazon.com/images/I/81af+MCATTL.jpg"} 
              alt={libro.titulo} 
              className="w-full max-w-[280px] rounded-md shadow-md object-cover"
            />
          </Card>

          <ReservaCard 
            libroId={libro.id} 
            usuarioId={usuarioId} 
            onReservaExitosa={fetchLibro} 
            estaOcupadoHoy={libro.estoyReservado}
          />
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          <InfoLibro libro={libro} />
        </div>
        
      </div>
    </main>
  )
}
