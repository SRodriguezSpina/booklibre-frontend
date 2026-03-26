import type { LoginData, RegisterData } from "../types/UsuarioTypes"

export type AuthMode = "login" | "register"

export type FieldConfig = {
  name: string
  label: string
  type?: string
  placeholder?: string
  isPassword?: boolean //para generar o no el boton de mostrar
}

export class Auth {
  // Campos Login
  email: string = ""
  password: string = ""

  // Campos Registro
  nombre: string = ""
  confirmarPassword: string = ""

  static loginFields: FieldConfig[] = [
    { name: "email", label: "Email", placeholder: "Tu email" },
    { name: "password", label: "Contraseña", placeholder: "Tu contraseña", isPassword: true },
  ]

  static registerFields: FieldConfig[] = [
    { name: "nombre",   label: "Nombre",   placeholder: "Tu nombre" },
    { name: "email",    label: "Email",    type: "email", placeholder: "tu@email.com" },
    { name: "password", label: "Contraseña", placeholder: "Mínimo 6 caracteres", isPassword: true },
    { name: "confirmarPassword", label: "Repetí tu contraseña", placeholder: "Repetí la contraseña", isPassword: true },
  ]

  validateLogin(): Record<string, string | undefined> {
    return {
      email:  !this.email.trim() ? "El email es obligatorio"    : undefined,
      password: !this.password       ? "La contraseña es obligatoria" : undefined,
    }
  }

  validateRegister(): Record<string, string | undefined> {
    const password = this.password.trim()
    const confirmar = this.confirmarPassword.trim()
    return {
      nombre:   !this.nombre.trim()
        ? "El nombre es obligatorio" : undefined,
      email:    !this.email.trim()
        ? "El email es obligatorio"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
        ? "Ingresá un email válido" : undefined,
      password: !password
        ? "La contraseña es obligatoria"
        : password.length < 6
        ? "Mínimo 6 caracteres" : undefined,
      confirmarPassword: !confirmar
        ? "Repetí tu contraseña"
        : confirmar !== password
        ? "Las contraseñas no coinciden" : undefined,
    }
  }

  validate(mode: AuthMode): Record<string, string | undefined> {
    return mode === "login" ? this.validateLogin() : this.validateRegister()
  }

  toLoginDTO(): LoginData {
    return { email: this.email, password: this.password }
  }

  toRegisterDTO(): RegisterData {
    return {
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      confirmarPassword: this.confirmarPassword,
    }
  }
}