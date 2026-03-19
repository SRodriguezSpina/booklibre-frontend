// libroService.test.ts
import "@testing-library/jest-dom"
import axios from "axios"
import { libroService } from "../services/libroService"
import { Libro } from "../classes/Libro"
import type { PrestamoDTO } from "../models/libroModel"
import { vi } from "vitest"
vi.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

const hoy = new Date()
const formatDate = (date: Date) => date.toISOString().split("T")[0]
const ayer = new Date(hoy)
ayer.setDate(hoy.getDate() - 1)
const en5Dias = new Date(hoy)
en5Dias.setDate(hoy.getDate() + 5)

const prestamoDTO: PrestamoDTO = {
  id: 1,
  titulo: "1984",
  autor: "George Orwell",
  estado: "EXCELENTE",
  propietarioId: 3,
  imagenUrl: "",
  alquiladoPorId: 1,
  fechaDesde: "2026-03-01",
  fechaHasta: formatDate(en5Dias),
  rating: 0,
  bibliokarma: 1550,
}

const libroRecibido = Libro.fromPrestamoJson(prestamoDTO) // alquiladoPorId === 1

const prestamoDTO2: PrestamoDTO = {
  ...prestamoDTO,
  id: 2,
  titulo: "Dune",
  autor: "Frank Herbert",
  alquiladoPorId: 2,
  propietarioId: 1, // propietarioId es el usuario 1 → prestado por mí
}
const libroEmitido = Libro.fromPrestamoJson(prestamoDTO2)

// ── obtenerTodosLosPrestamos ──────────────────────────────────────────────────

describe("libroService - obtenerTodosLosPrestamos", () => {
  it("llama al endpoint correcto y mapea los DTOs a Libro", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [prestamoDTO] })
    const result = await libroService.obtenerTodosLosPrestamos(1)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("/reservas/1"),
    )
    expect(result).toHaveLength(1)
    expect(result[0]).toBeInstanceOf(Libro)
    expect(result[0].titulo).toBe("1984")
  })

  it("devuelve lista vacía si no hay préstamos", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] })
    const result = await libroService.obtenerTodosLosPrestamos(1)
    expect(result).toHaveLength(0)
  })
})

// ── filtrarPrestamos ──────────────────────────────────────────────────────────

describe("libroService - filtrarPrestamos", () => {
  const libros = [libroRecibido, libroEmitido]

  it("filtra correctamente los prestados a mi", () => {
    const result = libroService.filtrarPrestamos(libros, "prestados-a-mi", 1)
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe("1984")
  })

  it("filtra correctamente los prestados por mi", () => {
    const result = libroService.filtrarPrestamos(libros, "prestados-por-mi", 1)
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe("Dune")
  })

  it("filtra por titulo con searchQuery", () => {
    const result = libroService.filtrarPrestamos(
      libros,
      "prestados-a-mi",
      1,
      "1984",
    )
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe("1984")
  })

  it("filtra por autor con searchQuery", () => {
    const result = libroService.filtrarPrestamos(
      libros,
      "prestados-a-mi",
      1,
      "orwell",
    )
    expect(result).toHaveLength(1)
    expect(result[0].autor).toBe("George Orwell")
  })

  it("devuelve lista vacía si el searchQuery no coincide con nada", () => {
    const result = libroService.filtrarPrestamos(
      libros,
      "prestados-a-mi",
      1,
      "zzznomatch",
    )
    expect(result).toHaveLength(0)
  })

  it("la busqueda es case-insensitive", () => {
    const result = libroService.filtrarPrestamos(
      libros,
      "prestados-a-mi",
      1,
      "GEORGE",
    )
    expect(result).toHaveLength(1)
  })
})

// ── calificarLibro ────────────────────────────────────────────────────────────

describe("libroService - calificarLibro", () => {
  it("llama al endpoint correcto con los datos correctos", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} })
    await libroService.calificarLibro(1, 1, 5, "Excelente")
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/libros/1/calificar"),
      { usuarioId: 1, valor: 5, comentario: "Excelente" },
    )
  })
})

// ── eliminarLibro ─────────────────────────────────────────────────────────────

describe("libroService - eliminarLibro", () => {
  it("llama al endpoint correcto con el usuarioId como param", async () => {
    mockedAxios.delete.mockResolvedValueOnce({})
    await libroService.eliminarLibro(1, 3)
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining("/libros/1"),
      { params: { usuarioId: 3 } },
    )
  })
})

// ── obtenerPrestamosFiltrados ─────────────────────────────────────────────────

describe("libroService - obtenerPrestamosFiltrados", () => {
  it("devuelve todos los libros si no hay query", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [prestamoDTO, prestamoDTO2] })
    const result = await libroService.obtenerPrestamosFiltrados(1)
    expect(result).toHaveLength(2)
  })

  it("filtra por query sobre los resultados", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [prestamoDTO, prestamoDTO2] })
    const result = await libroService.obtenerPrestamosFiltrados(1, "dune")
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe("Dune")
  })
})
