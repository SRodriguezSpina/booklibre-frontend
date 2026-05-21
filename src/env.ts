const BASE = import.meta.env.VITE_API_URL
export const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8080/api'
  : (typeof BASE === 'string' && BASE !== '' ? BASE : 'http://localhost:8080/api')

const AUTH_PREFIX = import.meta.env.VITE_AUTH_PATH ?? ''
export const AUTH_PATH = (path: string) =>
  AUTH_PREFIX ? `/${AUTH_PREFIX}/${path}` : `/${path}`
