import { NavLink, useNavigate } from "react-router-dom"
import { TrendingUp, LogOut, Menu, X } from "lucide-react"
import navBarLogo from "../../assets/icons/booklibre-logo.svg"
import { usuarioService } from "../../services/usuarioService"
import { authService } from "../../services/AuthService"
import type { UsuarioData } from "../../classes/usuario"
import { useState } from "react"
import { useOnInit } from "../../utils/hooks"

interface NavItemProps {
  text: string
  to: string
  onClick?: () => void
}

export const NavItem = ({ text, to, onClick }: NavItemProps) => {
  return (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
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
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
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

  const cerrarMenu = () => setMenuMovilAbierto(false)

  return (
    <nav className="bg-background/80 backdrop-blur-md fixed top-0 z-50 w-full border-b border-accent/15 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={navBarLogo} alt="BookLibre" className="w-6 h-6" />
            <span className="text-xl font-serif font-bold tracking-tight text-primary-light">
              BookLibre
            </span>
          </div>
          <ul className="hidden md:flex gap-6 list-none items-center">
            {items.map((item) => (
              <NavItem key={item.to} text={item.text} to={item.to} />
            ))}
          </ul>
        </div>

        <div className="hidden md:flex items-center gap-4">
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

        <div className="flex md:hidden items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-surface rounded border border-accent/20">
            <TrendingUp size={13} className="text-primary-light" />
            <span className="text-primary-light text-xs font-bold">{bibliokarmas}</span>
          </div>
          <div className="w-8 h-8 rounded border border-primary/30 bg-surface-high flex items-center justify-center text-primary-light text-sm font-bold">
            {inicial}
          </div>
          <button
            onClick={() => setMenuMovilAbierto((v) => !v)}
            className="p-1.5 rounded border border-accent/30 text-on-surface-variant hover:text-on-surface hover:bg-surface transition-colors"
            aria-label="Abrir menú"
          >
            {menuMovilAbierto ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuMovilAbierto && (
        <div className="md:hidden border-t border-accent/15 bg-background/95 backdrop-blur-md px-4 py-4 flex flex-col gap-4">
          <ul className="flex flex-col gap-4 list-none">
            {items.map((item) => (
              <NavItem key={item.to} text={item.text} to={item.to} onClick={cerrarMenu} />
            ))}
          </ul>
          <div className="border-t border-accent/15 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
