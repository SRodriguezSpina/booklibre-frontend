import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../../services/apiClient", () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

import { apiClient } from "../../services/apiClient"

const mockedApiClient = vi.mocked(apiClient, true)

import { adminService } from "../../services/adminService"

describe("adminService - obtenerAnalisisCalificaciones", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("envia la consulta GraphQL correcta y devuelve el analisis de calificaciones", async () => {
    const analisisCalificaciones = [
      { tipoLibro: "Comun", promedioCalificacion: 4.25 },
      { tipoLibro: "Coleccionable", promedioCalificacion: 3.8 },
    ]

    mockedApiClient.post.mockResolvedValueOnce({
      data: { data: { analisisCalificaciones } },
    } as any)

    const result = await adminService.obtenerAnalisisCalificaciones()

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/graphql",
      expect.objectContaining({
        query: expect.stringContaining("analisisCalificaciones"),
      }),
    )
    const body = mockedApiClient.post.mock.calls[0][1] as { query: string }
    expect(body.query).toContain("tipoLibro")
    expect(body.query).toContain(
      "promedioCalificacion",
    )
    expect(result).toEqual(analisisCalificaciones)
  })
})
