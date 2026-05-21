import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GestionMisLibros } from '../../components/perfil/GestionMisLibros'
import type { LibroUsuarioItemDTO } from '../../models/libroModel'
import { type LibrosUsuarioPaginaResponse } from '../../services/libroService'

const mockObtenerLibrosUsuarioPerfil = vi.fn()
vi.mock('../../services/libroService', async () => {
  const actual: any = await vi.importActual('../../services/libroService')
  return {
    ...actual,
    libroService: {
      ...actual.libroService,
      obtenerLibrosUsuarioPerfil: (...args: unknown[]) => mockObtenerLibrosUsuarioPerfil(...args),
    },
  }
})

const buildLibros = (n: number, fromId = 1): LibroUsuarioItemDTO[] =>
  Array.from({ length: n }, (_, i) => ({
    id: fromId + i,
    titulo: `Libro ${fromId + i}`,
    autor: `Autor ${fromId + i}`,
    genero: 'DRAMA',
    disponible: true,
    fechaAgregado: `2024-03-${String(fromId + i).padStart(2, '0')}`,
    imagenUrl: null,
  }))

const buildPaged = (
  items: LibroUsuarioItemDTO[],
  total: number,
  size = 10,
  page = 0,
): LibrosUsuarioPaginaResponse => ({
  content: items,
  page,
  totalPages: Math.max(1, Math.ceil(total / size)),
  totalElements: total,
})

const renderGestion = () =>
  render(
    <MemoryRouter>
      <GestionMisLibros
        usuarioId={1}
        habilitado={true}
        onAgregar={vi.fn()}
        onEliminar={vi.fn()}
      />
    </MemoryRouter>,
  )

describe('GestionMisLibros', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    mockObtenerLibrosUsuarioPerfil.mockImplementation((_, params) => {
      // por default: 11 libros totales, primera pagina trae 10
      const page = params?.page ?? 0
      const size = params?.size ?? 10
      const total = 11
      const inicio = page * size
      const fin = Math.min(inicio + size, total)
      return Promise.resolve(buildPaged(buildLibros(fin - inicio, inicio + 1), total, size, page))
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza paginacion server-side desde el primer fetch', async () => {
    renderGestion()
    await waitFor(() =>
      expect(screen.getByText((txt) => txt.includes('de 11 libros'))).toBeInTheDocument(),
    )
  })

  it('al cambiar tab vuelve a pedirle al backend con el filtro nuevo', async () => {
    renderGestion()
    await waitFor(() =>
      expect(mockObtenerLibrosUsuarioPerfil).toHaveBeenCalled(),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Prestados' }))
    await waitFor(() =>
      expect(mockObtenerLibrosUsuarioPerfil).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ filtro: 'prestados' }),
      ),
    )
  })

  it('al cambiar de pagina vuelve a pedirle al backend la pagina nueva', async () => {
    renderGestion()
    await waitFor(() =>
      expect(screen.getByText((txt) => txt.includes('de 11 libros'))).toBeInTheDocument(),
    )
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    await waitFor(() =>
      expect(mockObtenerLibrosUsuarioPerfil).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ page: 1 }),
      ),
    )
  })
})
