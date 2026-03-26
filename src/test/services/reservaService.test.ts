import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { reservaService } from '../../services/reservaService'

vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

describe('reservaService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('llama al endpoint de reservas con el DTO correcto', async () => {
    const dtoMock = {
      libroId: 1,
      usuarioId: 2,
      fechaDesde: '2026-04-01',
      fechaHasta: '2026-04-10'
    }
    
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } })

    await reservaService.crearReserva(dtoMock)

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/reservas'),
      dtoMock
    )
  })
  it('propaga el error si axios falla', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Conflicto de reserva'))

    await expect(
      reservaService.crearReserva({ libroId: 1, usuarioId: 2, fechaDesde: '', fechaHasta: '' })
    ).rejects.toThrow('Conflicto de reserva')
  })
})