import { useOutletContext } from 'react-router-dom'
import { useAlIniciar } from '../utils/hooks'
import { libroService } from '../services/libroService'
import type { Libro } from '../models/libroModel'
import { useState } from 'react'
import type { ContextoPerfilUsuario } from '../layouts/PerfilUsuarioLayout'
import { PerfilResumen } from '../components/perfil/PerfilResumen'
import { MisDatosCard } from '../components/perfil/MisDatosCard'
import { StatCard } from '../components/perfil/StatCard'
import { GestionMisLibros } from '../components/perfil/GestionMisLibros'

export const PerfilUsuario = () => {
  const { usuario } = useOutletContext<ContextoPerfilUsuario>()
  const [libros, setLibros] = useState<Libro[]>([])

  const cargarLibros = async () => {
    const response = await libroService.obtenerLibrosDeUsuario(usuario.id)
    setLibros(response)
  }

  useAlIniciar(() => {
    void cargarLibros()
  })

  const cantidadPrestados = libros.filter((l) => l.estado === 'Prestado').length

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <PerfilResumen usuario={usuario} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <MisDatosCard usuario={usuario} />

            <div className="grid grid-cols-2 gap-4">
              <StatCard
                valor={cantidadPrestados}
                etiqueta="Libros Prestados"
                claseFondo="bg-[#fdecec]"
              />
              <StatCard valor={45} etiqueta="Libros Leídos" claseFondo="bg-[#f3e8ff]" />
            </div>
          </div>

          <div className="lg:col-span-8">
            <GestionMisLibros libros={libros} />
          </div>
        </div>
      </div>
    </div>
  )
}

