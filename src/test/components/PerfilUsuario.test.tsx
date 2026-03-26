import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PerfilUsuario } from '../../pages/PerfilUsuario'
import { Usuario } from '../../classes/usuario'
import { toast } from 'react-toastify'

const mockSetUsuario = vi.fn()
const mockNavigate = vi.fn()
const mockUseOutletContext = vi.fn()
const mockObtenerLibrosUsuarioPerfil = vi.fn()
const mockActualizarUsuario = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useOutletContext: () => mockUseOutletContext(),
  }
})

vi.mock('../../services/libroService', () => ({
  libroService: {
    obtenerLibrosUsuarioPerfil: (...args: unknown[]) => mockObtenerLibrosUsuarioPerfil(...args),
    eliminarLibro: vi.fn(),
  },
}))

vi.mock('../../services/usuarioService', () => ({
  usuarioService: {
    actualizarUsuario: (...args: unknown[]) => mockActualizarUsuario(...args),
  },
}))

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('../../components/perfil/PerfilResumen', () => ({
  PerfilResumen: ({ onEditar }: { onEditar: () => void }) => (
    <button type="button" onClick={onEditar}>Abrir modal</button>
  ),
}))

vi.mock('../../components/perfil/MisDatosCard', () => ({
  MisDatosCard: () => <div>MisDatosCard</div>,
}))

vi.mock('../../components/perfil/EstadisticaCard', () => ({
  EstadisticaCard: () => <div>EstadisticaCard</div>,
}))

vi.mock('../../components/perfil/GestionMisLibros', () => ({
  GestionMisLibros: () => <div>GestionMisLibros</div>,
}))

vi.mock('../../components/perfil/ModalEditarPerfil', () => ({
  ModalEditarPerfil: ({
    onGuardar,
  }: {
    onGuardar: (u: Usuario) => Promise<void>
  }) => (
    <button
      type="button"
      onClick={() =>
        void onGuardar(
          new Usuario({
            id: 1,
            nombre: 'Ana 2',
            desc: 'desc',
            email: 'ana@mail.com',
            celular: '123',
            ciudad: 'CABA',
            tipoUsuario: 'Lector',
            bibliokarmas: 10,
            imagenUrl: 'img-local',
          })
        )
      }
    >
      Guardar mock
    </button>
  ),
}))

describe('PerfilUsuario', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseOutletContext.mockReturnValue({
      usuario: new Usuario({
        id: 1,
        nombre: 'Ana',
        desc: 'desc',
        email: 'ana@mail.com',
        celular: '123',
        ciudad: 'CABA',
        tipoUsuario: 'Lector',
        bibliokarmas: 10,
        imagenUrl: 'img-original',
      }),
      setUsuario: mockSetUsuario,
    })
    mockObtenerLibrosUsuarioPerfil.mockResolvedValue([])
  })

  it('actualiza usuario desde modal y conserva imagen local si backend no la devuelve', async () => {
    mockActualizarUsuario.mockResolvedValueOnce({
      nombre: 'Ana 2',
      desc: 'desc',
      email: 'ana@mail.com',
      celular: '123',
      ciudad: 'CABA',
      tipoUsuario: 'Lector',
      bibliokarmas: 10,
      imagenUrl: undefined,
    })

    render(<PerfilUsuario />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir modal' }))
    fireEvent.click(screen.getByRole('button', { name: 'Guardar mock' }))

    await waitFor(() => {
      expect(mockSetUsuario).toHaveBeenCalledTimes(1)
      const usuarioSeteado = mockSetUsuario.mock.calls[0][0] as Usuario
      expect(usuarioSeteado.nombre).toBe('Ana 2')
      expect(usuarioSeteado.imagenUrl).toBe('img-local')
      expect(toast.success).toHaveBeenCalledWith('¡Perfil actualizado con éxito!')
    })
  })
})
