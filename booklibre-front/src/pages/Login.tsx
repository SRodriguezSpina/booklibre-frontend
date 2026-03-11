import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authService } from "../services/AuthService"
import navBarLogo from "../assets/icons/booklibre-logo.svg"
import type { LoginData } from "../types/UsuarioTypes"

type FormErrors = Partial<Record<keyof LoginData, string>>

const validate = (values: LoginData): FormErrors => {
  const errs: FormErrors = {}
  if (!values.usuario.trim()) errs.usuario = "El usuario es obligatorio"
  if (!values.password) errs.password = "La contraseña es obligatoria"
  return errs
}

export const Login = () => {
  const navigate = useNavigate()

  const [values, setValues] = useState<LoginData>({ usuario: "", password: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)

  const handleChange = (field: keyof LoginData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await authService.login(values)
      navigate("/home")
    } catch (error) {
      setErrorGeneral(authService.manejarError(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-md border border-accent p-8">

        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <img src={navBarLogo} alt="BookLibre" className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-dark">Iniciar sesión</h1>
          <p className="text-sm text-secondary opacity-70 text-center">
            Ingresá a tu cuenta para gestionar tus préstamos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

          <Field
            label="Usuario"
            value={values.usuario}
            onChange={handleChange("usuario")}
            placeholder="Tu nombre de usuario"
            error={errors.usuario}
          />

          <PasswordField
            label="Contraseña"
            value={values.password}
            onChange={handleChange("password")}
            placeholder="Tu contraseña"
            error={errors.password}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
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
            {isLoading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          <p className="text-center text-sm text-secondary opacity-80">
            ¿No tenés una cuenta?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Registrate
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