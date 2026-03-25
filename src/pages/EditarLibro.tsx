import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { LibroForm } from "../classes/LibroForm"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService"
import { useOnInit } from "../utils/hooks"

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
  editorial: "",
  autorImg: ""
})

const fromValues = (values: Values): LibroForm => {
  const instance = new LibroForm()
  Object.assign(instance, {
    ...values,
    paginas: values.paginas === "" ? "" : Number(values.paginas),
  })
  return instance
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
  fechaPublicacion: form.fechaPublicacion,
  propietarioId: String(form.propietarioId),
  imagenUrl: form.imagenUrl,
  editorial: form.editorial,
  autorImg: form.autorImg
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
  const [previewAutor, setPreviewAutor] = useState<string | null>(null)
  const inputPortadaRef = useRef<HTMLInputElement>(null)
  const inputAutorRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (previewPortada) URL.revokeObjectURL(previewPortada)
      if (previewAutor) URL.revokeObjectURL(previewAutor)
    }
  }, [previewPortada, previewAutor])

  const titulo = esNuevo ? "Nuevo libro" : "Editar libro"

  useOnInit(async () => {
    if (esNuevo) {
      const propietarioId = authService.obtenerIdUsuarioActual()
      setValues((prev) => ({ ...prev, propietarioId: String(propietarioId) }))
      return
    }
    try {
      const libro = await libroService.getLibroById(Number(id))
      setValues(toValues(LibroForm.fromLibro(libro)))
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

  const handleElegirImagen = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "imagenUrl" | "autorImg",
    setPreview: (url: string | null) => void,
    currentPreview: string | null,
  ) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !file.type.startsWith("image/")) return

    if (currentPreview) URL.revokeObjectURL(currentPreview)
    setPreview(URL.createObjectURL(file))

    try {
      const dataUrl = await archivoADataUrl(file)
      handleChange(fieldName, dataUrl)
    } catch (err) {
      setPreview(null)
      setServerError(err instanceof Error ? err.message : "No se pudo leer la imagen.")
    }
  }

  const handleQuitarImagen = (
    fieldName: "imagenUrl" | "autorImg",
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

  // Imagenes existentes o nuevas
  const srcPortada = previewPortada || values.imagenUrl || null
  const srcAutor = previewAutor || values.autorImg || null

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
          label="Foto del autor"
          src={srcAutor}
          shape="circle"
          inputRef={inputAutorRef as React.RefObject<HTMLInputElement>}
          onElegir={(e) =>
            handleElegirImagen(e, "autorImg", setPreviewAutor, previewAutor)
          }
          onQuitar={() =>
            handleQuitarImagen("autorImg", setPreviewAutor, previewAutor)
          }
          deshabilitado={isSubmitting}
        />

        <ImagePicker
          label="Portada del libro"
          src={srcPortada}
          shape="rect"
          inputRef={inputPortadaRef as React.RefObject<HTMLInputElement>}
          onElegir={(e) =>
            handleElegirImagen(e, "imagenUrl", setPreviewPortada, previewPortada)
          }
          onQuitar={() =>
            handleQuitarImagen("imagenUrl", setPreviewPortada, previewPortada)
          }
          deshabilitado={isSubmitting}
        />
        {LibroForm.fields.map((field) => (
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
  shape,
  inputRef,
  onElegir,
  onQuitar,
  deshabilitado,
}: ImagePickerProps) => {
  const previewClass =
    shape === "circle"
      ? "w-20 h-20 rounded-full object-cover border border-accent bg-surface-high"
      : "w-20 h-28 rounded-lg object-cover border border-accent bg-surface-high"

  const placeholderClass =
    shape === "circle"
      ? "w-20 h-20 rounded-full bg-surface-high border border-accent flex items-center justify-center text-secondary/30 text-2xl shrink-0"
      : "w-20 h-28 rounded-lg bg-surface-high border border-accent flex items-center justify-center text-secondary/30 text-2xl shrink-0"

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-secondary-light uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-4">
        {src ? (
          <img src={src} alt={label} className={`${previewClass} shrink-0`} />
        ) : (
          <div className={placeholderClass}>
            {shape === "circle" ? "👤" : "📖"}
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