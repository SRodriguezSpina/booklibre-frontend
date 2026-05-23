import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest' // <-- Agregamos afterEach
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from '../../pages/Home'
import { homeService } from '../../services/homeService'
import { authService } from '../../services/AuthService'


vi.mock('../../services/homeService', () => ({
    homeService: {
        search: vi.fn()
    }
}))

vi.mock('../../services/AuthService', () => ({
    authService: {
        obtenerIdUsuarioActual: vi.fn()
    }
}))

const mockedHomeService = vi.mocked(homeService)
const mockedAuthService = vi.mocked(authService)

const librosMock = [
    {
        id: 1,
        imagenUrl: '',
        genero: 'DRAMA' as const,
        titulo: 'Clean Code',
        autor: 'Robert C. Martin',
        calificacion: 4.5,
        isbn: '978-0132350884',
        idioma: 'ESPANOL' as const,
        tipo: 'Comun' as const,
        bibliokarma: 150,
        estado: 'EXCELENTE' as const,
        duenio: 'Ana García',
    }
]

const responseMock = (libros = librosMock) => ({
    content: libros,
    page: 0,
    totalPages: 1,
})

const renderHome = () =>
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    )

describe('Home', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAuthService.obtenerIdUsuarioActual.mockReturnValue(null)
        vi.useFakeTimers()  // ← activar fake timers
    })

    afterEach(async () => {
        // Drena timers pendientes ANTES de que el entorno se destruya
        await act(async () => {
            vi.runAllTimers()
        })
        vi.useRealTimers()
    })

    it('muestra el spinner mientras carga', () => {
        mockedHomeService.search.mockReturnValue(new Promise(() => {}))
        renderHome()
        expect(screen.getByTestId('spinner')).toBeInTheDocument()
    })

    it('muestra los libros cuando la respuesta es exitosa', async () => {
        mockedHomeService.search.mockResolvedValueOnce(responseMock())
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()  // resuelve promesas Y setTimeout
        })

        expect(screen.getByTestId('libros-grid')).toBeInTheDocument()
        expect(screen.getByText('Clean Code')).toBeInTheDocument()
    })

    it('muestra el estado vacío cuando no hay libros', async () => {
        mockedHomeService.search.mockResolvedValueOnce(responseMock([]))
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })

    it('muestra el ErrorCard cuando el service falla', async () => {
        mockedHomeService.search.mockRejectedValueOnce(new Error('Network Error'))
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(screen.getByTestId('error-card')).toBeInTheDocument()
    })

    it('llama al service al montar el componente', async () => {
        mockedHomeService.search.mockResolvedValueOnce(responseMock())
        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(mockedHomeService.search).toHaveBeenCalledTimes(1)
    })

    it('llama al service con el nuevo sort al cambiar el SortBy', async () => {
        mockedHomeService.search
            .mockResolvedValueOnce(responseMock())
            .mockResolvedValueOnce(responseMock())

        renderHome()

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(screen.getByTestId('sort-select')).toBeInTheDocument()

        fireEvent.change(screen.getByTestId('sort-select'), {
            target: { value: 'autor' }
        })

        await act(async () => {
            await vi.runAllTimersAsync()
        })

        expect(mockedHomeService.search).toHaveBeenCalledTimes(2)
        expect(mockedHomeService.search).toHaveBeenLastCalledWith(
            '', expect.anything(), 0, 10, null, 'autor'
        )
    })
})