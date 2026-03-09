import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayoutWrapper } from './layouts/MainLayoutWrapper'
import { Home } from './pages/Home'
import { MisPrestamos } from './pages/MisPrestamos'
import { PerfilUsuario } from './pages/PerfilUsuario'
import { PerfilUsuarioLayout } from './layouts/PerfilUsuarioLayout'
import { NotFound } from './pages/NotFound'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayoutWrapper />}>
          <Route index element={<Navigate to="/home" />} />

          <Route path="home" element={<Home />} />
          <Route path="prestamos" element={<MisPrestamos />} />

          <Route path="perfil" element={<PerfilUsuarioLayout />}>
            <Route index element={<PerfilUsuario />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}