import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Auth } from "../classes/Auth"
import type { AuthMode, FieldConfig } from "../classes/Auth"
import { authService } from "../services/AuthService"
import navBarLogo from "../assets/icons/booklibre-logo.svg"

const config = {
  login: {
    title: "Iniciar sesión",
    subtitle: "Ingresá a tu cuenta para gestionar tus préstamos",
    submitLabel: "Iniciar sesión",
    submittingLabel: "Ingresando...",
    fields: Auth.loginFields,
    footer: (
      <p className="text-center text-sm text-secondary opacity-80">
        ¿No tenés una cuenta?{" "}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Registrate
        </Link>
      </p>
    ),
  },
  register: {
    title: "Crear cuenta",
    subtitle: "Completá tus datos para unirte a BookLibre",
    submitLabel: "Registrarse",
    submittingLabel: "Registrando...",
    fields: Auth.registerFields,
    footer: (
      <p className="text-center text-sm text-secondary opacity-80">
        ¿Ya tenés una cuenta?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Iniciá sesión
        </Link>
      </p>
    ),
  },
}

interface AuthPageProps {
  mode: AuthMode
}

export const AuthPage = ({ mode }: AuthPageProps) => {
  const model = new Auth()
  const navigate = useNavigate()
  const { title, subtitle, submitLabel, submittingLabel, fields, footer } = config[mode]

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  )
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    Object.assign(model, values)

    const newErrors = model.validate(mode)
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      if (mode === "login") {
        await authService.login(model.toLoginDTO())
        navigate("/home")
      } else {
        await authService.registro(model.toRegisterDTO())
        navigate("/login")
      }
    } catch (error) {
      setServerError(authService.manejarError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-md border border-accent p-8">

        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
            <img src={navBarLogo} alt="BookLibre" className="w-11 h-11" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-dark">{title}</h1>
          <p className="text-sm text-secondary opacity-70 text-center">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={values[field.name] ?? ""}
              error={errors[field.name]}
              onChange={(value) => handleChange(field.name, value)}
            />
          ))}

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark active:bg-accent transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </button>

          {footer}
        </form>
      </div>
    </div>
  )
}

/* ---------- Sub-component ---------- */

interface FormFieldProps {
  field: FieldConfig
  value: string
  error?: string
  onChange: (value: string) => void
}

const FormField = ({ field, value, error, onChange }: FormFieldProps) => {
  const [show, setShow] = useState(false)

  const inputClass = `w-full px-4 py-2.5 rounded-lg border bg-background text-secondary-dark text-sm placeholder:text-secondary-light outline-none transition-colors focus:border-primary ${
    error ? "border-red-400" : "border-accent"
  }`

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-secondary-light uppercase tracking-wider">
        {field.label} <span className="text-primary">*</span>
      </label>

      {field.isPassword ? (
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} pr-16`}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-light hover:text-secondary transition-colors text-xs font-medium"
          >
            {show ? "Ocultar" : "Ver"}
          </button>
        </div>
      ) : (
        <input
          type={field.type ?? "text"}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}