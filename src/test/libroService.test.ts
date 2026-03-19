import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

// Importamos DESPUÉS del mock para que el módulo use la versión mockeada
import { libroService } from '../services/libroService'
import { Libro } from '../classes/Libro'
import type { LibroDTO, PrestamoDTO, LibroUsuarioItemDTO } from '../models/libroModel'

const libroDTOMock: LibroDTO = {
  id: 1,
  titulo: 'Clean Code',
  autor: 'Robert C. Martin',
  tipo: 'Comun',
  descripcion: 'Buenas prácticas',
  genero: 'DISENO',
  paginas: 464,
  isbn: '978-0132350884',
  idioma: 'INGLES',
  editorial: 'Prentice Hall',
  estado: 'EXCELENTE',
  fechaPublicacion: '2008-08-01',
  propietarioId: 3,
  imagenUrl: 'https://example.com/cover.jpg',
  alquiladoPorId: undefined,
  fechaDevolucion: undefined,
  bibliokarma: undefined,
}

const prestamoDTOMock: PrestamoDTO = {
  id: 10,
  titulo: 'Dune',
  autor: 'Frank Herbert',
  estado: 'MUY_BUENO',
  propietarioId: 3,
  imagenUrl: 'https://example.com/dune.jpg',
  alquiladoPorId: 1,
  fechaDesde: '2026-03-01',
  fechaHasta: '2026-03-20',
  rating: 4,
  bibliokarma: 1550,
}

const libroUsuarioItemMock: LibroUsuarioItemDTO = {
  id: 1,
  titulo: 'Clean Code',
  autor: 'Robert C. Martin',
  genero: 'DISENO',
  disponible: true,
  fechaAgregado: '2026-01-15',
  imagenUrl: 'https://example.com/cover.jpg',
}

describe('libroService - obtenerTodosLosPrestamos', () => {

  beforeEach(() => { vi.clearAllMocks() })

  it('llama al endpoint correcto con el usuarioId', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] })

    await libroService.obtenerTodosLosPrestamos(1)

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/reservas/1')
    )
  })

  it('devuelve un array de instancias de Libro', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [prestamoDTOMock] })

    const result = await libroService.obtenerTodosLosPrestamos(1)

    expect(result).toHaveLength(1)
    expect(result[0]).toBeInstanceOf(Libro)
  })

  it('mapea el título del préstamo correctamente', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [prestamoDTOMock] })

    const result = await libroService.obtenerTodosLosPrestamos(1)

    expect(result[0].titulo).toBe('Dune')
  })

  it('mapea fechaHasta del DTO a fechaDevolucion del Libro', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [prestamoDTOMock] })

    const result = await libroService.obtenerTodosLosPrestamos(1)

    expect(result[0].fechaDevolucion).toBe('2026-03-20')
  })

  it('mapea alquiladoPorId correctamente', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [prestamoDTOMock] })

    const result = await libroService.obtenerTodosLosPrestamos(1)

    expect(result[0].alquiladoPorId).toBe(1)
  })

  it('devuelve array vacío si el backend no devuelve préstamos', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] })

    const result = await libroService.obtenerTodosLosPrestamos(1)

    expect(result).toHaveLength(0)
  })

  it('mapea múltiples préstamos correctamente', async () => {
    const segundoPrestamo: PrestamoDTO = {
      ...prestamoDTOMock,
      id: 11,
      titulo: '1984',
      autor: 'George Orwell',
    }
    mockedAxios.get.mockResolvedValueOnce({ data: [prestamoDTOMock, segundoPrestamo] })

    const result = await libroService.obtenerTodosLosPrestamos(1)

    expect(result).toHaveLength(2)
    expect(result[1].titulo).toBe('1984')
  })

  it('propaga el error si axios falla', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'))

    await expect(libroService.obtenerTodosLosPrestamos(1)).rejects.toThrow('Network Error')
  })
})

