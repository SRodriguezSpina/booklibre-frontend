import { useState } from "react"
import { useParams } from "react-router-dom"
import { useOnInit } from "../utils/hooks"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService" // ¡Faltaba importar esto!
import { Libro } from "../classes/Libro"

import { TarjetaReserva } from "../components/detalleLibros/ReservaCard"
import { InfoLibro } from "../components/detalleLibros/InfoLibro"
import { Card } from "../components/ui"

export const DetalleLibro = () => {
  const { id } = useParams()
  const [libro, setLibro] = useState<Libro>()
  const [loading, setLoading] = useState(true)

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

  useOnInit(() => {
    fetchLibro()
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <span className="text-secondary font-medium">Cargando libro...</span>
      </div>
    )
  }

  if (!libro) return <div className="p-10 text-center text-red-500">Libro no encontrado</div>

  return (
    <main className="min-h-screen bg-background p-6 md:p-10 text-secondary-dark flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <Card className="p-4 flex justify-center">
            <img 
              src={libro.imagenUrl || "https://m.media-amazon.com/images/I/81af+MCATTL.jpg"} 
              alt={libro.titulo} 
              className="w-full max-w-[280px] rounded-md shadow-md object-cover"
            />
          </Card>

          <TarjetaReserva />
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          <InfoLibro libro={libro} />
        </div>
    </main>
  )
}
