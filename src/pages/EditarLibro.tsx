import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Calendario } from "../components/ui/Calendario"
import { LibroForm } from "../classes/LibroForm"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService"
import { useOnInit } from "../utils/hooks"
import { toast } from "react-toastify"

type Values = Record<string, string>

const emptyValues = (): Values => ({
  titulo: "",
  autor: "",
  descripcion: "",
  tipo: "",
  genero: "",
  paginas: "",
  isbn: "",
  idioma: "",
  estado: "",
  fechaPublicacion: "",
  propietarioId: "",
  imagenUrl: "",
  editorial: ""
})

const fromValues = (values: Values): LibroForm => {
  const instance = new LibroForm()
  Object.assign(instance, {
    ...values,
    paginas: values.paginas === "" ? "" : Number(values.paginas),
    fechaPublicacion: values.fechaPublicacion ? parseFechaPublicacion(values.fechaPublicacion) : undefined,
  })
  return instance
}

const parseFechaPublicacion = (value: string): Date | null => {
  const parts = value.split("/")
  if (parts.length !== 3) return null

  const [dayStr, monthStr, yearStr] = parts
  const day = Number(dayStr)
  const month = Number(monthStr)
  const year = Number(yearStr)

  if ([day, month, year].some((v) => Number.isNaN(v))) return null
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1 || year > 9999) return null

  const date = new Date(year, month - 1, day)
  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) return null

  return date
}

const fechaToString = (date: Date): string =>
  date.toLocaleDateString('es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const isFechaPublicacionValid = (value: string): boolean => {
  if (value.length <= 10) {
    return true
  }
  
  const parsed = parseFechaPublicacion(value)
  if (!parsed) return false

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return parsed <= hoy
}

const toValues = (form: LibroForm): Values => ({
  titulo: form.titulo,
  autor: form.autor,
  descripcion: form.descripcion,
  tipo: form.tipo,
  genero: form.genero,
  paginas: String(form.paginas),
  isbn: form.isbn,
  idioma: form.idioma,
  estado: form.estado,
  fechaPublicacion: form.fechaPublicacion ? fechaToString(form.fechaPublicacion) : "",
  propietarioId: String(form.propietarioId),
  imagenUrl: form.imagenUrl,
  editorial: form.editorial
})

const MAX_FOTO_BYTES = 800_000

async function archivoADataUrl(file: File): Promise<string> {
  if (file.size > MAX_FOTO_BYTES) {
    throw new Error("La imagen es demasiado grande (máx. ~800 KB).")
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."))
    reader.readAsDataURL(file)
  })
}

