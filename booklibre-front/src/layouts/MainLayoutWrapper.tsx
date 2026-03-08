import { Outlet } from 'react-router-dom'
import { NavbarSuperior } from '../components/NavbarSuperior'

export function MainLayoutWrapper() {
    return (
        <>
            <NavbarSuperior/>
            <Outlet/>
        </>
    )
}