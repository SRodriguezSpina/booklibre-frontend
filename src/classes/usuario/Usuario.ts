import type { TipoUsuario } from '../../models/usuarioModel'

export type UsuarioData = {
  id: number
  nombre: string
  desc: string
  email: string
  celular: string
  ciudad: string
  tipoUsuario: TipoUsuario
  bibliokarmas: number
  fechaRegistro?: string
}

export type ErrorsUsuario = Partial<Record<keyof UsuarioData, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class Usuario implements UsuarioData {
  id: number = 0
  nombre: string = ''
  desc: string = ''
  email: string = ''
  celular: string = ''
  ciudad: string = ''
  tipoUsuario: TipoUsuario = 'Lector'
  bibliokarmas: number = 0
  fechaRegistro?: string
  errors: ErrorsUsuario = {}

  constructor(props?: Partial<UsuarioData>) {
    if (props) Object.assign(this, props)
  }

  validar(): Usuario {
    const err: ErrorsUsuario = {}
    if (typeof this.nombre !== 'string' || this.nombre.trim().length === 0) {
      err.nombre = 'El nombre es obligatorio'
    }
    if (typeof this.email !== 'string' || this.email.trim().length === 0) {
      err.email = 'El email es obligatorio'
    } else if (!EMAIL_REGEX.test(this.email.trim())) {
      err.email = 'El email no es válido'
    }
    return new Usuario({ ...this, errors: err })
  }

  setCampo<K extends keyof UsuarioData>(
    campo: K,
    valor: UsuarioData[K]
  ): Usuario {
    return new Usuario({ ...this, [campo]: valor, errors: {} })
  }
}
