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
  // Login fields
  usuario: string = ""
  password: string = ""

  // Register-only fields
  nombre: string = ""
  email: string = ""
  confirmarPassword: string = ""

  static loginFields: FieldConfig[] = [
    { name: "usuario", label: "Usuario", placeholder: "Tu nombre de usuario" },
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
      usuario:  !this.usuario.trim() ? "El usuario es obligatorio"    : undefined,
      password: !this.password       ? "La contraseña es obligatoria" : undefined,
    }
  }

  validateRegister(): Record<string, string | undefined> {
    return {
      nombre:   !this.nombre.trim()
        ? "El nombre es obligatorio" : undefined,
      email:    !this.email.trim()
        ? "El email es obligatorio"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
        ? "Ingresá un email válido" : undefined,
      password: !this.password
        ? "La contraseña es obligatoria"
        : this.password.length < 6
        ? "Mínimo 6 caracteres" : undefined,
      confirmarPassword: !this.confirmarPassword.trim()
        ? "Repetí tu contraseña"
        : this.confirmarPassword.trim() !== this.password.trim()
        ? "Las contraseñas no coinciden" : undefined,
    }
  }

  validate(mode: AuthMode): Record<string, string | undefined> {
    return mode === "login" ? this.validateLogin() : this.validateRegister()
  }

  toLoginDTO(): LoginData {
    return { usuario: this.usuario, password: this.password }
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