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
    // agregar fechas de hoy
}

export const Filters = ({ onApplyFilters }: Props) => {
    const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS)
    const [errors, setErrors] = useState<{ paginas?: string; fechas?: string }>({})

    const updateFilter = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
        setErrors({})
    }

    const validar = (): boolean => {
        const nuevosErrores: { paginas?: string; fechas?: string } = {}

        if (filters.paginasMin && filters.paginasMax && filters.paginasMin >= filters.paginasMax) {
            nuevosErrores.paginas = 'El mínimo debe ser menor al máximo'
        }
        if (filters.fechaDesde && filters.fechaHasta && filters.fechaDesde >= filters.fechaHasta) {
            nuevosErrores.fechas = 'La fecha de inicio debe ser anterior a la fecha final'
        }
        setErrors(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }
    // esto lo podría pasar a otro doc

    const handleApply = () => {
        if (validar()) onApplyFilters(filters)
    }

    return (
        <div className="bg-surface border border-accent/20 rounded p-5 flex flex-col gap-6 text-sm text-secondary-dark shadow-xl shadow-black/10">

            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-light mb-3">Género</h4>
                <div className="flex flex-wrap gap-2">
                    {[
                        { key: 'cienciaFiccion', label: 'Ciencia Ficción' },
                        { key: 'drama', label: 'Drama' },
                        { key: 'autoayuda', label: 'Autoayuda' },
                        { key: 'romance', label: 'Romance' },
                        { key: 'disenio', label: 'Diseño' },
                        { key: 'literaturaClasica', label: 'Literatura Clásica' },
                    ].map(({ key, label }) => {
                        const isChecked = filters[key as keyof FiltersState] as boolean;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => updateFilter(key as keyof FiltersState, !isChecked)}
                                className={`px-3 py-1.5 rounded text-[11px] font-medium transition-all duration-200 border ${
                                    isChecked
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-surface border-accent/50 text-secondary-light hover:border-secondary-light hover:text-secondary-dark"
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-light mb-3">Rango de páginas</h4>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        placeholder="Min"
                        min={1}
                        onChange={(e) => updateFilter("paginasMin", Number(e.target.value))}
                        className="w-full bg-black/20 border border-transparent rounded px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-secondary-light/50"
                    />
                    <span className="text-secondary-light/50 font-medium">—</span>
                    <input
                        type="number"
                        placeholder="Max"
                        min={1}
                        onChange={(e) => updateFilter("paginasMax", Number(e.target.value))}
                        className="w-full bg-black/20 border border-transparent rounded px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-secondary-light/50"
                    />
                </div>
                {errors.paginas && <p className="text-[10px] text-red-400 mt-1.5">{errors.paginas}</p>}
            </div>

            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-light mb-3">Fechas para reservar</h4>
                <div className="flex flex-col gap-3">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-secondary-light font-medium ml-1">Desde</span>
                        <input
                            type="date"
                            onChange={(e) => updateFilter("fechaDesde", e.target.value)}
                            className="bg-black/20 border border-transparent rounded px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/50 transition-all [color-scheme:dark]"
                        />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-secondary-light font-medium ml-1">Hasta</span>
                        <input
                            type="date"
                            onChange={(e) => updateFilter("fechaHasta", e.target.value)}
                            className="bg-black/20 border border-transparent rounded px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/50 transition-all [color-scheme:dark]"
                        />
                    </label>
                </div>
                {errors.fechas && <p className="text-[10px] text-red-400 mt-1.5">{errors.fechas}</p>}
            </div>

            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-light mb-3">Detalles</h4>
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="ISBN"
                        onChange={(e) => updateFilter("isbn", e.target.value)}
                        className="w-full bg-black/20 border border-transparent rounded px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-secondary-light/50"
                    />
                    <input
                        type="text"
                        placeholder="Prestado por"
                        onChange={(e) => updateFilter("prestadoPor", e.target.value)}
                        className="w-full bg-black/20 border border-transparent rounded px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-secondary-light/50"
                    />
                </div>
            </div>

            <button
                onClick={handleApply}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-primary text-surface font-semibold text-xs py-3 rounded hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-primary/10"
            >
                Aplicar Filtros
            </button>

        </div>
    )
}