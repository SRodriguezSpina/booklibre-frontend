import { useState } from "react"

export type FiltersState = {
    generos?: string[]
    isbn?: string
    prestadoPor?: string
    paginasMin?: number
    paginasMax?: number
    fechaDesde?: string
    fechaHasta?: string
}

const GENEROS = [
    "Ciencia Ficción",
    "Drama",
    "Autoayuda",
    "Romance",
    "Diseño",
    "Lietratura Clásica"
]

type Props = {
    onApplyFilters: (filters: FiltersState) => void
}

export const Filters = ({ onApplyFilters }: Props) => {
    const [filters, setFilters] = useState<FiltersState>({
        generos: []
    })

    const updateFilter = (key: keyof FiltersState, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value
        }))
    }

    const toggleGenero = (genero: string) => {
        setFilters((prev) => {

            const generosActuales = prev.generos ?? []
            if (generosActuales.includes(genero)) {
                return {
                    ...prev,
                    generos: generosActuales.filter(g => g !== genero)
                }
            }

            return {
                ...prev,
                generos: [...generosActuales, genero]
            }
        })
    }

    const handleApply = () => {
        onApplyFilters(filters)
    }

    return (
        <section>
            <div>
                <h4>Géneros</h4>
                <div>
                    {GENEROS.map((genero) => (
                        <label key={genero}>
                            <input
                                type="checkbox"
                                checked={filters.generos?.includes(genero)}
                                onChange={() => toggleGenero(genero)}
                            />
                            {genero}
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <h4>Rango de páginas</h4>
                <div>
                    <input type="number" onChange={(e) => updateFilter("paginasMin", Number(e.target.value))}/>
                    <input type="number" onChange={(e) => updateFilter("paginasMax", Number(e.target.value))}/>
                </div>
            </div>
            <div>
                {/* rango de fechas */}
                <h4>Rango de fechas para reservar</h4>
                <div>
                    <input type="date" onChange={(e) => updateFilter("fechaDesde", e.target.value)}/>
                    <input type="date" onChange={(e) => updateFilter("fechaHasta", e.target.value)}/>
                </div>
            </div>
            <div>
                {/* detalles (isbn + prestado por X usuario) */}
                <h4>Detalles</h4>
                <div>
                    <input type="text" onChange={(e) => updateFilter("isbn", e.target.value)}/>
                    <input type="text" onChange={(e) => updateFilter("prestadoPor", e.target.value)}/>
                </div>
            </div>
            <button onClick={handleApply}>Aplicar filtros</button>
        </section>
    )
}