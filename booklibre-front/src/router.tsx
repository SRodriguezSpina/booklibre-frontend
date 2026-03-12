import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { MainLayoutWrapper } from "./layouts/MainLayoutWrapper"
import { Home } from "./pages/Home"
import { DetallePrestamos } from "./pages/DetallePrestamos"
import { EditarLibro } from "./pages/EditarLibro.tsx"
import { AuthPage } from "./pages/AuthPage"
import { PerfilUsuario } from "./pages/PerfilUsuario"
import { PerfilUsuarioLayout } from "./layouts/PerfilUsuarioLayout"
import { DetalleLibro } from "./pages/DetalleLibro"
import { NotFound } from "./pages/NotFound"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayoutWrapper />}>
          <Route index element={<Navigate to="/home" />} />

          <Route path="home" element={<Home />} />
          <Route path="mis-prestamos" element={<DetallePrestamos />} />
          <Route path="login" element={<AuthPage key="login" mode="login" />} />
          <Route path="register" element={<AuthPage key="register" mode="register" />} />
          <Route path="libros/:id" element={<DetalleLibro />} />

          <Route path="perfil" element={<PerfilUsuarioLayout />}>
            <Route index element={<PerfilUsuario />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