describe('libroService - filtrarPrestamos', () => {

  const usuarioId = 1

  // Libro prestado A mí (alquiladoPorId === usuarioId)
  const libroRecibido = Libro.fromPrestamoJson({
    ...prestamoDTOMock,
    id: 1,
    titulo: 'Dune',
    autor: 'Frank Herbert',
    alquiladoPorId: usuarioId,
  })

  // Libro prestado POR mí (propietarioId === usuarioId, alquiladoPorId !== usuarioId)
  const libroPrestado = Libro.fromPrestamoJson({
    ...prestamoDTOMock,
    id: 2,
    titulo: 'Clean Code',
    autor: 'Robert C. Martin',
    propietarioId: usuarioId,
    alquiladoPorId: 99,
  })

  it('filtra solo los libros prestados a mí', () => {
    const result = libroService.filtrarPrestamos(
      [libroRecibido, libroPrestado], 'prestados-a-mi', usuarioId
    )
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe('Dune')
  })

  it('filtra solo los libros prestados por mí', () => {
    const result = libroService.filtrarPrestamos(
      [libroRecibido, libroPrestado], 'prestados-por-mi', usuarioId
    )
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe('Clean Code')
  })

  it('devuelve lista vacía si no hay libros que coincidan con el tipo', () => {
    const result = libroService.filtrarPrestamos(
      [libroRecibido], 'prestados-por-mi', usuarioId
    )
    expect(result).toHaveLength(0)
  })

  it('filtra por búsqueda de título (case-insensitive)', () => {
    const result = libroService.filtrarPrestamos(
      [libroRecibido, libroPrestado], 'prestados-a-mi', usuarioId, 'dune'
    )
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe('Dune')
  })

  it('filtra por búsqueda de autor (case-insensitive)', () => {
    const result = libroService.filtrarPrestamos(
      [libroRecibido, libroPrestado], 'prestados-a-mi', usuarioId, 'frank'
    )
    expect(result).toHaveLength(1)
    expect(result[0].autor).toBe('Frank Herbert')
  })

  it('búsqueda en mayúsculas encuentra resultados en minúsculas', () => {
    const result = libroService.filtrarPrestamos(
      [libroRecibido], 'prestados-a-mi', usuarioId, 'DUNE'
    )
    expect(result).toHaveLength(1)
  })

  it('query que no coincide con nada devuelve lista vacía', () => {
    const result = libroService.filtrarPrestamos(
      [libroRecibido, libroPrestado], 'prestados-a-mi', usuarioId, 'xyz123'
    )
    expect(result).toHaveLength(0)
  })

  it('query vacío no filtra por texto', () => {
    const result = libroService.filtrarPrestamos(
      [libroRecibido, libroPrestado], 'prestados-a-mi', usuarioId, ''
    )
    expect(result).toHaveLength(1) // solo el recibido, el tipo sigue aplicando
  })

  it('sin query devuelve todos los del tipo correcto', () => {
    const result = libroService.filtrarPrestamos(
      [libroRecibido, libroPrestado], 'prestados-a-mi', usuarioId
    )
    expect(result).toHaveLength(1)
  })

  it('devuelve lista vacía si libros es vacío', () => {
    const result = libroService.filtrarPrestamos([], 'prestados-a-mi', usuarioId)
    expect(result).toHaveLength(0)
  })
})

describe('libroService - getLibroById', () => {

  beforeEach(() => { vi.clearAllMocks() })

  it('llama al endpoint correcto con el libroId', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: libroDTOMock })

    await libroService.getLibroById(1, 2)

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/libros/1'),
      expect.objectContaining({ params: { usuarioId: 2 } })
    )
  })

  it('devuelve una instancia de Libro', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: libroDTOMock })

    const result = await libroService.getLibroById(1, 2)

    expect(result).toBeInstanceOf(Libro)
  })

  it('mapea el título correctamente', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: libroDTOMock })

    const result = await libroService.getLibroById(1, 2)

    expect(result.titulo).toBe('Clean Code')
  })

  it('mapea el autor correctamente', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: libroDTOMock })

    const result = await libroService.getLibroById(1, 2)

    expect(result.autor).toBe('Robert C. Martin')
  })

  it('mapea el propietarioId correctamente', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: libroDTOMock })

    const result = await libroService.getLibroById(1, 2)

    expect(result.propietarioId).toBe(3)
  })

  it('propaga el error si axios falla', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Not Found'))

    await expect(libroService.getLibroById(999, 1)).rejects.toThrow('Not Found')
  })

  it('pasa el usuarioId como query param', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: libroDTOMock })

    await libroService.getLibroById(1, 42)

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      { params: { usuarioId: 42 } }
    )
  })
})

