import type { LibroDTO, TipoLibro, EstadoLibro } from "../models/libroModel"
import { Libro } from "./Libro"

export class LibroForm {
  titulo: string = ""
  autor: string = ""
  tipo: TipoLibro | "" = ""
  paginas: number | "" = ""
  estado: EstadoLibro | "" = ""
  propietarioId: number = 0

  static fields = [
    {
      name: "titulo",
      label: "Título",
      type: "text",
      placeholder: "Ingresá el título del libro...",
    },
    {
      name: "autor",
      label: "Autor",
      type: "text",
      placeholder: "Ingresá el autor...",
    },
    {
      name: "paginas",
      label: "Páginas",
      type: "number",
      placeholder: "Cantidad de páginas...",
    },
  ] as const

  static tipoOptions: { value: TipoLibro; label: string }[] = [
    { value: "Común",           label: "Común" },
    { value: "Con dedicatoria", label: "Con dedicatoria" },
    { value: "Coleccionable",   label: "Coleccionable" },
  ]

  static estadoOptions: { value: EstadoLibro; label: string }[] = [
    { value: "Excelente", label: "Excelente" },
    { value: "Muy bueno", label: "Muy bueno" },
    { value: "Bueno",     label: "Bueno" },
    { value: "Regular",   label: "Regular" },
    { value: "Malo",      label: "Malo" },
  ]

  static fromLibro(libro: Libro): LibroForm {
    const form = new LibroForm()
    form.titulo       = libro.titulo
    form.autor        = libro.autor
    form.tipo         = libro.tipo
    form.paginas      = libro.paginas
    form.estado       = libro.estado
    form.propietarioId = libro.propietarioId
    return form
  }

  validate(): Record<string, string | undefined> {
    return {
      titulo:  !this.titulo.trim()
        ? "El título es obligatorio" : undefined,
      autor:   !this.autor.trim()
        ? "El autor es obligatorio" : undefined,
      tipo:    !this.tipo
        ? "El tipo es obligatorio" : undefined,
      paginas: this.paginas === "" || this.paginas <= 0
        ? "Ingresá una cantidad de páginas válida" : undefined,
      estado:  !this.estado
        ? "El estado es obligatorio" : undefined,
    }
  }

  isValid(): boolean {
    return !Object.values(this.validate()).some(Boolean)
  }

  toDTO(id: number): LibroDTO {
    return {
      id,
      titulo:       this.titulo,
      autor:        this.autor,
      tipo:         this.tipo as TipoLibro,
      paginas:      Number(this.paginas),
      estado:       this.estado as EstadoLibro,
      propietarioId: this.propietarioId,
    }
  }
}