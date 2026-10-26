import { adminService } from "../services/adminService"
import { graphqlAdminService } from "../services/graphqlAdminService"
import { ConsultaCard } from "../components/ui/ConsultaCard"
import type { UsuarioReservasDevueltasResponse, ReservaAnualUsuarioResponse } from "../models/usuarioModel"
import type {
    EventoActividad,
    PromedioCalificacionTipo,
    SaludCatalogo,
    TasaConversionLibro,
    UsuarioTopBibliokarmas,
} from "../services/graphqlAdminService"
import { useState } from "react"

export const ConsultasAdmin = () => {
    const [usuariosConDevoluciones, setUsuariosConDevoluciones] = useState<UsuarioReservasDevueltasResponse[]>([])
    const [loadingDevoluciones, setLoadingDevoluciones] = useState(false)
    const [errorDevoluciones, setErrorDevoluciones] = useState("")
    const [usuariosConReservas, setUsuariosConReservas] = useState<UsuarioReservasDevueltasResponse[]>([])
    const [cantidadReservas, setCantidadReservas] = useState(3)
    const [loadingReservas, setLoadingReservas] = useState(false)
    const [errorReservas, setErrorReservas] = useState("")
    const [usuarioId, setUsuarioId] = useState(1)
    const [reservasAnuales, setReservasAnuales] = useState<ReservaAnualUsuarioResponse[]>([])
    const [loadingAnuales, setLoadingAnuales] = useState(false)
    const [errorAnuales, setErrorAnuales] = useState("")
    const [tasaConversion, setTasaConversion] = useState<TasaConversionLibro[]>([])
    const [loadingTasaConversion, setLoadingTasaConversion] = useState(false)
    const [errorTasaConversion, setErrorTasaConversion] = useState("")
    const [analisisCalificaciones, setAnalisisCalificaciones] = useState<PromedioCalificacionTipo[]>([])
    const [loadingCalificaciones, setLoadingCalificaciones] = useState(false)
    const [errorCalificaciones, setErrorCalificaciones] = useState("")
    const [saludCatalogo, setSaludCatalogo] = useState<SaludCatalogo | null>(null)
    const [loadingSaludCatalogo, setLoadingSaludCatalogo] = useState(false)
    const [errorSaludCatalogo, setErrorSaludCatalogo] = useState("")
    const [topBibliokarmas, setTopBibliokarmas] = useState<UsuarioTopBibliokarmas[]>([])
    const [loadingTopBibliokarmas, setLoadingTopBibliokarmas] = useState(false)
    const [errorTopBibliokarmas, setErrorTopBibliokarmas] = useState("")
    const [feedActividad, setFeedActividad] = useState<EventoActividad[]>([])
    const [loadingFeedActividad, setLoadingFeedActividad] = useState(false)
    const [errorFeedActividad, setErrorFeedActividad] = useState("")

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

    const consultarTasaConversion = async () => {
        try {
            setLoadingTasaConversion(true)
            setErrorTasaConversion("")
            setTasaConversion(await graphqlAdminService.obtenerTasaConversion())
        } catch (error) {
            setErrorTasaConversion(
                error instanceof Error ? error.message : "No se pudo consultar la tasa de conversión GraphQL."
            )
        } finally {
            setLoadingTasaConversion(false)
        }
    }

    const consultarAnalisisCalificaciones = async () => {
        try {
            setLoadingCalificaciones(true)
            setErrorCalificaciones("")
            setAnalisisCalificaciones(await graphqlAdminService.obtenerAnalisisCalificaciones())
        } catch (error) {
            setErrorCalificaciones(
                error instanceof Error ? error.message : "No se pudo consultar el análisis de calificaciones GraphQL."
            )
        } finally {
            setLoadingCalificaciones(false)
        }
    }

    const consultarSaludCatalogo = async () => {
        try {
            setLoadingSaludCatalogo(true)
            setErrorSaludCatalogo("")
            setSaludCatalogo(await graphqlAdminService.obtenerSaludCatalogo())
        } catch (error) {
            setErrorSaludCatalogo(
                error instanceof Error ? error.message : "No se pudo consultar la salud del catálogo GraphQL."
            )
        } finally {
            setLoadingSaludCatalogo(false)
        }
    }

    const consultarTopBibliokarmas = async () => {
        try {
            setLoadingTopBibliokarmas(true)
            setErrorTopBibliokarmas("")
            setTopBibliokarmas(await graphqlAdminService.obtenerTopBibliokarmas())
        } catch (error) {
            setErrorTopBibliokarmas(
                error instanceof Error ? error.message : "No se pudo consultar el ranking GraphQL."
            )
        } finally {
            setLoadingTopBibliokarmas(false)
        }
    }

    const consultarFeedActividad = async () => {
        try {
            setLoadingFeedActividad(true)
            setErrorFeedActividad("")
            setFeedActividad(await graphqlAdminService.obtenerFeedActividad())
        } catch (error) {
            setErrorFeedActividad(
                error instanceof Error ? error.message : "No se pudo consultar el feed de actividad GraphQL."
            )
        } finally {
            setLoadingFeedActividad(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pt-25 pb-15 animate-in fade-in duration-300">
            <header className="space-y-2">
                <h1 className="text-3xl font-serif font-bold text-on-surface">Consultas de administración</h1>
                <p className="text-sm text-on-surface-variant">
                    Consultas REST y métricas GraphQL disponibles solo para administradores.
                </p>
            </header>
            <section className="space-y-5">
                <h2 className="text-xl font-bold text-primary-light">Consultas REST</h2>
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
            </section>
            <section className="space-y-5">
                <h2 className="text-xl font-bold text-primary-light">Consultas GraphQL</h2>
                <p className="text-sm text-on-surface-variant -mt-3">
                    Cada tarjeta consulta el endpoint GraphQL del backend al presionar “Consultar”.
                </p>
                <ConsultaCard
                    titulo="Tasa de conversión por libro"
                    descripcion="Reservas en relación con los clics registrados."
                    loading={loadingTasaConversion}
                    error={errorTasaConversion}
                    onConsultar={consultarTasaConversion}
                    resultados={tasaConversion}
                    renderResultado={(libro) => (
                        <div className="flex flex-wrap justify-between gap-2">
                            <span className="font-medium">{libro.titulo}</span>
                            <span className="text-sm text-on-surface-variant">
                                {libro.clicks} clics · {libro.reservas} reservas · {(libro.tasaConversion * 100).toFixed(1)}%
                            </span>
                        </div>
                    )}
                />
                <ConsultaCard
                    titulo="Promedio de calificaciones por tipo"
                    descripcion="Promedio de puntuación agrupado por tipo de libro."
                    loading={loadingCalificaciones}
                    error={errorCalificaciones}
                    onConsultar={consultarAnalisisCalificaciones}
                    resultados={analisisCalificaciones}
                    renderResultado={(tipo) => (
                        <div className="flex justify-between gap-2">
                            <span className="font-medium">{tipo.tipoLibro}</span>
                            <span className="text-sm text-on-surface-variant">{tipo.promedioCalificacion.toFixed(2)} / 5</span>
                        </div>
                    )}
                />
                <ConsultaCard
                    titulo="Salud del catálogo"
                    descripcion="Distribución actual de libros activos."
                    loading={loadingSaludCatalogo}
                    error={errorSaludCatalogo}
                    onConsultar={consultarSaludCatalogo}
                    resultados={saludCatalogo ? [saludCatalogo] : []}
                    renderResultado={(salud) => (
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div><dt className="text-on-surface-variant">Total</dt><dd className="font-semibold">{salud.total}</dd></div>
                            <div><dt className="text-on-surface-variant">Prestados</dt><dd className="font-semibold">{salud.prestados}</dd></div>
                            <div><dt className="text-on-surface-variant">Disponibles nunca reservados</dt><dd className="font-semibold">{salud.disponiblesNuncaReservados}</dd></div>
                            <div><dt className="text-on-surface-variant">Reservados a futuro</dt><dd className="font-semibold">{salud.disponiblesReservadosAFuturo}</dd></div>
                            <div><dt className="text-on-surface-variant">Devueltos y disponibles</dt><dd className="font-semibold">{salud.disponiblesDevueltos}</dd></div>
                        </dl>
                    )}
                />
                <ConsultaCard
                    titulo="Top 5 Bibliokarmas"
                    descripcion="Usuarios con mayor puntaje."
                    loading={loadingTopBibliokarmas}
                    error={errorTopBibliokarmas}
                    onConsultar={consultarTopBibliokarmas}
                    resultados={topBibliokarmas}
                    renderResultado={(usuario, index) => (
                        <div className="flex justify-between gap-2">
                            <span className="font-medium">{index + 1}. {usuario.nombre}</span>
                            <span className="text-sm text-on-surface-variant">{usuario.bibliokarma} Bibliokarmas</span>
                        </div>
                    )}
                />
                <ConsultaCard
                    titulo="Feed de actividad reciente"
                    descripcion="Últimos libros agregados y reservas confirmadas."
                    loading={loadingFeedActividad}
                    error={errorFeedActividad}
                    onConsultar={consultarFeedActividad}
                    resultados={feedActividad}
                    renderResultado={(evento) => (
                        <div className="space-y-1">
                            <div className="font-medium">
                                {evento.__typename === "LibroAgregado"
                                    ? `Libro agregado: ${evento.titulo}`
                                    : `Reserva confirmada: ${evento.libroTitulo}`}
                            </div>
                            <div className="text-sm text-on-surface-variant">
                                {evento.__typename === "LibroAgregado"
                                    ? `${evento.autor} · publicado por ${evento.duenioNombre}`
                                    : `Reservado por ${evento.usuarioNombre} · libro #${evento.libroId}`}
                            </div>
                            <time className="text-xs text-on-surface-variant">{evento.fecha}</time>
                        </div>
                    )}
                />
            </section>
        </div>
    )
}