describe('libroService - crearLibro', () => {

  beforeEach(() => { vi.clearAllMocks() })

  it('llama al endpoint correcto', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: libroDTOMock })

    await libroService.crearLibro(libroDTOMock, 3)

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/libros/nuevo'),
      libroDTOMock,
      expect.objectContaining({ params: { usuarioId: 3 } })
    )
  })

  it('devuelve una instancia de Libro', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: libroDTOMock })

    const result = await libroService.crearLibro(libroDTOMock, 3)

    expect(result).toBeInstanceOf(Libro)
  })

  it('el libro devuelto tiene el título del DTO', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: libroDTOMock })

    const result = await libroService.crearLibro(libroDTOMock, 3)

    expect(result.titulo).toBe('Clean Code')
  })

  it('pasa el usuarioId como query param', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: libroDTOMock })

    await libroService.crearLibro(libroDTOMock, 7)

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.anything(),
      { params: { usuarioId: 7 } }
    )
  })

  it('envía el DTO completo como body', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: libroDTOMock })

    await libroService.crearLibro(libroDTOMock, 3)

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      libroDTOMock,
      expect.anything()
    )
  })

  it('propaga el error si axios falla', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Server Error'))

    await expect(libroService.crearLibro(libroDTOMock, 3)).rejects.toThrow('Server Error')
  })
})

describe('libroService - actualizarLibro', () => {

  beforeEach(() => { vi.clearAllMocks() })

  it('llama al endpoint correcto con el id del libro', async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: libroDTOMock })

    await libroService.actualizarLibro(libroDTOMock)

    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining('/libros/1'),
      libroDTOMock
    )
  })

  it('devuelve una instancia de Libro', async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: libroDTOMock })

    const result = await libroService.actualizarLibro(libroDTOMock)

    expect(result).toBeInstanceOf(Libro)
  })

  it('el libro devuelto refleja los datos actualizados', async () => {
    const dtoActualizado = { ...libroDTOMock, titulo: 'Clean Code 2nd Ed' }
    mockedAxios.put.mockResolvedValueOnce({ data: dtoActualizado })

    const result = await libroService.actualizarLibro(dtoActualizado)

    expect(result.titulo).toBe('Clean Code 2nd Ed')
  })

  it('envía el DTO completo como body', async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: libroDTOMock })

    await libroService.actualizarLibro(libroDTOMock)

    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.any(String),
      libroDTOMock
    )
  })

  it('usa el id del DTO para construir la URL', async () => {
    const dtoConId5 = { ...libroDTOMock, id: 5 }
    mockedAxios.put.mockResolvedValueOnce({ data: dtoConId5 })

    await libroService.actualizarLibro(dtoConId5)

    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining('/libros/5'),
      expect.anything()
    )
  })

  it('propaga el error si axios falla', async () => {
    mockedAxios.put.mockRejectedValueOnce(new Error('Not Found'))

    await expect(libroService.actualizarLibro(libroDTOMock)).rejects.toThrow('Not Found')
  })
})

