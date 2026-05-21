import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AppRouter } from "./router"

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
      />
    </>
  )
}

export default App
