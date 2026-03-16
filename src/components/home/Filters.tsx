import { useState } from "react"

export type FiltersState = {
    cienciaFiccion: boolean
    drama: boolean
    autoayuda: boolean
    romance: boolean
    disenio: boolean
    literaturaClasica: boolean
    // ^ estados individuales en géneros
    isbn?: string
    prestadoPor?: string
    paginasMin?: number
    paginasMax?: number
    fechaDesde?: string
    fechaHasta?: string
}

type Props = {
    onApplyFilters: (filters: FiltersState) => void
}

export const INITIAL_FILTERS: FiltersState = {
    cienciaFiccion: false,
    drama: false,
    autoayuda: false,
    romance: false,
    disenio: false,
    literaturaClasica: false
}

export const Filters = ({ onApplyFilters }: Props) => {
    const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS)

    const updateFilter = <K extends keyof FiltersState>(
        key: K,
        value: FiltersState[K]
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value
        }))
    }

    const handleApply = () => {
        onApplyFilters(filters)
    }

    return (
        <section>
            <div>
                <h4>Géneros</h4>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.cienciaFiccion}
                            onChange={(e) => updateFilter("cienciaFiccion", e.target.checked)}
                        />
                        Ciencia Ficción
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={filters.drama}
                            onChange={(e) => updateFilter("drama", e.target.checked)}
                        />
                        Drama
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={filters.autoayuda}
                            onChange={(e) => updateFilter("autoayuda", e.target.checked)}
                        />
                        Autoayuda
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={filters.romance}
                            onChange={(e) => updateFilter("romance", e.target.checked)}
                        />
                        Romance
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={filters.disenio}
                            onChange={(e) => updateFilter("disenio", e.target.checked)}
                        />
                        Diseño
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={filters.literaturaClasica}
                            onChange={(e) => updateFilter("literaturaClasica", e.target.checked)}
                        />
                        Literatura Clásica
                    </label>
                </div>
            </div>
            <div>
                <h4>Rango de páginas</h4>
                <div>
                    <input type="number" onChange={(e) => updateFilter("paginasMin", Number(e.target.value))} />
                    <input type="number" onChange={(e) => updateFilter("paginasMax", Number(e.target.value))} />
                </div>
            </div>
            <div>
                <h4>Rango de fechas para reservar</h4>
                <div>
                    <input type="date" onChange={(e) => updateFilter("fechaDesde", e.target.value)} />
                    <input type="date" onChange={(e) => updateFilter("fechaHasta", e.target.value)} />
                </div>
            </div>
            <div>
                <h4>Detalles</h4>
                <div>
                    <input type="text" onChange={(e) => updateFilter("isbn", e.target.value)} />
                    <input type="text" onChange={(e) => updateFilter("prestadoPor", e.target.value)} />
                </div>
            </div>
            <button onClick={handleApply}>Aplicar filtros</button>
        </section>
    )
}