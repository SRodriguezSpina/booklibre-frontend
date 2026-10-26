const ID_USUARIO_KEY = 'idUsuario'
const NOMBRE_USUARIO_KEY = 'nombreUsuario'
const TIPO_USUARIO_KEY = 'tipoUsuario'

export const tokenService = {
  getIdUsuario(): number | null {
    const id = localStorage.getItem(ID_USUARIO_KEY)
    return id ? Number(id) : null
  },

  setIdUsuario(id: number): void {
    localStorage.setItem(ID_USUARIO_KEY, id.toString())
  },

  setTipoUsuario(tipo: string) : void {
    localStorage.setItem(TIPO_USUARIO_KEY, tipo)
  },

  getTipoUsuario() : string | null {
    return localStorage.getItem(TIPO_USUARIO_KEY)
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
    localStorage.removeItem('token')
    localStorage.removeItem(ID_USUARIO_KEY)
    localStorage.removeItem(NOMBRE_USUARIO_KEY)
    localStorage.removeItem(TIPO_USUARIO_KEY)
  },
}
