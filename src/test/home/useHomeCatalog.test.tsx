import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { INITIAL_HOME_FILTERS } from '../../models/homeFilters'
import { homeService } from '../../services/homeService'
import { useHomeCatalog } from '../../hooks/useHomeCatalog'

vi.mock('../../services/homeService', () => ({
    homeService: {
        search: vi.fn(),
        getPopulares: vi.fn(),
    },
}))

const mockedHomeService = vi.mocked(homeService)

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
    },
]

const responseMock = (libros = librosMock, totalPages = 1) => ({
    content: libros,
    page: 0,
    totalPages,
})

const activeFilters = {
    ...INITIAL_HOME_FILTERS,
    drama: true,
}

const createDeferred = <T,>() => {
    let resolve: (value: T) => void = () => undefined
    const promise = new Promise<T>((promiseResolve) => {
        resolve = promiseResolve
    })

    return { promise, resolve }
}

describe('useHomeCatalog', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()
    })

    afterEach(async () => {
        await act(async () => {
            vi.runAllTimers()
        })
        vi.useRealTimers()
    })

    it('initial load calls getPopulares, updates books and total pages, and keeps popular view', async () => {
        mockedHomeService.getPopulares.mockResolvedValueOnce(responseMock(librosMock, 3))
        const { result } = renderHook(() => useHomeCatalog({ userId: null }))

        await act(async () => {
            await result.current.loadInitialCatalog()
        })

        expect(mockedHomeService.getPopulares).toHaveBeenCalledWith(null)
        expect(result.current.books).toEqual(librosMock)
        expect(result.current.totalPaginas).toBe(3)
        expect(result.current.vistaPopulares).toBe(true)
    })

    it('handleSearch searches the first page and updates query, page, and popular view', async () => {
        mockedHomeService.search.mockResolvedValueOnce(responseMock())
        const { result } = renderHook(() => useHomeCatalog({ userId: 42 }))

        await act(async () => {
            await result.current.handleSearch('rayuela')
        })

        expect(mockedHomeService.search).toHaveBeenCalledWith(
            'rayuela',
            INITIAL_HOME_FILTERS,
            0,
            10,
            42,
            'titulo'
        )
        expect(result.current.query).toBe('rayuela')
        expect(result.current.currentPage).toBe(1)
        expect(result.current.vistaPopulares).toBe(false)
    })

    it('handlePageChange searches using a zero-based page and updates current page', async () => {
        mockedHomeService.search.mockResolvedValueOnce(responseMock())
        const { result } = renderHook(() => useHomeCatalog({ userId: null }))

        await act(async () => {
            await result.current.handlePageChange(2)
        })

        expect(mockedHomeService.search).toHaveBeenCalledWith(
            '',
            INITIAL_HOME_FILTERS,
            1,
            10,
            null,
            'titulo'
        )
        expect(result.current.currentPage).toBe(2)
    })

    it('stores an error and stops loading when the service rejects', async () => {
        mockedHomeService.getPopulares.mockRejectedValueOnce(new Error('Network Error'))
        const { result } = renderHook(() => useHomeCatalog({ userId: null }))

        await act(async () => {
            await result.current.loadInitialCatalog()
        })

        expect(result.current.error).not.toBeNull()
        expect(result.current.loading).toBe(false)
    })

    it('handleApplyFilters updates filters, resets page and popular view, and searches with the new filters', async () => {
        mockedHomeService.search.mockResolvedValueOnce(responseMock())
        const { result } = renderHook(() => useHomeCatalog({ userId: 42 }))

        await act(async () => {
            await result.current.handleApplyFilters(activeFilters)
        })

        expect(mockedHomeService.search).toHaveBeenCalledWith(
            '',
            activeFilters,
            0,
            10,
            42,
            'titulo'
        )
        expect(result.current.filters).toEqual(activeFilters)
        expect(result.current.currentPage).toBe(1)
        expect(result.current.vistaPopulares).toBe(false)
    })

    it('handleSortChange updates sort, resets page and popular view, and searches with the new sort', async () => {
        mockedHomeService.search.mockResolvedValueOnce(responseMock())
        const { result } = renderHook(() => useHomeCatalog({ userId: null }))

        await act(async () => {
            await result.current.handleSortChange('autor')
        })

        expect(mockedHomeService.search).toHaveBeenCalledWith(
            '',
            INITIAL_HOME_FILTERS,
            0,
            10,
            null,
            'autor'
        )
        expect(result.current.sortBy).toBe('autor')
        expect(result.current.currentPage).toBe(1)
        expect(result.current.vistaPopulares).toBe(false)
    })

    it('handleClearFilters resets filters, increments filterKey, resets page and popular view, and searches', async () => {
        mockedHomeService.search.mockResolvedValue(responseMock())
        const { result } = renderHook(() => useHomeCatalog({ userId: null }))

        await act(async () => {
            await result.current.handleSearch('borges')
        })
        await act(async () => {
            await result.current.handleApplyFilters(activeFilters)
        })
        mockedHomeService.search.mockClear()

        await act(async () => {
            await result.current.handleClearFilters()
        })

        expect(mockedHomeService.search).toHaveBeenCalledWith(
            'borges',
            INITIAL_HOME_FILTERS,
            0,
            10,
            null,
            'titulo'
        )
        expect(result.current.filters).toEqual(INITIAL_HOME_FILTERS)
        expect(result.current.filterKey).toBe(1)
        expect(result.current.currentPage).toBe(1)
        expect(result.current.vistaPopulares).toBe(false)
    })

    it('handleVerMas resets catalog state and searches without loading popular books', async () => {
        mockedHomeService.search.mockResolvedValue(responseMock())
        const { result } = renderHook(() => useHomeCatalog({ userId: 42 }))

        await act(async () => {
            await result.current.handleSearch('rayuela')
        })
        await act(async () => {
            await result.current.handleApplyFilters(activeFilters)
        })
        await act(async () => {
            await result.current.handleSortChange('autor')
        })
        await act(async () => {
            await result.current.handlePageChange(2)
        })
        mockedHomeService.search.mockClear()
        mockedHomeService.getPopulares.mockClear()

        await act(async () => {
            await result.current.handleVerMas()
        })

        expect(mockedHomeService.search).toHaveBeenCalledWith(
            '',
            INITIAL_HOME_FILTERS,
            0,
            10,
            42,
            'titulo'
        )
        expect(mockedHomeService.getPopulares).not.toHaveBeenCalled()
        expect(result.current.query).toBe('')
        expect(result.current.filters).toEqual(INITIAL_HOME_FILTERS)
        expect(result.current.sortBy).toBe('titulo')
        expect(result.current.currentPage).toBe(1)
        expect(result.current.filterKey).toBe(1)
        expect(result.current.vistaPopulares).toBe(false)
    })

    it('hasActiveFilters becomes true when filters contain an active value', async () => {
        mockedHomeService.search.mockResolvedValueOnce(responseMock())
        const { result } = renderHook(() => useHomeCatalog({ userId: null }))

        await act(async () => {
            await result.current.handleApplyFilters(activeFilters)
        })

        expect(result.current.hasActiveFilters).toBe(true)
    })

    it('retrySearch re-runs the current query, filter, page, and sort state', async () => {
        mockedHomeService.search.mockResolvedValue(responseMock())
        const { result } = renderHook(() => useHomeCatalog({ userId: 42 }))

        await act(async () => {
            await result.current.handleSearch('rayuela')
        })
        await act(async () => {
            await result.current.handleApplyFilters(activeFilters)
        })
        await act(async () => {
            await result.current.handleSortChange('autor')
        })
        await act(async () => {
            await result.current.handlePageChange(3)
        })
        mockedHomeService.search.mockClear()

        await act(async () => {
            await result.current.retrySearch()
        })

        expect(mockedHomeService.search).toHaveBeenCalledWith(
            'rayuela',
            activeFilters,
            2,
            10,
            42,
            'autor'
        )
    })

    it('keeps animating true while loading and clears it after the 150ms timeout', async () => {
        const deferred = createDeferred<ReturnType<typeof responseMock>>()
        mockedHomeService.search.mockReturnValueOnce(deferred.promise)
        const { result } = renderHook(() => useHomeCatalog({ userId: null }))

        act(() => {
            void result.current.handleSearch('rayuela')
        })

        expect(result.current.loading).toBe(true)
        expect(result.current.animating).toBe(true)

        await act(async () => {
            deferred.resolve(responseMock())
            await deferred.promise
        })

        expect(result.current.loading).toBe(false)
        expect(result.current.animating).toBe(true)

        act(() => {
            vi.advanceTimersByTime(149)
        })
        expect(result.current.animating).toBe(true)

        act(() => {
            vi.advanceTimersByTime(1)
        })
        expect(result.current.animating).toBe(false)
    })
})
