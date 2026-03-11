import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { MainLayoutWrapper } from "./layouts/MainLayoutWrapper"
import { Home } from "./pages/Home"
import { DetallePrestamos } from "./pages/DetallePrestamos"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"


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
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* <Route path='perfil' element={<Perfil />} /> */}
        </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  )
}
