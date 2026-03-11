import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { MainLayoutWrapper } from "./layouts/MainLayoutWrapper"
import { Home } from "./pages/Home"
import { DetallePrestamos } from "./pages/DetallePrestamos"
import { AuthPage } from "./pages/AuthPage.tsx"


export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/auth/:mode" element={<AuthForm />} /> */}
        {/* chequeo de autentucación, sino al login */}
        {/* <Route element={<ProtectedLayout />}> */}
        {/* navbar superior */}
        <Route element={<MainLayoutWrapper />}>
          <Route index element={<Navigate to="/home" />} />

          <Route path="home" element={<Home />} />
          <Route path="mis-prestamos" element={<DetallePrestamos />} />
          <Route path="login"    element={<AuthPage key="login" mode="login" />} />
          <Route path="register" element={<AuthPage key="register" mode="register" />} />
          {/* <Route path='perfil' element={<Perfil />} /> */}
        </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  )
}
