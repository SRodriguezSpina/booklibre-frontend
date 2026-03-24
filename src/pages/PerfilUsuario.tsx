import { useNavigate, useOutletContext } from "react-router-dom"
import { useOnInit } from "../utils/hooks"
import { libroService } from "../services/libroService"
import type { LibroUsuarioItemDTO } from "../models/libroModel"
import { useState } from "react"
import type { ContextoPerfilUsuario } from "../layouts/PerfilUsuarioLayout"
import { Usuario } from "../classes/usuario"
import { PerfilResumen } from "../components/perfil/PerfilResumen"
import { MisDatosCard } from "../components/perfil/MisDatosCard"
import { EstadisticaCard } from "../components/perfil/EstadisticaCard"
import { GestionMisLibros } from "../components/perfil/GestionMisLibros"
import { ModalEditarPerfil } from "../components/perfil/ModalEditarPerfil"
import { usuarioService } from "../services/usuarioService"
import { toast } from "react-toastify"
import { obtenerMensajeError } from "../utils/errorHandler"


export const PerfilUsuario = () => {
  const { usuario, setUsuario } = useOutletContext<ContextoPerfilUsuario>()
  const navigate = useNavigate()
  const [libros, setLibros] = useState<LibroUsuarioItemDTO[]>([])
  const [cargandoLibros, setCargandoLibros] = useState(false)
  const [errorLibros, setErrorLibros] = useState<string | null>(null)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)

  const cargarLibros = async () => {
    setCargandoLibros(true)
    setErrorLibros(null)
    try {
      const response = await libroService.obtenerLibrosUsuarioPerfil(usuario.id)
      setLibros(response)
    } catch (e: unknown) {
      setLibros([])
      const err = obtenerMensajeError(e)
      setErrorLibros(err.mensaje || "No se pudieron cargar tus libros.")
    } finally {
      setCargandoLibros(false)
    }
  }

  useOnInit(cargarLibros)

  const guardarDesdeModal = async (u: Usuario) => {
    try {
      const data = await usuarioService.actualizarUsuario(u)
      const imagenUrl = data.imagenUrl !== undefined ? data.imagenUrl : u.imagenUrl
      const { errors: _, ...uSinErrores } = u
      const nuevo = new Usuario({ ...uSinErrores, ...data, imagenUrl })
      nuevo.errors = {}
      setUsuario(nuevo)
      toast.success("¡Perfil actualizado con éxito!")
    } catch (e: unknown) {
      const err = obtenerMensajeError(e)
      throw e
      toast.error(err.mensaje || "No se pudo actualizar el perfil.")
    }
  }

  const manejarAgregarLibro = () => {
    navigate("/Libros/nuevo/editar")
  }

  const manejarEliminarLibro = async (libroId: number) => {
    try {
      await libroService.eliminarLibro(libroId, usuario.id)
      toast.success("Libro eliminado.")
      await cargarLibros()
    } catch (e: unknown) {
      const err = obtenerMensajeError(e)
      toast.error(err.mensaje || "No se pudo eliminar el libro.")
    }
  }

  const cantidadPrestados = libros.filter((l) => !l.disponible).length

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-20">
      <PerfilResumen
        usuario={usuario}
        onEditar={() => setModalEditarAbierto(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <MisDatosCard usuario={usuario} />

          <div className="grid grid-cols-2 gap-4">
            <EstadisticaCard
              valor={cantidadPrestados}
              etiqueta="Libros Prestados"
            />
            <EstadisticaCard
              valor={libros.length}
              etiqueta="Libros Leídos"
            />
          </div>
        </div>

        <div className="lg:col-span-8">
          <GestionMisLibros
            libros={libros}
            onAgregar={manejarAgregarLibro}
            onEliminar={manejarEliminarLibro}
            cargando={cargandoLibros}
            error={errorLibros}
            onReintentar={() => void cargarLibros()}
          />
        </div>
      </div>

      {modalEditarAbierto && (
        <ModalEditarPerfil
          onClose={() => setModalEditarAbierto(false)}
          usuario={usuario}
          onGuardar={guardarDesdeModal}
        />
      )}
    </div>
  )
}
