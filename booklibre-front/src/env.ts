const BASE = import.meta.env.VITE_API_URL
export const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (typeof BASE === 'string' && BASE !== '' ? BASE : 'http://localhost:8080')

const AUTH_PREFIX = import.meta.env.VITE_AUTH_PATH ?? ''
export const AUTH_PATH = (path: string) =>
  AUTH_PREFIX ? `/${AUTH_PREFIX}/${path}` : `/${path}`
