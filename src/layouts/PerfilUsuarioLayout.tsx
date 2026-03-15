import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Spinner, ErrorCard, type ErrorPersonalizado } from "../components/ui"
import type { Usuario } from "../models/usuarioModel"
import { useAlIniciar } from "../utils/hooks"
import { obtenerMensajeError } from "../utils/errorHandler"
import { usuarioService } from "../services/usuarioService"
// import { authService } from '../services/AuthService'

export type ContextoPerfilUsuario = {
  usuario: Usuario
  setUsuario: (usuario: Usuario) => void
}

export const PerfilUsuarioLayout = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<ErrorPersonalizado | null>(null)

  const cargarUsuario = async () => {
    // const id = authService.obtenerIdUsuarioActual()
    // if (id == null) {
    //   setError({ mensaje: 'Debés iniciar sesión para ver tu perfil.' })
    //   setCargando(false)
    //   return
    // }
    const id = 1
    //POR AHORA ESTA HARDCODEADO PARA QUE FUNCIONE EL TESTING

    try {
      const response = await usuarioService.obtenerUsuario(id)
      setUsuario(response)
    } catch (e: unknown) {
      setError(obtenerMensajeError(e))
    } finally {
      setCargando(false)
    }
  }

  useAlIniciar(cargarUsuario) //Custom hook que hace el efecto únicamente al montar el componente

  if (cargando) return <Spinner />
  if (error) return <ErrorCard error={error} alReintentar={cargarUsuario} />
  if (usuario == null) return null

  const setUsuarioActualizado = (u: Usuario) => setUsuario(u)

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] px-4 py-8 md:px-8">
      <Outlet
        context={
          {
            usuario,
            setUsuario: setUsuarioActualizado,
          } satisfies ContextoPerfilUsuario
        }
      />
    </div>
  )
}
