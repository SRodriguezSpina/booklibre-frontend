import axios from "axios"
import { Libro } from "../classes/Libro"
import type {
  LibroDTO,
  LibroUsuarioItemDTO,
  PrestamoDTO,
  TipoPrestamo,
} from "../models/libroModel"
import { API_BASE_URL } from "../env"

export const libroService = {
  async obtenerTodosLosPrestamos(usuarioId: number): Promise<Libro[]> {
    const res = await axios.get<PrestamoDTO[]>(
      `${API_BASE_URL}/reservas/${usuarioId}`,
    )
    return res.data.map(Libro.fromPrestamoJson)
  },

  filtrarPrestamos(
    libros: Libro[],
    tipo: TipoPrestamo, // "prestados-a-mi" | "prestados-por-mi"
    usuarioId: number,
    searchQuery: string = "",
  ): Libro[] {
    const query = searchQuery.toLowerCase().trim()

    return libros.filter((libro) => {
      const esPrestamoRecibido = libro.alquiladoPorId === usuarioId

      const coincideTipo =
        tipo === "prestados-a-mi" ? esPrestamoRecibido : !esPrestamoRecibido

      // Lógica de búsqueda
      const coincideBusqueda =
        !query ||
        libro.titulo.toLowerCase().includes(query) ||
        libro.autor.toLowerCase().includes(query)

      return coincideTipo && coincideBusqueda
    })
  },

  async obtenerLibrosDeUsuario(usuarioId: number): Promise<Libro[]> {
    const res = await axios.get<LibroDTO[]>(
      `${API_BASE_URL}/usuarios/${usuarioId}/libros`,
    )
    return res.data.map(Libro.fromJson)
  },

  // ⇩⇩⇩ NUEVO MÉTODO SOLO PARA PERFIL USUARIO
  async obtenerLibrosUsuarioPerfil(usuarioId: number): Promise<LibroUsuarioItemDTO[]> {
    const res = await axios.get<LibroUsuarioItemDTO[]>(
      `${API_BASE_URL}/usuarios/${usuarioId}/libros`,
    )
    return res.data
  },

  async getLibroById(id: number): Promise<Libro> {
    const res = await axios.get<LibroDTO>(`${API_BASE_URL}/libros/${id}`)
    return Libro.fromJson(res.data)
  },

  async crearLibro(dto: LibroDTO, usuarioId: number): Promise<Libro> {
    const res = await axios.post<LibroDTO>(`${API_BASE_URL}/libros/nuevo`, dto, { 
      params: { 
        usuarioId 
      } 
    })
    return Libro.fromJson(res.data)
  },

  async actualizarLibro(dto: LibroDTO): Promise<Libro> {
    const res = await axios.put<LibroDTO>(
      `${API_BASE_URL}/libros/${dto.id}`,
      dto,
    )
    return Libro.fromJson(res.data)
  },

  async eliminarLibro(libroId: number, usuarioId: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/libros/${libroId}`, {
      params: { usuarioId },
    })
  },

  async obtenerPrestamosFiltrados(
    usuarioId: number,
    query: string = "",
  ): Promise<Libro[]> {
    const todosLosLibros = await this.obtenerTodosLosPrestamos(usuarioId)
    if (!query) return todosLosLibros
    const q = query.toLowerCase()
    return todosLosLibros.filter(
      (libro) =>
        libro.titulo.toLowerCase().includes(q) ||
        libro.autor.toLowerCase().includes(q),
    )
  },
  // libroService.ts
  async calificarLibro(
    libroId: number,
    usuarioId: number,
    valor: number,
    comentario: string,
  ) {
    return await axios.post(`${API_BASE_URL}/libros/${libroId}/calificar`, {
      usuarioId,
      valor,
      comentario,
    })
  },
}
