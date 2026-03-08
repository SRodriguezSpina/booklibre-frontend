import { NavLink } from 'react-router-dom'
import navBarLogo from 'src/assets/icons/booklibre-logo.svg'

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
                    `px-3 py-2 transition-colors ${isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-500 hover:text-primary"}`}>
                {text}
            </NavLink>
        </li>
    )
}

export const NavbarSuperior = () => {
    const items: NavItemProps[] = [
        { text: 'Inicio', to: '/home' },
        { text: 'Mis préstamos', to: '/' },
        { text: 'Perfil', to: '/perfil' }
    ]

    return (
        <section className="flex justify-center bg-surface">
            {/* acá el logo del programita */}
            <nav className="fixed top-0 h-18 bg-surface max-w-2x1 w-full">
                <ul className="flex gap-x-10 items-center pb-2 pt-4">
                    {items.map(item => (
                        <NavItem
                            key={item.to}
                            text={item.text}
                            to={item.to}
                        />
                    ))}
                </ul>
            </nav>
        </section>
    )
}