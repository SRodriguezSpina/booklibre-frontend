import { adminService } from "../services/adminService"
import { ConsultaCard } from "../components/ui/ConsultaCard"
import type { UsuarioReservasDevueltasResponse, ReservaAnualUsuarioResponse } from "../models/usuarioModel"
import type { CantidadColeccionablesResponse, TasaConversionLibroResponse } from "../models/libroModel"
import { useState } from "react"

export const ConsultasAdmin = () => {
    const [usuariosConDevoluciones, setUsuariosConDevoluciones] = useState<UsuarioReservasDevueltasResponse[]>([])
    const [loadingDevoluciones, setLoadingDevoluciones] = useState(false)
    const [errorDevoluciones, setErrorDevoluciones] = useState("")
    //
    const [usuariosConReservas, setUsuariosConReservas] = useState<UsuarioReservasDevueltasResponse[]>([])
    const [cantidadReservas, setCantidadReservas] = useState(3)
    const [loadingReservas, setLoadingReservas] = useState(false)
    const [errorReservas, setErrorReservas] = useState("")
    //
    const [usuarioId, setUsuarioId] = useState(1)
    const [reservasAnuales, setReservasAnuales] = useState<ReservaAnualUsuarioResponse[]>([])
    const [loadingAnuales, setLoadingAnuales] = useState(false)
    const [errorAnuales, setErrorAnuales] = useState("")
    //
    const [loadingColeccionables, setLoadingColeccionables] = useState(false)
    const [errorColeccionables, setErrorColeccionables] = useState("")
    const [cantidadColeccionables, setCantidadColeccionables] = useState<CantidadColeccionablesResponse | null>(null)
    //
    const [librosCumplidas, setLibrosCumplidas] = useState<any[]>([])
    const [loadingCumplidas, setLoadingCumplidas] = useState(false)
    const [errorCumplidas, setErrorCumplidas] = useState("")
    //
    const [librosMejores, setLibrosMejores] = useState<any[]>([])
    const [loadingMejores, setLoadingMejores] = useState(false)
    const [errorMejores, setErrorMejores] = useState("")
    //
    const [librosReservasActivas, setLibrosReservasActivas] = useState<any[]>([])
    const [loadingReservasActivas, setLoadingReservasActivas] = useState(false)
    const [errorReservasActivas, setErrorReservasActivas] = useState("")
    //
    const [tasaConversion, setTasaConversion] = useState<TasaConversionLibroResponse[]>([])
    const [loadingTasaConversion, setLoadingTasaConversion] = useState(false)
    const [errorTasaConversion, setErrorTasaConversion] = useState("")

    const consultarUsuariosConDevoluciones = async () => {
        try {
            setLoadingDevoluciones(true)
            setErrorDevoluciones("")

            const data =
                await adminService.obtenerUsuariosConMasDe2Devoluciones()
            setUsuariosConDevoluciones(data)

        } catch {
            setErrorDevoluciones(
                "No se pudo realizar la consulta"
            )
        } finally {
            setLoadingDevoluciones(false)
        }
    }

    const consultarUsuariosConMasReservas = async () => {
        try {
            setLoadingReservas(true)
            setErrorReservas("")

            const data =
                await adminService.obtenerUsuariosConMasDeNReservas(
                    cantidadReservas
                )
            setUsuariosConReservas(data)

        } catch {
            setErrorReservas(
                "No se pudo realizar la consulta"
            )
        } finally {
            setLoadingReservas(false)
        }
    }

    const consultarReservasAnuales = async () => {
        try {
            setLoadingAnuales(true)
            setErrorAnuales("")

            const data =
                await adminService.obtenerReservasAnualesUsuario(usuarioId)
            setReservasAnuales(data)

        } catch {
            setErrorAnuales(
                "No se pudo realizar la consulta"
            )
        } finally {
            setLoadingAnuales(false)
        }
    }

    const consultarLibrosColeccionables = async () => {
        try {
            setLoadingColeccionables(true)
            setErrorColeccionables("")

            const data = await adminService.obtenerLibrosColeccionables()

            setCantidadColeccionables(data)
        } catch {
            setErrorColeccionables("No se pudo realizar la consulta")
        } finally {
            setLoadingColeccionables(false)
        }
    }

    const consultarLibrosCumplidas = async () => {
        try {
            setLoadingCumplidas(true)
            setErrorCumplidas("")

            const data = await adminService.obtenerLibrosConReservasCumplidas()
            setLibrosCumplidas(data)
        } catch {
            setErrorCumplidas("No se pudo realizar la consulta")
        } finally {
            setLoadingCumplidas(false)
        }
    }

    const consultarLibrosMejores = async () => {
        try {
            setLoadingMejores(true)
            setErrorMejores("")

            const data = await adminService.obtenerLibrosMejorCalificados()
            setLibrosMejores(data)
        } catch {
            setErrorMejores("No se pudo realizar la consulta")
        } finally {
            setLoadingMejores(false)
        }
    }

    const consultarLibrosReservasActivas = async () => {
        try {
            setLoadingReservasActivas(true)
            setErrorReservasActivas("")

            const data = await adminService.obtenerLibrosConReservasActivas(3)
            setLibrosReservasActivas(data)
        } catch {
            setErrorReservasActivas("No se pudo realizar la consulta")
        } finally {
            setLoadingReservasActivas(false)
        }
    }

    const consultarTasaConversion = async () => {
        try {
            setLoadingTasaConversion(true)
            setErrorTasaConversion("")

            const data = await adminService.obtenerTasaConversion()
            setTasaConversion(data)
        } catch {
            setErrorTasaConversion("No se pudo realizar la consulta")
        } finally {
            setLoadingTasaConversion(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pt-20 animate-in fade-in duration-300 pt-25 pb-15">
            <ConsultaCard
                titulo="Usuarios con más de 2 reservas hechas"
                descripcion=""

                loading={loadingDevoluciones}
                error={errorDevoluciones}

                onConsultar={consultarUsuariosConDevoluciones}

                resultados={usuariosConDevoluciones}

                renderResultado={(usuario) => (
                    <div className="flex justify-between items-center">
                        <span className="font-medium">
                            {usuario.usuarioNombre}
                        </span>

                        <span className="text-sm text-on-surface-variant">
                            {usuario.cantidadReservasDevueltas} devoluciones
                        </span>
                    </div>
                )}
            />
            <ConsultaCard
                titulo="Usuarios con más de N reservas hechas"
                descripcion="Búsqueda bajo parámetro."

                loading={loadingReservas}
                error={errorReservas}

                onConsultar={consultarUsuariosConMasReservas}

                resultados={usuariosConReservas}

                renderResultado={(usuario) => (
                    <div className="flex justify-between items-center">
                        <span className="font-medium">
                            {usuario.usuarioNombre}
                        </span>

                        <span className="text-sm text-on-surface-variant">
                            {usuario.cantidadReservasDevueltas} reservas
                        </span>
                    </div>
                )}
            >

                <input
                    type="number"
                    value={cantidadReservas}
                    min={1}
                    onChange={(e) =>
                        setCantidadReservas(Number(e.target.value))
                    }
                    className="w-32 px-3 py-2 rounded-xl border border-accent/20 bg-background text-on-surface outline-none focus:ring-2 focus:ring-primary-light/30" />

            </ConsultaCard>
            <ConsultaCard
                titulo="Reservas anuales"
                descripcion="Muestra las reservas históricas por ID de ssuario."

                loading={loadingAnuales}
                error={errorAnuales}

                onConsultar={consultarReservasAnuales}

                resultados={reservasAnuales}

                renderResultado={(reserva) => (
                    <div className="flex flex-col gap-1">

                        <span className="font-semibold">
                            {reserva.libroTitulo}
                        </span>

                        <span className="text-sm text-on-surface-variant">
                            {reserva.libroAutor}
                        </span>

                        <span className="text-xs text-on-surface-variant">
                            {reserva.fechaDesde} → {reserva.fechaHasta}
                        </span>

                    </div>
                )}
            >

                <input
                    type="number"
                    value={usuarioId}
                    min={1}
                    onChange={(e) =>
                        setUsuarioId(Number(e.target.value))
                    }
                    className="w-32 px-3 py-2 rounded-xl border border-accent/20 bg-background"
                />

            </ConsultaCard>

            <ConsultaCard<CantidadColeccionablesResponse>
                titulo="Cantidad de libros 'Coleccionables'"
                descripcion=""
                loading={loadingColeccionables}
                error={errorColeccionables}
                onConsultar={consultarLibrosColeccionables}
                resultados={cantidadColeccionables ? [cantidadColeccionables] : []}
                renderResultado={(resultado) => (
                    <div>
                        Cantidad: {resultado.cantidad}
                    </div>
                )}
            />

            <ConsultaCard
                titulo="Libros con todas las reservas cumplidas"
                descripcion="Muestra los libros cuyas reservas ya han sido cumplidas."
                loading={loadingCumplidas}
                error={errorCumplidas}
                onConsultar={consultarLibrosCumplidas}
                resultados={librosCumplidas}
                renderResultado={(libro) => (
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">
                            {libro.titulo}
                        </span>
                        <span className="text-sm text-on-surface-variant">
                            {libro.autor}
                        </span>
                    </div>
                )}
            />

            <ConsultaCard
                titulo="Libros Destacados"
                descripcion="Saber qué libros tienen más de 4 puntos de calificación."
                loading={loadingMejores}
                error={errorMejores}
                onConsultar={consultarLibrosMejores}
                resultados={librosMejores}
                renderResultado={(libro) => (
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold">
                                {libro.titulo}
                            </span>
                            <span className="text-sm text-on-surface-variant">
                                {libro.autor}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                            ⭐ {libro.calificacion}
                        </div>
                    </div>
                )}
            />

            <ConsultaCard
                titulo="Libros con Reservas Activas"
                descripcion="Saber qué libros tienen al menos 3 reservas activas."
                loading={loadingReservasActivas}
                error={errorReservasActivas}
                onConsultar={consultarLibrosReservasActivas}
                resultados={librosReservasActivas}
                renderResultado={(libro) => (
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold">
                                {libro.titulo}
                            </span>
                            <span className="text-sm text-on-surface-variant">
                                {libro.autor}
                            </span>
                        </div>
                    </div>
                )}
            />

            <ConsultaCard<TasaConversionLibroResponse>
                titulo="Tasa de Conversión (Clicks vs. Reservas) [GraphQL]"
                descripcion="Muestra el top 5 de libros más clickeados en Redis y su tasa de conversión basada en reservas en PostgreSQL."
                loading={loadingTasaConversion}
                error={errorTasaConversion}
                onConsultar={consultarTasaConversion}
                resultados={tasaConversion}
                mensajeVacio="No hay libros clickeados"
                renderResultado={(res) => (
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center w-full">
                            <span className="font-semibold">{res.titulo}</span>
                            <span className="text-sm font-bold text-accent">
                                {(res.tasaConversion * 100).toFixed(1)}% tasa
                            </span>
                        </div>
                        <div className="flex gap-4 text-xs text-on-surface-variant">
                            <span>Clicks: {res.clicks}</span>
                            <span>Reservas: {res.reservas}</span>
                        </div>
                    </div>
                )}
            />
        </div >
    )
}