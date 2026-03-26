import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { GestionMisLibros } from '../../components/perfil/GestionMisLibros'
import type { LibroUsuarioItemDTO } from '../../models/libroModel'

const librosMock: LibroUsuarioItemDTO[] = [
  { id: 1, titulo: 'A', autor: 'Autor 1', genero: 'DRAMA', disponible: true, fechaAgregado: '2024-01-01' },
  { id: 2, titulo: 'B', autor: 'Autor 2', genero: 'DRAMA', disponible: true, fechaAgregado: '2024-01-02' },
  { id: 3, titulo: 'C', autor: 'Autor 3', genero: 'DRAMA', disponible: true, fechaAgregado: '2024-01-03' },
  { id: 4, titulo: 'D', autor: 'Autor 4', genero: 'DRAMA', disponible: false, fechaAgregado: '2024-01-04' },
]

const renderGestion = () =>
  render(
    <MemoryRouter>
      <GestionMisLibros libros={librosMock} onAgregar={vi.fn()} onEliminar={vi.fn()} />
    </MemoryRouter>
  )

describe('GestionMisLibros', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('aplica delay de 150ms al cambiar tab', () => {
    renderGestion()

    expect(screen.getByText((txt) => txt.includes('de 4 libros'))).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Prestados' }))

    expect(screen.getByText((txt) => txt.includes('de 4 libros'))).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(screen.getByText((txt) => txt.includes('de 1 libros'))).toBeInTheDocument()
  })

  it('aplica delay de 150ms al cambiar página', () => {
    renderGestion()

    expect(screen.getByText((txt) => txt.includes('de 4 libros'))).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '2' }))

    expect(screen.getByText((txt) => txt.includes('de 4 libros'))).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(screen.getByText((txt) => txt.includes('4–4'))).toBeInTheDocument()
  })
})
