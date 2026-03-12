import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { LibroForm } from "../classes/LibroForm"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService"
import { useOnInit } from "../utils/hooks"

type Values = Record<string, string>

const emptyValues = (): Values => ({
  titulo: "", autor: "", descripcion: "", tipo: "", genero: "",
  paginas: "", isbn: "", idioma: "", estado: "", fechaPublicacion: "",
  propietarioId: "",
})

const fromValues = (values: Values): LibroForm => {
  const instance = new LibroForm()
  Object.assign(instance, {
    ...values,
    paginas: values.paginas === "" ? "" : Number(values.paginas),
    isbn:    values.isbn    === "" ? "" : Number(values.isbn),
  })
  return instance
}

const toValues = (form: LibroForm): Values => ({
  titulo:           form.titulo,
  autor:            form.autor,
  descripcion:      form.descripcion,
  tipo:             form.tipo,
  genero:           form.genero,
  paginas:          String(form.paginas),
  isbn:             String(form.isbn),
  idioma:           form.idioma,
  estado:           form.estado,
  fechaPublicacion: form.fechaPublicacion,
  propietarioId:    String(form.propietarioId),
})

export const EditarLibro = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const esNuevo = id === "nuevo"

  const [values, setValues] = useState<Values>(emptyValues())
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const [loading, setLoading] = useState(!esNuevo)

  const titulo = readOnly ? "Detalle del libro" : esNuevo ? "Nuevo libro" : "Editar libro"

  useOnInit(async () => {
    if (esNuevo) {
      const propietarioId = authService.obtenerIdUsuarioActual() ?? 0
      setValues((prev) => ({ ...prev, propietarioId: String(propietarioId) }))
      return
    }
    try {
      const libro = await libroService.getLibroById(Number(id))
      setValues(toValues(LibroForm.fromLibro(libro)))
      const params = new URLSearchParams(window.location.search)
      setReadOnly(params.get("readOnly") === "true")
    } catch {
      navigate("/home")
    } finally {
      setLoading(false)
    }
  })

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const instance = fromValues(values)
    const newErrors = instance.validate()
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors)
      return
    }
    setIsSubmitting(true)
    try {
      if (esNuevo) {
        await libroService.crearLibro(instance.toDTO(0))
      } else {
        await libroService.actualizarLibro(instance.toDTO(Number(id)))
      }
      navigate("/home")
    } catch {
      setServerError("No se pudo guardar el libro. Intentá de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20 italic text-primary font-medium">
        Cargando...
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-background p-6 max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-secondary-dark mb-1">{titulo}</h1>
      <p className="text-sm text-secondary opacity-70 mb-6">
        {esNuevo
          ? "Completá los datos para agregar un libro."
          : "Modificá los campos que desees actualizar."}
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-accent rounded-2xl p-6 flex flex-col gap-5"
        noValidate
      >
        {/* Text / number / date fields */}
        {LibroForm.fields.map((field) => (
          <Field
            key={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            value={values[field.name] ?? ""}
            error={errors[field.name]}
            disabled={readOnly}
            onChange={(v) => handleChange(field.name, v)}
          />
        ))}

        {/* Select fields */}
        <SelectField
          label="Tipo"
          value={values.tipo}
          error={errors.tipo}
          disabled={readOnly}
          options={[{ value: "", label: "Seleccioná una opción" }, ...LibroForm.tipoOptions]}
          onChange={(v) => handleChange("tipo", v)}
        />

        <SelectField
          label="Género"
          value={values.genero}
          error={errors.genero}
          disabled={readOnly}
          options={[{ value: "", label: "Seleccioná una opción" }, ...LibroForm.generoOptions]}
          onChange={(v) => handleChange("genero", v)}
        />

        <SelectField
          label="Idioma"
          value={values.idioma}
          error={errors.idioma}
          disabled={readOnly}
          options={[{ value: "", label: "Seleccioná una opción" }, ...LibroForm.idiomaOptions]}
          onChange={(v) => handleChange("idioma", v)}
        />

        <SelectField
          label="Estado"
          value={values.estado}
          error={errors.estado}
          disabled={readOnly}
          options={[{ value: "", label: "Seleccioná una opción" }, ...LibroForm.estadoOptions]}
          onChange={(v) => handleChange("estado", v)}
        />

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
            {serverError}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {!readOnly && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Guardando..." : esNuevo ? "Crear libro" : "Guardar cambios"}
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 bg-surface border border-accent text-secondary-dark rounded-lg text-sm font-bold hover:bg-accent transition-all"
          >
            {readOnly ? "Volver" : "Descartar cambios"}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ---------- Sub-components ---------- */

interface FieldProps {
  label: string
  type?: string
  placeholder?: string
  value: string
  error?: string
  disabled?: boolean
  onChange: (value: string) => void
}

const Field = ({ label, type = "text", placeholder, value, error, disabled, onChange }: FieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-secondary-light uppercase tracking-wider">
      {label} <span className="text-primary">*</span>
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-lg border bg-background text-secondary-dark text-sm placeholder:text-secondary-light outline-none transition-colors focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${
        error ? "border-red-400" : "border-accent"
      }`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

interface SelectFieldProps {
  label: string
  value: string
  error?: string
  disabled?: boolean
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

const SelectField = ({ label, value, error, disabled, options, onChange }: SelectFieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-secondary-light uppercase tracking-wider">
      {label} <span className="text-primary">*</span>
    </label>
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-lg border bg-background text-secondary-dark text-sm outline-none transition-colors focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${
        error ? "border-red-400" : "border-accent"
      }`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)