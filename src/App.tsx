import { ToastContainer } from "react-toastify"
import { AppRouter } from "./router"

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  )
}

export default App
