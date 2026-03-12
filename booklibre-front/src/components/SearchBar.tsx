import { useState } from "react"
import { Search } from "lucide-react" // Importamos el icono

type Props = {
  onSearch: (query: string) => void
  placeholder: string
}

export const SearchBar = ({ onSearch, placeholder }: Props) => {
  const [texto, setTexto] = useState("")

  const handleSearch = () => {
    onSearch(texto)
  }

  return (
    <div className="relative flex items-center w-full group">
      {/* Icono de lupa dentro del input */}
      <div className="absolute left-3 text-secondary-dark opacity-50 group-focus-within:text-primary-dark group-focus-within:opacity-100 transition-all">
        <Search size={18} />
      </div>

      <input
        type="text"
        value={texto}
        placeholder={placeholder}
        className="w-full pl-10 pr-24 py-2 bg-surface border border-accent rounded-full outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark transition-all text-secondary-dark placeholder:text-secondary-light/60"
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch()
        }}
      />

      <button
        onClick={handleSearch}
        className="absolute right-1 px-4 py-1.5 bg-primary-dark text-surface rounded-full text-sm font-medium hover:bg-opacity-90 active:scale-95 transition-all shadow-sm"
      >
        Buscar
      </button>
    </div>
  )
}
