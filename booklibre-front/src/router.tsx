import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayoutWrapper } from "./layouts/MainLayoutWrapper";
import { Home } from "./pages/Home";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/auth/:mode" element={<AuthForm />} /> */}
        {/* chequeo de autentucación, sino al login */}
        {/* <Route element={<ProtectedLayout />}> */}
            {/* navbar superior */}
            <Route element={<MainLayoutWrapper />}>
                <Route path='/' element={<Home />} />
            </Route>
        {/* </Route> */}
      
      </Routes>
    </BrowserRouter>
  )
}