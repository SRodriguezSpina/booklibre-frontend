import { NavLink, useNavigate } from "react-router-dom"
import { TrendingUp, LogOut } from "lucide-react"
import navBarLogo from "../../assets/icons/booklibre-logo.svg"
import { usuarioService } from "../../services/usuarioService"
import { authService } from "../../services/AuthService"
import type { UsuarioData } from "../../classes/usuario"
import { useState } from "react"
import { useOnInit } from "../../utils/hooks"

interface NavItemProps {
  text: string
  to: string
}

export const NavItem = ({ text, to }: NavItemProps) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `text-[11px] font-bold uppercase tracking-[0.05em] transition-colors duration-200 ${
            isActive
              ? "text-primary-light border-b-2 border-primary-light pb-1"
              : "text-on-surface-variant hover:text-on-surface"
          }`
        }
      >
        {text}
      </NavLink>
    </li>
  )
}

export const NavbarSuperior = () => {
  const [usuario, setUsuario] = useState<UsuarioData | null>(null)
  const userId = authService.obtenerIdUsuarioActual()

  useOnInit(() => {
    if (userId) {
      usuarioService
        .obtenerUsuario(userId)
        .then(setUsuario)
        .catch(console.error)
    }
  })

  const nombre = usuario?.nombre ?? "Usuario"
  const inicial = nombre.charAt(0).toUpperCase()
  const bibliokarmas = usuario?.bibliokarmas ?? 0
  const navigate = useNavigate()

  const items: NavItemProps[] = [
    { text: "Inicio", to: "/home" },
    { text: "Mis Préstamos", to: "/mis-prestamos" },
    { text: "Perfil", to: "/perfil" },
  ]

  const handleLogout = () => {
    authService.logout()
    navigate("/login")
  }

  return (
    <nav className="bg-background/80 backdrop-blur-md fixed top-0 z-50 w-full border-b border-accent/15 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        {/* Logo + links */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img src={navBarLogo} alt="BookLibre" className="w-6 h-6" />
            <span className="text-xl font-serif font-bold tracking-tight text-primary-light">
              BookLibre
            </span>
          </div>
          <ul className="flex gap-6 list-none items-center">
            {items.map((item) => (
              <NavItem key={item.to} text={item.text} to={item.to} />
            ))}
          </ul>
        </div>

        {/* Bibliokarma + avatar + salir */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded border border-accent/20">
            <TrendingUp size={14} className="text-primary-light" />
            <span className="text-primary-light text-sm font-bold">
              {bibliokarmas}
            </span>
          </div>
          <div className="w-9 h-9 rounded border border-primary/30 bg-surface-high flex items-center justify-center text-primary-light text-sm font-bold">
            {inicial}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface border border-accent/30 rounded px-3 py-1.5 hover:bg-surface transition-colors"
          >
            <LogOut size={13} />
            Salir
          </button>
        </div>
      </div>
    </nav>
  )
}
