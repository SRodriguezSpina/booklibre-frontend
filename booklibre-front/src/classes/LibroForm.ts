import type { LibroDTO, TipoLibro, EstadoLibro, Genero, Idioma } from "../models/libroModel"
import { Libro } from "./Libro"

export class LibroForm {
  titulo: string = ""
  autor: string = ""
  descripcion: string = ""
  tipo: TipoLibro | "" = ""
  genero: Genero | "" = ""
  paginas: number | "" = ""
  isbn: number | "" = ""
  idioma: Idioma | "" = ""
  estado: EstadoLibro | "" = ""
  fechaPublicacion: string = ""
  propietarioId: number = 0

  static fields = [
    { name: "titulo",           label: "Título",             type: "text",   placeholder: "Ingresá el título del libro..."    },
    { name: "autor",            label: "Autor",              type: "text",   placeholder: "Ingresá el autor..."               },
    { name: "descripcion",      label: "Descripción",        type: "text",   placeholder: "Breve descripción del libro..."    },
    { name: "paginas",          label: "Páginas",            type: "number", placeholder: "Cantidad de páginas..."            },
    { name: "isbn",             label: "ISBN",               type: "number", placeholder: "Código ISBN..."                    },
    { name: "fechaPublicacion", label: "Fecha de publicación", type: "date", placeholder: ""                                  },
  ] as const

  static tipoOptions: { value: TipoLibro; label: string }[] = [
    { value: "Común",           label: "Común"           },
    { value: "Con dedicatoria", label: "Con dedicatoria" },
    { value: "Coleccionable",   label: "Coleccionable"   },
  ]

  static estadoOptions: { value: EstadoLibro; label: string }[] = [
    { value: "Excelente", label: "Excelente" },
    { value: "Muy bueno", label: "Muy bueno" },
    { value: "Bueno",     label: "Bueno"     },
    { value: "Regular",   label: "Regular"   },
    { value: "Malo",      label: "Malo"      },
  ]

  static generoOptions: { value: Genero; label: string }[] = [
    { value: "Drama", label: "Drama" },
    { value: "Ciencia ficcion", label: "Ciencia ficcion" },
    { value: "Romance", label: "Romance" },
    { value: "Autoayuda", label: "Autoayuda" },
    { value: "Diseño", label: "Diseño" },
    { value: "Literatura Clasica", label: "Literatura Clasica" },
  ]

  static idiomaOptions: { value: Idioma; label: string }[] = [
    { value: "Español",   label: "Español"   },
    { value: "Ingles",    label: "Ingles"    },
    { value: "Portugues", label: "Portugues" },
    { value: "Frances",   label: "Frances"   },
  ]

  static fromLibro(libro: Libro): LibroForm {
    const form = new LibroForm()
    form.titulo           = libro.titulo
    form.autor            = libro.autor
    form.descripcion      = libro.descripcion
    form.tipo             = libro.tipo
    form.genero           = libro.genero
    form.paginas          = libro.paginas
    form.isbn             = libro.isbn
    form.idioma           = libro.idioma
    form.estado           = libro.estado
    form.fechaPublicacion = libro.fechaPublicacion
    form.propietarioId    = libro.propietarioId
    return form
  }

  validate(): Record<string, string | undefined> {
    return {
      titulo:           !this.titulo.trim()
        ? "El título es obligatorio" : undefined,
      autor:            !this.autor.trim()
        ? "El autor es obligatorio" : undefined,
      descripcion:      !this.descripcion.trim()
        ? "La descripción es obligatoria" : undefined,
      tipo:             !this.tipo
        ? "El tipo es obligatorio" : undefined,
      genero:           !this.genero
        ? "El género es obligatorio" : undefined,
      paginas:          this.paginas === "" || Number(this.paginas) <= 0
        ? "Ingresá una cantidad de páginas válida" : undefined,
      isbn:             this.isbn === "" || Number(this.isbn) <= 0
        ? "Ingresá un ISBN válido" : undefined,
      idioma:           !this.idioma
        ? "El idioma es obligatorio" : undefined,
      estado:           !this.estado
        ? "El estado es obligatorio" : undefined,
      fechaPublicacion: !this.fechaPublicacion
        ? "La fecha de publicación es obligatoria" : undefined,
    }
  }

  isValid(): boolean {
    return !Object.values(this.validate()).some(Boolean)
  }

  toDTO(id: number): LibroDTO {
    return {
      id,
      titulo:           this.titulo,
      autor:            this.autor,
      descripcion:      this.descripcion,
      tipo:             this.tipo             as TipoLibro,
      genero:           this.genero           as Genero,
      paginas:          Number(this.paginas),
      isbn:             Number(this.isbn),
      idioma:           this.idioma           as Idioma,
      estado:           this.estado           as EstadoLibro,
      fechaPublicacion: this.fechaPublicacion,
      propietarioId:    this.propietarioId,
    }
  }
}