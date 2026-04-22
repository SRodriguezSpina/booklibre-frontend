const TOKEN_KEY = 'token'
const ID_USUARIO_KEY = 'idUsuario'
const NOMBRE_USUARIO_KEY = 'nombreUsuario'

export const tokenService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  getIdUsuario(): number | null {
    const id = localStorage.getItem(ID_USUARIO_KEY)
    return id ? Number(id) : null
  },

  setIdUsuario(id: number): void {
    localStorage.setItem(ID_USUARIO_KEY, id.toString())
  },

  getNombreUsuario(): string | null {
    return localStorage.getItem(NOMBRE_USUARIO_KEY)
  },

  setNombreUsuario(nombre: string): void {
    localStorage.setItem(NOMBRE_USUARIO_KEY, nombre)
  },

  estaAutenticado(): boolean {
    return tokenService.getIdUsuario() !== null
  },

  clearAll(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ID_USUARIO_KEY)
    localStorage.removeItem(NOMBRE_USUARIO_KEY)
  },
}