export const EditarLibro = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const esNuevo = id === "nuevo"

  const [values, setValues] = useState<Values>(emptyValues())
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(!esNuevo)
  const [previewPortada, setPreviewPortada] = useState<string | null>(null)
  const [fechaPublicacionDate, setFechaPublicacionDate] = useState<Date | undefined>(undefined)
  const [fechaPickerAbierto, setFechaPickerAbierto] = useState(false)
  const inputPortadaRef = useRef<HTMLInputElement>(null)

  const diasNoSeleccionables = useMemo(() => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    return [{ from: hoy, to: new Date(9999, 11, 31) }]
  }, [])

  const [mesCalendario, setMesCalendario] = useState<Date | undefined>(undefined)


  useEffect(() => {
    return () => {
      if (previewPortada) URL.revokeObjectURL(previewPortada)
    }
  }, [previewPortada])

  useEffect(() => {
    if (fechaPickerAbierto) {
      if (fechaPublicacionDate) {
        setMesCalendario(new Date(fechaPublicacionDate.getFullYear(), fechaPublicacionDate.getMonth()))
      } else {
        setMesCalendario(new Date())
      }
    }
  }, [fechaPickerAbierto, fechaPublicacionDate])

  const titulo = esNuevo ? "Nuevo libro" : "Editar libro"

  useOnInit(async () => {
    if (esNuevo) {
      const propietarioId = authService.obtenerIdUsuarioActual()
      setValues((prev) => ({ ...prev, propietarioId: String(propietarioId) }))
      return
    }
    try {
      const libro = await libroService.getLibroById(Number(id))
      const formValues = toValues(LibroForm.fromLibro(libro))
      setValues(formValues)
      if (formValues.fechaPublicacion) {
        const parsed = parseFechaPublicacion(formValues.fechaPublicacion)
        if (parsed) setFechaPublicacionDate(parsed)
      }
    } catch (e) {
      toast.error("No se pudo cargar el libro.")
      navigate("/home")
    } finally {
      setLoading(false)
    }
  })

  const handleChange = (name: string, value: string) => {
    if (name === "fechaPublicacion" && !isFechaPublicacionValid(value)) {
      return
    }

    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerError(null)

    if (name === "fechaPublicacion") {
      if (value.length === 10) {
        const parsed = parseFechaPublicacion(value)
        if (parsed) {
          setFechaPublicacionDate(parsed)
        }
      } else {
        setFechaPublicacionDate(undefined)
      }
    }
  }

  const handleElegirImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !file.type.startsWith("image/")) return
    if (previewPortada) URL.revokeObjectURL(previewPortada)
    setPreviewPortada(URL.createObjectURL(file))
    try {
      const dataUrl = await archivoADataUrl(file)
      handleChange("imagenUrl", dataUrl)
    } catch (err) {
      setPreviewPortada(null)
      setServerError(err instanceof Error ? err.message : "No se pudo leer la imagen.")
    }
  }

  const handleQuitarImagen = (
    fieldName: "imagenUrl",
    setPreview: (url: string | null) => void,
    currentPreview: string | null,
  ) => {
    if (currentPreview) URL.revokeObjectURL(currentPreview)
    setPreview(null)
    handleChange(fieldName, "")
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
        await libroService.crearLibro(
          instance.toDTO(0),
          Number(values.propietarioId),
        )
      } else {
        await libroService.actualizarLibro(instance.toDTO(Number(id)), Number(values.propietarioId))
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

  // Imagenes existentes o nuevas
  const srcPortada = previewPortada || values.imagenUrl || null

  return (
    <div className="flex flex-col bg-background p-6 max-w-xl mx-auto mt-10 pt-24">
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
        <ImagePicker
          label="Portada del libro"
          src={srcPortada}
          shape="rect"
          inputRef={inputPortadaRef as React.RefObject<HTMLInputElement>}
          onElegir={(e) =>
            handleElegirImagen(e)
          }
          onQuitar={() =>
            handleQuitarImagen("imagenUrl", setPreviewPortada, previewPortada)
          }
          deshabilitado={isSubmitting}
        />
        {LibroForm.fields
          .filter((field) => field.name !== "fechaPublicacion")
          .map((field) => (
            <Field
              key={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              error={errors[field.name]}
              onChange={(v) => handleChange(field.name, v)}
            />
          ))}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-secondary-light uppercase tracking-wider">
            Fecha de publicación <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            value={values.fechaPublicacion}
            placeholder="dd/mm/yyyy"
            maxLength={10}
            onFocus={() => setFechaPickerAbierto(true)}
            onChange={(e) => handleChange("fechaPublicacion", e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border bg-background text-secondary-dark text-sm placeholder:text-secondary-light outline-none transition-colors focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.fechaPublicacion ? "border-red-400" : "border-accent"
            }`}
          />
          {errors.fechaPublicacion && <p className="text-xs text-red-500">{errors.fechaPublicacion}</p>}
          {fechaPickerAbierto && (
            <div className="mt-2 rounded-lg border border-accent bg-surface-high p-2">
              <Calendario
                rangeSeleccionado={
                  fechaPublicacionDate
                    ? { from: fechaPublicacionDate, to: fechaPublicacionDate }
                    : undefined
                }
                onSelect={(range) => {
                  if (!range?.from) return
                  const iso = fechaToString(range.from)
                  handleChange("fechaPublicacion", iso)
                  setFechaPublicacionDate(range.from)
                  setFechaPickerAbierto(false)
                }}
                diasDeshabilitados={diasNoSeleccionables}
                mes={mesCalendario}
                onMesCambio={setMesCalendario}
              />
            </div>
          )}
        </div>

        <SelectField
          label="Tipo"
          value={values.tipo}
          error={errors.tipo}
          options={[
            { value: "", label: "Seleccioná una opción" },
            ...LibroForm.tipoOptions,
          ]}
          onChange={(v) => handleChange("tipo", v)}
        />

        <SelectField
          label="Género"
          value={values.genero}
          error={errors.genero}
          options={[
            { value: "", label: "Seleccioná una opción" },
            ...LibroForm.generoOptions,
          ]}
          onChange={(v) => handleChange("genero", v)}
        />

        <SelectField
          label="Idioma"
          value={values.idioma}
          error={errors.idioma}
          options={[
            { value: "", label: "Seleccioná una opción" },
            ...LibroForm.idiomaOptions,
          ]}
          onChange={(v) => handleChange("idioma", v)}
        />

        <SelectField
          label="Estado"
          value={values.estado}
          error={errors.estado}
          options={[
            { value: "", label: "Seleccioná una opción" },
            ...LibroForm.estadoOptions,
          ]}
          onChange={(v) => handleChange("estado", v)}
        />

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
            {serverError}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Guardando..."
              : esNuevo
                ? "Crear libro"
                : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 bg-surface border border-accent text-secondary-dark rounded-lg text-sm font-bold hover:bg-accent transition-all"
          >
            Descartar cambios
          </button>
        </div>
      </form>
    </div>
  )
}

/* ---------- Sub-components ---------- */

interface ImagePickerProps {
  label: string
  src: string | null
  shape: "circle" | "rect"
  inputRef: React.RefObject<HTMLInputElement>
  onElegir: (e: React.ChangeEvent<HTMLInputElement>) => void
  onQuitar: () => void
  deshabilitado: boolean
}

const ImagePicker = ({
  label,
  src,
  inputRef,
  onElegir,
  onQuitar,
  deshabilitado,
}: ImagePickerProps) => {

  const placeholderClass = "w-20 h-28 rounded-lg bg-surface-high border border-accent flex items-center justify-center text-secondary/30 text-2xl shrink-0"
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-secondary-light uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-4">
        {src ? (
          <img src={src} alt={label} className={`${placeholderClass} shrink-0`} />
        ) : (
          <div className={placeholderClass}>
            📖
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onElegir}
          />
          <button
            type="button"
            disabled={deshabilitado}
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg border border-accent bg-surface text-secondary-dark text-xs font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Elegir imagen
          </button>
          {src && (
            <button
              type="button"
              onClick={onQuitar}
              className="text-xs font-semibold text-secondary/50 hover:text-danger transition-colors text-left"
            >
              Quitar
            </button>
          )}
          <p className="text-[10px] text-secondary/40">
            Solo desde tu dispositivo. Máx. ~800 KB.
          </p>
        </div>
      </div>
    </div>
  )
}
// @@END-IMAGE-FIELDS

interface FieldProps {
  label: string
  type?: string
  placeholder?: string
  value: string
  error?: string
  disabled?: boolean
  onChange: (value: string) => void
}

const Field = ({
  label,
  type = "text",
  placeholder,
  value,
  error,
  disabled,
  onChange,
}: FieldProps) => (
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

const SelectField = ({
  label,
  value,
  error,
  disabled,
  options,
  onChange,
}: SelectFieldProps) => (
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