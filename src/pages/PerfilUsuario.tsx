import { useNavigate, useOutletContext } from "react-router-dom"
import { libroService } from "../services/libroService"
import type { LibroUsuarioItemDTO } from "../models/libroModel"
import { useEffect, useState } from "react"
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
import { useAuthContext } from "../utils/hooks"

export const PerfilUsuario = () => {
  const { usuario, setUsuario } = useOutletContext<ContextoPerfilUsuario>()
  const { setUsuarioContext } = useAuthContext()
  const navigate = useNavigate()
  const [libros, setLibros] = useState<LibroUsuarioItemDTO[]>([])
  const [cargandoLibros, setCargandoLibros] = useState(false)
  const [errorLibros, setErrorLibros] = useState<string | null>(null)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)

  const esSoloLector = usuario.tipoUsuario === "Lector"
  const esSoloPublicador = usuario.tipoUsuario === "Publicador"

  const cargarLibros = async () => {
    if (usuario.tipoUsuario === "Lector") {
      setErrorLibros(null)
      setCargandoLibros(false)
      return
    }

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

  useEffect(() => {
    let activa = true

    const cargarLibrosSegunTipo = async () => {
      if (usuario.tipoUsuario === "Lector") {
        if (!activa) return
        setErrorLibros(null)
        setCargandoLibros(false)
        return
      }

      if (!activa) return
      setCargandoLibros(true)
      setErrorLibros(null)
      try {
        const response = await libroService.obtenerLibrosUsuarioPerfil(
          usuario.id,
        )
        if (!activa) return
        setLibros(response)
      } catch (e: unknown) {
        if (!activa) return
        setLibros([])
        const err = obtenerMensajeError(e)
        setErrorLibros(err.mensaje || "No se pudieron cargar tus libros.")
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        if (!activa) return
        setCargandoLibros(false)
      }
    }

    void cargarLibrosSegunTipo()

    return () => {
      activa = false
    }
  }, [usuario.id, usuario.tipoUsuario])

  const guardarDesdeModal = async (u: Usuario) => {
    try {
      const data = await usuarioService.actualizarUsuario(u)
      const imagenUrl =
        data.imagenUrl !== undefined ? data.imagenUrl : u.imagenUrl
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { errors: _, ...uSinErrores } = u
      const nuevo = new Usuario({ ...uSinErrores, ...data, imagenUrl })
      nuevo.errors = {}
      setUsuario(nuevo)
      setUsuarioContext(nuevo)
      toast.success("¡Perfil actualizado con éxito!")
    } catch (e: unknown) {
      const err = obtenerMensajeError(e)
      toast.error(err.mensaje || "No se pudo actualizar el perfil.")
      throw e
    }
  }

  const manejarAgregarLibro = () => {
    navigate("/libros/nuevo/editar")
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

  const cantidadPrestados = usuario.reservados
  const cantidadLeidos = usuario.leidos

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-20 animate-in fade-in duration-300">
      <div
        className="animate-in fade-in duration-300"
        style={{ animationDelay: "60ms" }}
      >
        <PerfilResumen
          usuario={usuario}
          onEditar={() => setModalEditarAbierto(true)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-stretch">
        <div
          className={`${esSoloLector ? "lg:col-span-8" : "lg:col-span-4 lg:h-full lg:flex lg:flex-col"} space-y-6 animate-in fade-in duration-300`}
          style={{ animationDelay: "120ms" }}
        >
          <MisDatosCard usuario={usuario} />

          {!esSoloLector && (
            <div
              className={`grid gap-4 lg:flex-1 lg:h-full ${esSoloPublicador ? "grid-cols-1" : "grid-cols-2"}`}
            >
              <EstadisticaCard
                valor={cantidadPrestados}
                etiqueta="Libros Prestados"
                className={`min-h-31 ${esSoloPublicador ? "lg:h-full" : "lg:min-h-0 lg:h-full"}`}
                valorClassName={esSoloPublicador ? "text-6xl" : "text-5xl"}
                etiquetaClassName="text-[10px] tracking-[0.18em] text-on-surface-variant/60"
              />
              {!esSoloPublicador && (
                <EstadisticaCard
                  valor={cantidadLeidos}
                  etiqueta="Libros Leídos"
                  className="min-h-31 lg:min-h-0 lg:h-full"
                  valorClassName="text-5xl"
                  etiquetaClassName="text-[10px] tracking-[0.18em] text-on-surface-variant/60"
                />
              )}
            </div>
          )}
        </div>

        {esSoloLector && (
          <div
            className="lg:col-span-4 animate-in fade-in duration-300 h-full"
            style={{ animationDelay: "160ms" }}
          >
            <div className="h-full">
              <div className="w-full h-full">
                <EstadisticaCard
                  valor={cantidadLeidos}
                  etiqueta="Libros Leídos"
                  className="h-full min-h-60 lg:min-h-0"
                  valorClassName="text-7xl lg:text-8xl"
                  etiquetaClassName="text-[10px] lg:text-xs tracking-[0.2em] text-on-surface-variant/60"
                />
              </div>
            </div>
          </div>
        )}

        {!esSoloLector && (
          <div
            className="lg:col-span-8 animate-in fade-in duration-300 h-full"
            style={{ animationDelay: "160ms" }}
          >
            <GestionMisLibros
              libros={libros}
              onAgregar={manejarAgregarLibro}
              onEliminar={manejarEliminarLibro}
              cargando={cargandoLibros}
              error={errorLibros}
              onReintentar={() => void cargarLibros()}
            />
          </div>
        )}
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
