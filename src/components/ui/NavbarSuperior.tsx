import { NavLink } from "react-router-dom"
import navBarLogo from "../../assets/icons/booklibre-logo.svg" // Asegúrate de tener este logo en tu carpeta de assets

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
          `px-4 py-3 border-b font-medium transition-colors duration-200 ${
            isActive
              ? "text-primary border-primary"
              : "text-secondary border-transparent hover:text-primary"
          }`
        }
      >
        {text}
      </NavLink>
    </li>
  )
}

export const NavbarSuperior = () => {
  const items: NavItemProps[] = [
    { text: "Inicio", to: "/home" },
    { text: "Mis Préstamos", to: "/mis-prestamos" },
    { text: "Perfil", to: "/perfil" },
  ]

  return (
    <section className="bg-surface border-b">
      <nav className="h-16 w-full flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="w-8 h-8 bg-primary rounded">
            <img src={navBarLogo} alt="BookLibre" />
          </div>
          <ul className="flex gap-10 list-none">
            {items.map((item) => (
              <NavItem key={item.to} text={item.text} to={item.to} />
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 text-sm text-secondary">
          <span>120 pnts</span>
        </div>
      </nav>
    </section>
  )
}
