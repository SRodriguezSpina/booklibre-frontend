import { AxiosError } from 'axios'

export type ErrorPersonalizado = {
  estado?: number
  mensaje: string
}

export const obtenerMensajeError = (error: unknown): ErrorPersonalizado => {
  let mensaje = 'Ocurrió un error. Consulte al administrador del sistema'
  let estado = 0

  if (error instanceof AxiosError) {
    estado = error.response?.status ?? error.status ?? 0
    const data = error.response?.data as
      | { message?: string; error?: string }
      | undefined

    const mensajeBackend = data?.message || data?.error

    if (estado >= 400 && estado < 500) {
      mensaje = mensajeBackend ?? 'No se pudo completar la operación.'
    } else {
      mensaje = 'Ocurrió un error al conectarse al backend. Intente nuevamente más tarde'
    }

    // Solo fallback si NO vino mensaje del backend
    if (estado === 400 && !mensajeBackend) {
      mensaje = 'Solicitud inválida'
    }
  } else if (error instanceof Error) {
    mensaje = error.message
  }

  return { estado, mensaje }
}