type SortByProps = {
    value: string
    onChange: (value: string) => void
}

const SORT_OPTIONS = [
    { value: 'titulo', label: 'Título' },
    { value: 'autor', label: 'Autor' },
    { value: 'duenio', label: 'Usuario' },
]

export const SortBy = ({ value, onChange }: SortByProps) => {
    return (
        <div className="flex items-center gap-1.5 text-xs text-secondary-light">
            <span className="text-secondary-light">Ordenar por:</span>
            <select
                data-testid="sort-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border border-accent rounded px-2 py-0.5 text-xs text-secondary-dark bg-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
                {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}