import { Outlet } from 'react-router-dom'
import { NavbarSuperior } from '../components/NavbarSuperior'

export function MainLayoutWrapper() {
  return (
    <div className="min-h-screen">
      <NavbarSuperior />
      <main>
        <Outlet />
      </main>
    </div>
  )
}