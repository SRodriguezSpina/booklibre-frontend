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
      <div className="absolute left-3 text-on-surface-variant group-focus-within:text-primary-light transition-all">
        <Search size={18} />
      </div>

      <input
        type="text"
        value={texto}
        placeholder={placeholder}
        className="w-full pl-10 pr-24 py-2 bg-surface border border-accent/30 rounded-full outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-on-surface placeholder:text-on-surface-variant/40"
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch()
        }}
      />

      <button
        onClick={handleSearch}
        className="absolute right-1 px-4 py-1.5 bg-primary text-background rounded-full text-sm font-bold hover:bg-primary-dark active:scale-95 transition-all"
      >
        Buscar
      </button>
    </div>
  )
}
