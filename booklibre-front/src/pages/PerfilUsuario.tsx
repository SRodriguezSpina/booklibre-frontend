import { useOutletContext } from 'react-router-dom'
import { useAlIniciar } from '../utils/hooks'
import { libroService } from '../services/libroService'
import type { Libro } from '../models/libroModel'
import type { Usuario } from '../models/usuarioModel'
import { useEffect, useState } from 'react'
import type { ContextoPerfilUsuario } from '../layouts/PerfilUsuarioLayout'
import { PerfilResumen } from '../components/perfil/PerfilResumen'
import { MisDatosCard } from '../components/perfil/MisDatosCard'
import { EstadisticaCard } from '../components/perfil/EstadisticaCard'
import { GestionMisLibros } from '../components/perfil/GestionMisLibros'

export const PerfilUsuario = () => {
  const { usuario, setUsuario } = useOutletContext<ContextoPerfilUsuario>()
  const [libros, setLibros] = useState<Libro[]>([])
  const [editando, setEditando] = useState(false)
  const [borradorUsuario, setBorradorUsuario] = useState<Usuario>(usuario)

  const cargarLibros = async () => {
    const response = await libroService.obtenerLibrosDeUsuario(usuario.id)
    setLibros(response)
  }

  useAlIniciar(() => {
    void cargarLibros()
  })

  useEffect(() => {
    if (!editando) {
      setBorradorUsuario(usuario)
    }
  }, [usuario, editando])

  const comenzarEdicion = () => {
    setBorradorUsuario(usuario)
    setEditando(true)
  }

  const cancelarEdicion = () => {
    setBorradorUsuario(usuario)
    setEditando(false)
  }

  const guardarEdicion = () => {
    setUsuario(borradorUsuario)
    setEditando(false)
  }

  const cantidadPrestados = libros.filter((l) => l.estado === 'Prestado').length

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <PerfilResumen
          usuario={borradorUsuario}
          editando={editando}
          onEditar={comenzarEdicion}
          onCancelar={cancelarEdicion}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <MisDatosCard
              usuario={borradorUsuario}
              editando={editando}
              onCambioUsuario={setBorradorUsuario}
              onGuardar={guardarEdicion}
              onCancelar={cancelarEdicion}
            />

            <div className="grid grid-cols-2 gap-4">
              <EstadisticaCard
                valor={cantidadPrestados}
                etiqueta="Libros Prestados"
                claseFondo="bg-[#fdecec]"
              />
              <EstadisticaCard valor={45} etiqueta="Libros Leídos" claseFondo="bg-[#f3e8ff]" />
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

