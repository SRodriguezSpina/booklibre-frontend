import { apiClient } from "./apiClient"

export type TasaConversionLibro = {
  libroId: number
  titulo: string
  clicks: number
  reservas: number
  tasaConversion: number
}

export type PromedioCalificacionTipo = {
  tipoLibro: string
  promedioCalificacion: number
}

export type SaludCatalogo = {
  total: number
  prestados: number
  disponiblesNuncaReservados: number
  disponiblesReservadosAFuturo: number
  disponiblesDevueltos: number
}

export type UsuarioTopBibliokarmas = {
  id: number
  nombre: string
  bibliokarma: number
}

export type LibroAgregado = {
  __typename: "LibroAgregado"
  libroId: number
  titulo: string
  autor: string
  duenioNombre: string
  fecha: string
  tipoEvento: string
}

export type ReservaConfirmada = {
  __typename: "ReservaConfirmada"
  reservaId: number
  libroId: number
  libroTitulo: string
  usuarioId: number
  usuarioNombre: string
  fecha: string
  tipoEvento: string
}

export type EventoActividad = LibroAgregado | ReservaConfirmada

type GraphQLResponse<T> = {
  data?: T
  errors?: { message: string }[]
}

async function consultarGraphQL<T>(query: string): Promise<T> {
  const response = await apiClient.post<GraphQLResponse<T>>("/graphql", { query })
  const { data, errors } = response.data

  if (errors?.length) {
    throw new Error(errors.map(({ message }) => message).join("; "))
  }
  if (!data) {
    throw new Error("La respuesta GraphQL no contiene datos.")
  }

  return data
}

export const graphqlAdminService = {
  async obtenerTasaConversion(): Promise<TasaConversionLibro[]> {
    const data = await consultarGraphQL<{ tasaConversion: TasaConversionLibro[] }>(`
      query TasaConversion {
        tasaConversion {
          libroId
          titulo
          clicks
          reservas
          tasaConversion
        }
      }
    `)
    return data.tasaConversion
  },

  async obtenerAnalisisCalificaciones(): Promise<PromedioCalificacionTipo[]> {
    const data = await consultarGraphQL<{ analisisCalificaciones: PromedioCalificacionTipo[] }>(`
      query AnalisisCalificaciones {
        analisisCalificaciones {
          tipoLibro
          promedioCalificacion
        }
      }
    `)
    return data.analisisCalificaciones
  },

  async obtenerSaludCatalogo(): Promise<SaludCatalogo> {
    const data = await consultarGraphQL<{ saludCatalogo: SaludCatalogo }>(`
      query SaludCatalogo {
        saludCatalogo {
          total
          prestados
          disponiblesNuncaReservados
          disponiblesReservadosAFuturo
          disponiblesDevueltos
        }
      }
    `)
    return data.saludCatalogo
  },

  async obtenerTopBibliokarmas(): Promise<UsuarioTopBibliokarmas[]> {
    const data = await consultarGraphQL<{ topBibliokarmas: UsuarioTopBibliokarmas[] }>(`
      query TopBibliokarmas {
        topBibliokarmas {
          id
          nombre
          bibliokarma
        }
      }
    `)
    return data.topBibliokarmas
  },

  async obtenerFeedActividad(): Promise<EventoActividad[]> {
    const data = await consultarGraphQL<{ feedActividad: EventoActividad[] }>(`
      query FeedActividad {
        feedActividad {
          __typename
          fecha
          tipoEvento
          ... on LibroAgregado {
            libroId
            titulo
            autor
            duenioNombre
          }
          ... on ReservaConfirmada {
            reservaId
            libroId
            libroTitulo
            usuarioId
            usuarioNombre
          }
        }
      }
    `)
    return data.feedActividad
  },
}
