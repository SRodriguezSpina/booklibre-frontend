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
          `text-sm font-medium transition-colors duration-200 ${isActive
            ? "text-primary-dark"
            : "text-secondary hover:text-primary-dark"
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
      usuarioService.obtenerUsuario(userId)
        .then(setUsuario)
        .catch(console.error)
    }
  })
  const nombre = usuario?.nombre ?? 'Usuario'
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
    <nav className="bg-surface border-b border-accent h-14 w-full flex items-center justify-between px-8">

      {/* logo + links */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <img src={navBarLogo} alt="BookLibre" className="w-6 h-6" />
          <span className="text-sm font-bold text-primary-dark">BookLibre</span>
        </div>
        <ul className="flex gap-6 list-none">
          {items.map((item) => (
            <NavItem key={item.to} text={item.text} to={item.to} />
          ))}
        </ul>
      </div>

      {/* bibliokarma + avatar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-secondary">
          <TrendingUp size={14} className="text-primary" />
          <span>Bibliokarma {bibliokarmas}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary-dark flex items-center justify-center text-surface text-sm font-bold">
          {inicial}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-secondary-dark border border-accent rounded-lg px-3 py-1.5 hover:bg-accent/30 transition-colors"
        >
          <LogOut size={13} />
          Salir
        </button>
      </div>

    </nav>
  )
}