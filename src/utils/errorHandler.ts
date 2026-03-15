import { AxiosError } from 'axios'

export type ErrorPersonalizado = {
  estado?: number
  mensaje: string
}

export const obtenerMensajeError = (error: unknown): ErrorPersonalizado => {
  let mensaje = 'Ocurrió un error. Consulte al administrador del sistema'
  let estado = 0

  if (error instanceof Error) {
    mensaje = error.message
  }

  if (error instanceof AxiosError) {
    estado = error.response?.status ?? error.status ?? 0
    const mensajeBackend = (error.response?.data as { message?: string } | undefined)?.message

    if (estado >= 400 && estado < 500 && mensajeBackend) {
      mensaje = mensajeBackend
    } else {
      mensaje = 'Ocurrió un error al conectarse al backend. Intente nuevamente más tarde'
    }

    if (estado === 400) {
      mensaje = 'El ID del recurso que estás buscando es erróneo'
    }
  }

  return { estado, mensaje }
}

