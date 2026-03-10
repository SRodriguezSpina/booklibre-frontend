import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Spinner, ErrorCard, type ErrorPersonalizado } from '../components/ui'
import type { Usuario } from '../models/usuarioModel'
import { usuarioMock } from '../mocks/usuarioMock'
import { useAlIniciar } from '../utils/hooks'
import { obtenerMensajeError } from '../utils/errorHandler'
import { usuarioService } from '../services/usuarioService'

export type ContextoPerfilUsuario = {
  usuario: Usuario
  setUsuario: React.Dispatch<React.SetStateAction<Usuario>>
}

export const PerfilUsuarioLayout = () => {
  const [usuario, setUsuario] = useState<Usuario>(usuarioMock)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<ErrorPersonalizado | null>(null)

  const cargarUsuario = async () => {
    try {
      const response = await usuarioService.obtenerUsuario(1) // hardcodeado por ahora
      setUsuario(response)
    } catch (e: unknown) {
      setError(obtenerMensajeError(e))
    } finally {
      setCargando(false)
    }
  }

  useAlIniciar(cargarUsuario)

  if (cargando) return <Spinner />
  if (error) return <ErrorCard error={error} alReintentar={() => window.location.reload()} />

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] px-4 py-8 md:px-8">
      <Outlet context={{ usuario, setUsuario } satisfies ContextoPerfilUsuario} />
    </div>
  )
}