describe('libroService - eliminarLibro', () => {

  beforeEach(() => { vi.clearAllMocks() })

  it('llama al endpoint correcto con el libroId', async () => {
    mockedAxios.delete.mockResolvedValueOnce({})

    await libroService.eliminarLibro(1, 3)

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/libros/1'),
      expect.objectContaining({ params: { usuarioId: 3 } })
    )
  })

  it('pasa el usuarioId como query param', async () => {
    mockedAxios.delete.mockResolvedValueOnce({})

    await libroService.eliminarLibro(1, 42)

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.any(String),
      { params: { usuarioId: 42 } }
    )
  })

  it('no devuelve nada (void) cuando tiene éxito', async () => {
    mockedAxios.delete.mockResolvedValueOnce({})

    const result = await libroService.eliminarLibro(1, 3)

    expect(result).toBeUndefined()
  })

  it('propaga el error si axios falla', async () => {
    mockedAxios.delete.mockRejectedValueOnce(new Error('Forbidden'))

    await expect(libroService.eliminarLibro(1, 3)).rejects.toThrow('Forbidden')
  })

  it('llama a delete exactamente una vez', async () => {
    mockedAxios.delete.mockResolvedValueOnce({})

    await libroService.eliminarLibro(1, 3)

    expect(mockedAxios.delete).toHaveBeenCalledTimes(1)
  })
})

describe('libroService - obtenerLibrosUsuarioPerfil', () => {

  beforeEach(() => { vi.clearAllMocks() })

  it('llama al endpoint correcto con el usuarioId', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [libroUsuarioItemMock] })

    await libroService.obtenerLibrosUsuarioPerfil(1)

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/usuarios/1/libros')
    )
  })

  it('devuelve los LibroUsuarioItemDTO sin transformar', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [libroUsuarioItemMock] })

    const result = await libroService.obtenerLibrosUsuarioPerfil(1)

    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe('Clean Code')
    expect(result[0].disponible).toBe(true)
  })

  it('devuelve array vacío si el usuario no tiene libros', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] })

    const result = await libroService.obtenerLibrosUsuarioPerfil(1)

    expect(result).toHaveLength(0)
  })

  it('preserva el campo disponible: false', async () => {
    const noDisponible = { ...libroUsuarioItemMock, disponible: false }
    mockedAxios.get.mockResolvedValueOnce({ data: [noDisponible] })

    const result = await libroService.obtenerLibrosUsuarioPerfil(1)

    expect(result[0].disponible).toBe(false)
  })

  it('preserva fechaAgregado nulo', async () => {
    const sinFecha = { ...libroUsuarioItemMock, fechaAgregado: null }
    mockedAxios.get.mockResolvedValueOnce({ data: [sinFecha] })

    const result = await libroService.obtenerLibrosUsuarioPerfil(1)

    expect(result[0].fechaAgregado).toBeNull()
  })

  it('propaga el error si axios falla', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Unauthorized'))

    await expect(libroService.obtenerLibrosUsuarioPerfil(1)).rejects.toThrow('Unauthorized')
  })
})

describe('libroService - calificarLibro', () => {

  beforeEach(() => { vi.clearAllMocks() })

  it('llama al endpoint correcto con el libroId', async () => {
    mockedAxios.post.mockResolvedValueOnce({})

    await libroService.calificarLibro(1, 2, 5, 'Excelente libro')

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/libros/1/calificar'),
      expect.anything()
    )
  })

  it('envía usuarioId, valor y comentario en el body', async () => {
    mockedAxios.post.mockResolvedValueOnce({})

    await libroService.calificarLibro(1, 2, 5, 'Excelente libro')

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      { usuarioId: 2, valor: 5, comentario: 'Excelente libro' }
    )
  })

  it('funciona con comentario vacío', async () => {
    mockedAxios.post.mockResolvedValueOnce({})

    await libroService.calificarLibro(1, 2, 3, '')

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      { usuarioId: 2, valor: 3, comentario: '' }
    )
  })

  it('propaga el error si axios falla', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Bad Request'))

    await expect(libroService.calificarLibro(1, 2, 5, 'ok')).rejects.toThrow('Bad Request')
  })

  it('llama a post exactamente una vez', async () => {
    mockedAxios.post.mockResolvedValueOnce({})

    await libroService.calificarLibro(1, 2, 4, 'Bueno')

    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
  })
})