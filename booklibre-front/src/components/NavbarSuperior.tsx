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
        { text: 'Mis Préstamos', to: '/' },
        { text: 'Perfil', to: '/perfil' }
    ]

    return (
        <section className="flex justify-center bg-surface border-b">
            {/* acá el logo del programita */}
            <div className="bg-red-500 p-10">
                test
            </div>
            <nav className="h-16 max-w-2xl w-full">
                <ul className="flex gap-10 list-none">
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