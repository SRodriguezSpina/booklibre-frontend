import "@testing-library/jest-dom"
import { describe, it, expect} from 'vitest'
import { Libro } from "../classes/Libro"
import type { PrestamoDTO, LibroDTO } from "../models/libroModel"

const hoy = new Date()
hoy.setHours(0, 0, 0, 0)

const formatDate = (date: Date) => date.toISOString().split("T")[0]

const ayer = new Date(hoy)
ayer.setDate(hoy.getDate() - 1)

const manana = new Date(hoy)
manana.setDate(hoy.getDate() + 1)

const en5Dias = new Date(hoy)
en5Dias.setDate(hoy.getDate() + 5)

const hace5Dias = new Date(hoy)
hace5Dias.setDate(hoy.getDate() - 5)

const prestamoBase: PrestamoDTO = {
  id: 1,
  titulo: "1984",
  autor: "George Orwell",
  estado: "EXCELENTE",
  propietarioId: 3,
  imagenUrl: "",
  alquiladoPorId: 1,
  fechaDesde: formatDate(hace5Dias),
  fechaHasta: formatDate(en5Dias),
  rating: 0,
  bibliokarma: 1550,
}

describe("Libro - fromPrestamoJson", () => {
  it("mapea correctamente los campos del PrestamoDTO", () => {
    const libro = Libro.fromPrestamoJson(prestamoBase)
    expect(libro.id).toBe(1)
    expect(libro.titulo).toBe("1984")
    expect(libro.autor).toBe("George Orwell")
    expect(libro.propietarioId).toBe(3)
    expect(libro.alquiladoPorId).toBe(1)
    expect(libro.rating).toBe(0)
    expect(libro.bibliokarma).toBe(1550)
    expect(libro.fechaDevolucion).toBe(formatDate(en5Dias)) // fechaHasta -> fechaDevolucion
  })
})

describe("Libro - fromJson", () => {
  it("mapea correctamente los campos del LibroDTO", () => {
    const dto: LibroDTO = {
      id: 2,
      titulo: "Clean Code",
      autor: "Robert C. Martin",
      estado: "MUY_BUENO",
      propietarioId: 1,
      imagenUrl: "",
      tipo: "Comun",
      descripcion: "Buenas prácticas",
      genero: "DISENO",
      paginas: 464,
      isbn: "ISBN-001",
      idioma: "INGLES",
      editorial: "Prentice Hall",
      fechaPublicacion: "2008-08-01",
      bibliokarma: 1000,
      autorImg: "",
      estoyReservado: false
    }
    const libro = Libro.fromJson(dto)
    expect(libro.id).toBe(2)
    expect(libro.titulo).toBe("Clean Code")
    expect(libro.paginas).toBe(464)
  })
})
