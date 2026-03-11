const BASE = import.meta.env.VITE_API_URL
export const API_BASE_URL = typeof BASE === 'string' && BASE !== '' ? BASE : 'http://localhost:8080'
