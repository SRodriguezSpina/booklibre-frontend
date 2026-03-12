import { useState } from "react"

type Props = {
    onSearch: (query: string) => void
    placeholder: string
}

export const SearchBar = ({ onSearch, placeholder }: Props) => {
    const [texto, setTexto] = useState('')

    const handleSearch = () => {
        onSearch(texto)
    }

    return (
        <div>
            <input
                type="text"
                value={texto}
                placeholder={placeholder}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch()
                }}
            />
            <button onClick={handleSearch}>
                Buscar
            </button>
        </div>
    )
}