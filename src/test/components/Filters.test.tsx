import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Filters } from '../../components/home/Filters'

describe('Filters', () => {
  it('renderiza las opciones de genero', () => {
    render(<Filters onApplyFilters={vi.fn()} />)
    expect(screen.getByText('Ciencia Ficción')).toBeInTheDocument()
    expect(screen.getByText('Drama')).toBeInTheDocument()
  })
  it('muestra error de validacion si paginasMin es mayor a paginasMax', () => {
    const mockApply = vi.fn()
    render(<Filters onApplyFilters={mockApply} />)

    const minInput = screen.getByPlaceholderText('Min')
    const maxInput = screen.getByPlaceholderText('Max')

    fireEvent.change(minInput, { target: { value: '500' } })
    fireEvent.change(maxInput, { target: { value: '100' } })

    fireEvent.click(screen.getByText('Aplicar filtros'))

    expect(screen.getByText('El mínimo debe ser menor al máximo')).toBeInTheDocument()
    expect(mockApply).not.toHaveBeenCalled()
  })
  it('llama a onApplyFilters con los datos actualizados cuando no hay errores', () => {
    const mockApply = vi.fn()
    render(<Filters onApplyFilters={mockApply} />)

    // Simulamos un click en la etiqueta de Drama
    const dramaButton = screen.getByText('Drama')
    fireEvent.click(dramaButton)

    fireEvent.click(screen.getByText('Aplicar filtros'))

    expect(mockApply).toHaveBeenCalledWith(expect.objectContaining({
      drama: true,
      cienciaFiccion: false
    }))
  })
})