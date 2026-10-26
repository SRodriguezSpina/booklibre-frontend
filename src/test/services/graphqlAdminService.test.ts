import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../../services/apiClient", () => ({
  apiClient: { post: vi.fn() },
}))

import { apiClient } from "../../services/apiClient"
import { graphqlAdminService } from "../../services/graphqlAdminService"

const mockedPost = vi.mocked(apiClient.post)

describe("graphqlAdminService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("envía la consulta GraphQL y devuelve los datos", async () => {
    const data = {
      tasaConversion: [{
        libroId: 1,
        titulo: "1984",
        clicks: 12,
        reservas: 3,
        tasaConversion: 0.25,
      }],
    }
    mockedPost.mockResolvedValueOnce({ data: { data } } as never)

    await expect(graphqlAdminService.obtenerTasaConversion()).resolves.toEqual(data.tasaConversion)
    expect(mockedPost).toHaveBeenCalledWith(
      "/graphql",
      expect.objectContaining({ query: expect.stringContaining("tasaConversion") }),
    )
  })

  it("propaga los errores GraphQL para que la interfaz pueda mostrarlos", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { errors: [{ message: "Acceso denegado" }] },
    } as never)

    await expect(graphqlAdminService.obtenerSaludCatalogo()).rejects.toThrow("Acceso denegado")
  })
})
