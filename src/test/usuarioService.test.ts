import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

// Importar después del mock
import { usuarioService } from '../services/usuarioService'

const usuarioDataMock = {
  id: 1,
  nombre: 'Juan Pérez',
  desc: 'desc',
  email: 'juan@mail.com',
  celular: '123',
  ciudad: 'Rosario',
  tipoUsuario: 'Lector',
  bibliokarmas: 10,
}

describe('usuarioService — obtenerUsuario', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('llama al endpoint correcto y devuelve el data', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: usuarioDataMock } as any)

    const result = await usuarioService.obtenerUsuario(1)

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/usuarios/1'),
    )
    expect(result).toEqual(usuarioDataMock)
  })

  it('propaga el error si axios falla', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Unauthorized'))

    await expect(usuarioService.obtenerUsuario(1)).rejects.toThrow('Unauthorized')
  })
})

describe('usuarioService — actualizarUsuario', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('envía el payload correcto (UsuarioUpdateRequest)', async () => {
    const usuarioActualizado = { ...usuarioDataMock, nombre: 'Juan 2' }

    mockedAxios.put.mockResolvedValueOnce({ data: usuarioActualizado } as any)

    const result = await usuarioService.actualizarUsuario(usuarioActualizado as any)

    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining('/usuarios/1'),
      expect.objectContaining({
        nombre: 'Juan 2',
        desc: 'desc',
        email: 'juan@mail.com',
        celular: '123',
        ciudad: 'Rosario',
        tipoUsuario: 'Lector',
      }),
    )

    expect(result).toEqual(usuarioActualizado)
  })

  it('propaga el error si axios falla', async () => {
    mockedAxios.put.mockRejectedValueOnce(new Error('Forbidden'))

    await expect(
      usuarioService.actualizarUsuario(usuarioDataMock as any),
    ).rejects.toThrow('Forbidden')
  })
})