import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authService } from "../services/AuthService"
import navBarLogo from "../assets/icons/booklibre-logo.svg"
import type { RegisterData } from "../types/UsuarioTypes"

type FormErrors = Partial<Record<keyof RegisterData, string>>

const validate = (values: RegisterData): FormErrors => {
  const errs: FormErrors = {}
  if (!values.nombre.trim()) errs.nombre = "El nombre es obligatorio"
  if (!values.email.trim()) errs.email = "El email es obligatorio"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errs.email = "Ingresá un email válido"
  if (!values.usuario.trim()) errs.usuario = "El usuario es obligatorio"
  if (!values.ciudad.trim()) errs.ciudad = "La ciudad es obligatoria"
  if (!values.celular.trim()) errs.celular = "El celular es obligatorio"
  else if (!/^\d+$/.test(values.celular))
    errs.celular = "Ingresá solo números"
  if (!values.password) errs.password = "La contraseña es obligatoria"
  else if (values.password.length < 6) errs.password = "Mínimo 6 caracteres"
  if (!values.confirmarPassword) errs.confirmarPassword = "Repetí tu contraseña"
  else if (values.password !== values.confirmarPassword)
    errs.confirmarPassword = "Las contraseñas no coinciden"
  return errs
}

export const Register = () => {
  const navigate = useNavigate()

  const [values, setValues] = useState<RegisterData>({
    nombre: "",
    email: "",
    usuario: "",
    ciudad: "",
    celular: "",
    password: "",
    confirmarPassword: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)

  const handleChange = (field: keyof RegisterData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setErrorGeneral(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(values)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setIsLoading(true)
    try {
      await authService.registro(values)
      navigate("/login")
    } catch (error) {
      setErrorGeneral(authService.manejarError(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-surface rounded-2xl shadow-md border border-accent p-8">

        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <img src={navBarLogo} alt="BookLibre" className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-dark">Crear cuenta</h1>
          <p className="text-sm text-secondary opacity-70 text-center">
            Completá tus datos para unirte a BookLibre
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

          {/* Nombre + Usuario */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Nombre"
              value={values.nombre}
              onChange={handleChange("nombre")}
              placeholder="Tu nombre"
              error={errors.nombre}
            />
            <Field
              label="Usuario"
              value={values.usuario}
              onChange={handleChange("usuario")}
              placeholder="Nombre de usuario"
              error={errors.usuario}
            />
          </div>

          {/* Email */}
          <Field
            label="Email"
            type="email"
            value={values.email}
            onChange={handleChange("email")}
            placeholder="tu@email.com"
            error={errors.email}
          />

          {/* Ciudad + Celular */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Ciudad"
              value={values.ciudad}
              onChange={handleChange("ciudad")}
              placeholder="Tu ciudad"
              error={errors.ciudad}
            />
            <Field
              label="Celular"
              type="tel"
              value={values.celular}
              onChange={handleChange("celular")}
              placeholder="Ej: 1123456789"
              error={errors.celular}
            />
          </div>

          {/* Password */}
          <PasswordField
            label="Contraseña"
            value={values.password}
            onChange={handleChange("password")}
            placeholder="Mínimo 6 caracteres"
            error={errors.password}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />

          {/* Confirmar password */}
          <PasswordField
            label="Repetí tu contraseña"
            value={values.confirmarPassword}
            onChange={handleChange("confirmarPassword")}
            placeholder="Repetí la contraseña"
            error={errors.confirmarPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
          />

          {errorGeneral && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
              {errorGeneral}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark active:bg-accent transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="text-center text-sm text-secondary opacity-80">
            ¿Ya tenés una cuenta?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

/* ---------- Sub-components ---------- */

interface FieldProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  type?: string
}

const Field = ({ label, value, onChange, placeholder, error, type = "text" }: FieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-secondary-light uppercase tracking-wider">
      {label} <span className="text-primary">*</span>
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-lg border bg-background text-secondary-dark text-sm placeholder:text-secondary-light outline-none transition-colors focus:border-primary ${
        error ? "border-red-400" : "border-accent"
      }`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

interface PasswordFieldProps extends Omit<FieldProps, "type"> {
  show: boolean
  onToggle: () => void
}

const PasswordField = ({ label, value, onChange, placeholder, error, show, onToggle }: PasswordFieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-secondary-light uppercase tracking-wider">
      {label} <span className="text-primary">*</span>
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 pr-10 rounded-lg border bg-background text-secondary-dark text-sm placeholder:text-secondary-light outline-none transition-colors focus:border-primary ${
          error ? "border-red-400" : "border-accent"
        }`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-light hover:text-secondary transition-colors text-xs font-medium"
      >
        {show ? "Ocultar" : "Ver"}
      </button>
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)