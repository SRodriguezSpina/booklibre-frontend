export type RegisterData = {
    nombre: string,
    email: string,
    usuario: string,
    password: string,
    confirmarPassword: string
    ciudad: string,
    celular: string
}

export type LoginData = {
    usuario: string,
    password: string
}

export type AuthResponseUsuario = {
    success: boolean,
    message: string,
    usuario: InfoUsuarioResponse
}

export type InfoUsuarioResponse = {
    id: number,
    nombre: string,
    email: string,
    usuario: string,
    ciudad: string,
    celular: string
}