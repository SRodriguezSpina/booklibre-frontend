import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

import { authService } from '../../services/AuthService'

const TOKEN_MOCK = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqdWFuQG1haWwuY29tIn0.abc'

const usuarioMock = {
  id: 1,
  nombre: 'Juan Pérez',
  email: 'juan@mail.com',
  desc: '',
  celular: '',
  ciudad: '',
  tipoUsuario: 'Lector',
  bibliokarmas: 0,
}

describe('AuthService - login', () => {

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('guarda idUsuario en localStorage tras login exitoso', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, message: 'Login exitoso', usuario: usuarioMock }
    })

    await authService.login({ email: 'juan@mail.com', password: '123' })

    expect(localStorage.getItem('idUsuario')).toBe('1')
  })

  it('guarda nombreUsuario en localStorage tras login exitoso', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, message: 'Login exitoso', usuario: usuarioMock }
    })

    await authService.login({ email: 'juan@mail.com', password: '123' })

    expect(localStorage.getItem('nombreUsuario')).toBe('Juan Pérez')
  })

  it('no guarda credenciales en localStorage tras login exitoso', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true, message: 'Login exitoso', usuario: usuarioMock } })
    await authService.login({ email: 'juan@mail.com', password: '123' })

    expect(localStorage.getItem('token')).toBeNull()
  })

  it('retorna los datos del response correctamente', async () => {
    const responseMock = { success: true, message: 'Login exitoso', usuario: usuarioMock }
    mockedAxios.post.mockResolvedValueOnce({ data: responseMock })

    const result = await authService.login({ email: 'juan@mail.com', password: '123' })

    expect(result).toEqual(responseMock)
  })

  it('no guarda nada en localStorage si success es false', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: false, message: 'Credenciales inválidas', usuario: null }
    })

    await authService.login({ email: 'juan@mail.com', password: 'wrong' })

    expect(localStorage.getItem('idUsuario')).toBeNull()
    expect(localStorage.getItem('nombreUsuario')).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('lanza el error si axios falla', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'))

    await expect(
      authService.login({ email: 'juan@mail.com', password: '123' })
    ).rejects.toThrow('Network Error')
  })

  it('llama al endpoint correcto', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, usuario: usuarioMock }
    })

    await authService.login({ email: 'juan@mail.com', password: '123' })

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/login'),
      { email: 'juan@mail.com', password: '123' },
      { withCredentials: true },
    )
  })
})

describe('AuthService - registro', () => {

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('retorna el response del servidor', async () => {
    const responseMock = { success: true, message: 'Registro exitoso', usuario: usuarioMock }
    mockedAxios.post.mockResolvedValueOnce({ data: responseMock })

    const result = await authService.registro({
      nombre: 'Juan',
      email: 'juan@mail.com',
      password: '123456',
      confirmarPassword: '123456',
    })

    expect(result).toEqual(responseMock)
  })

  it('no guarda credenciales en localStorage al registrarse', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true, usuario: usuarioMock } })
    await authService.registro({
      nombre: 'Juan',
      email: 'juan@mail.com',
      password: '123456',
      confirmarPassword: '123456',
    })

    expect(localStorage.getItem('token')).toBeNull()
  })

  it('no guarda idUsuario en localStorage al registrarse', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, usuario: usuarioMock }
    })

    await authService.registro({
      nombre: 'Juan',
      email: 'juan@mail.com',
      password: '123456',
      confirmarPassword: '123456',
    })

    expect(localStorage.getItem('idUsuario')).toBeNull()
  })

  it('llama al endpoint correcto', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } })

    await authService.registro({
      nombre: 'Juan', email: 'juan@mail.com',
      password: '123456', confirmarPassword: '123456',
    })

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/register'),
      expect.objectContaining({ email: 'juan@mail.com' }),
      { withCredentials: true },
    )
  })
})

describe('AuthService - logout', () => {

  it('elimina idUsuario del localStorage', async () => {
    localStorage.setItem('idUsuario', '1')
    mockedAxios.post.mockResolvedValueOnce({})
    await authService.logout()
    expect(localStorage.getItem('idUsuario')).toBeNull()
  })

  it('elimina nombreUsuario del localStorage', async () => {
    localStorage.setItem('nombreUsuario', 'Juan')
    mockedAxios.post.mockResolvedValueOnce({})
    await authService.logout()
    expect(localStorage.getItem('nombreUsuario')).toBeNull()
  })

  it('elimina cualquier token legacy del localStorage', async () => {
    localStorage.setItem('token', TOKEN_MOCK)
    mockedAxios.post.mockResolvedValueOnce({})
    await authService.logout()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('llama al endpoint de logout enviando las cookies', async () => {
    mockedAxios.post.mockResolvedValueOnce({})
    await authService.logout()
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/logout'),
      {},
      { withCredentials: true },
    )
  })

  it('limpia la sesión local incluso si falla el logout remoto', async () => {
    localStorage.setItem('idUsuario', '1')
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'))
    await expect(authService.logout()).rejects.toThrow('Network Error')
    expect(localStorage.getItem('idUsuario')).toBeNull()
  })
})

describe('AuthService - helpers de sesión', () => {

  beforeEach(() => localStorage.clear())

  it('obtenerIdUsuarioActual retorna el id si existe', () => {
    localStorage.setItem('idUsuario', '42')
    expect(authService.obtenerIdUsuarioActual()).toBe(42)
  })

  it('obtenerIdUsuarioActual retorna null si no hay sesión', () => {
    expect(authService.obtenerIdUsuarioActual()).toBeNull()
  })

  it('obtenerNombreUsuarioActual retorna el nombre si existe', () => {
    localStorage.setItem('nombreUsuario', 'Ana')
    expect(authService.obtenerNombreUsuarioActual()).toBe('Ana')
  })

  it('obtenerNombreUsuarioActual retorna null si no hay sesión', () => {
    expect(authService.obtenerNombreUsuarioActual()).toBeNull()
  })

  it('estaAutenticado retorna true si hay id en localStorage', () => {
    localStorage.setItem('idUsuario', '1')
    expect(authService.estaAutenticado()).toBe(true)
  })

  it('estaAutenticado retorna false si no hay id en localStorage', () => {
    expect(authService.estaAutenticado()).toBe(false)
  })

})

describe('AuthService - manejarError', () => {

  it('retorna el mensaje del backend si hay response con message', () => {
    const axiosError = {
      isAxiosError: true,
      response: { data: { message: 'Usuario o contraseña incorrectos' } },
      request: undefined,
    }
    vi.spyOn(axios, 'isAxiosError').mockReturnValueOnce(true)

    const mensaje = authService.manejarError(axiosError)
    expect(mensaje).toBe('Usuario o contraseña incorrectos')
  })

  it('retorna mensaje de red si no hay response pero sí request', () => {
    const axiosError = {
      isAxiosError: true,
      response: undefined,
      request: {},
    }
    vi.spyOn(axios, 'isAxiosError').mockReturnValueOnce(true)

    const mensaje = authService.manejarError(axiosError)
    expect(mensaje).toBe('No se pudo conectar con el servidor. Intentá más tarde.')
  })

  it('retorna mensaje genérico para errores desconocidos', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValueOnce(false)
    const mensaje = authService.manejarError(new Error('algo raro'))
    expect(mensaje).toBe('Ocurrió un error inesperado.')
  })
})
