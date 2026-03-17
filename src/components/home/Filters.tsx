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

// eslint-disable-next-line react-refresh/only-export-components
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
        <div className="bg-surface border border-accent rounded-2xl p-4 flex flex-col gap-5 text-sm text-secondary-dark">

            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-light mb-2">Género</h4>
                <div className="flex flex-col gap-1.5">
                    {[
                        { key: 'cienciaFiccion', label: 'Ciencia Ficción' },
                        { key: 'drama', label: 'Drama' },
                        { key: 'autoayuda', label: 'Autoayuda' },
                        { key: 'romance', label: 'Romance' },
                        { key: 'disenio', label: 'Diseño' },
                        { key: 'literaturaClasica', label: 'Literatura Clásica' },
                    ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters[key as keyof FiltersState] as boolean}
                                onChange={(e) => updateFilter(key as keyof FiltersState, e.target.checked)}
                                className="accent-primary w-3.5 h-3.5"
                            />
                            <span className="text-xs">{label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-light mb-2">Rango de páginas</h4>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        onChange={(e) => updateFilter("paginasMin", Number(e.target.value))}
                        className="w-full border border-accent rounded-lg px-2 py-1 text-xs outline-none focus:border-primary"
                    />
                    <span className="text-secondary-light">—</span>
                    <input
                        type="number"
                        placeholder="Max"
                        onChange={(e) => updateFilter("paginasMax", Number(e.target.value))}
                        className="w-full border border-accent rounded-lg px-2 py-1 text-xs outline-none focus:border-primary"
                    />
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-light mb-2">Rango de fechas para reservar</h4>
                <div className="flex flex-col gap-2">
                    <label className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-secondary-light">Desde</span>
                        <input
                            type="date"
                            onChange={(e) => updateFilter("fechaDesde", e.target.value)}
                            className="border border-accent rounded-lg px-2 py-1 text-xs outline-none focus:border-primary"
                        />
                    </label>
                    <label className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-secondary-light">Hasta</span>
                        <input
                            type="date"
                            onChange={(e) => updateFilter("fechaHasta", e.target.value)}
                            className="border border-accent rounded-lg px-2 py-1 text-xs outline-none focus:border-primary"
                        />
                    </label>
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-light mb-2">Detalles</h4>
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="ISBN"
                        onChange={(e) => updateFilter("isbn", e.target.value)}
                        className="border border-accent rounded-lg px-2 py-1 text-xs outline-none focus:border-primary"
                    />
                    <input
                        type="text"
                        placeholder="Prestado por"
                        onChange={(e) => updateFilter("prestadoPor", e.target.value)}
                        className="border border-accent rounded-lg px-2 py-1 text-xs outline-none focus:border-primary"
                    />
                </div>
            </div>

            <button
                onClick={handleApply}
                className="w-full flex items-center justify-center gap-2 bg-primary-dark text-surface text-xs font-semibold py-2 rounded-full hover:bg-opacity-90 active:scale-95 transition-all"
            >
                Aplicar Filtros
            </button>

        </div>
    )
}