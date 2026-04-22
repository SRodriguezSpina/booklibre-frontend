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
        <div className="flex items-center gap-2">
            <span className="text-secondary-light font-medium text-xs">Ordenar por:</span>
            <div className="relative">
                <select
                    data-testid="sort-select"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="appearance-none w-32 bg-black/20 border border-transparent rounded px-3 py-1.5 pr-8 text-xs font-semibold text-secondary-dark outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer shadow-sm hover:bg-black/30"
                >
                    {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-surface text-secondary-dark font-medium">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                    <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
        </div>
    )
}