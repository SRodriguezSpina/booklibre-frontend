//Calcula la diferencia en días entre dos fechas (formato YYYY-MM-DD).
export const calcularDiferenciaDias = (fechaDesde: string, fechaHasta: string): number => {
  if (!fechaDesde || !fechaHasta) return 0
  
  const inicio = new Date(fechaDesde + "T12:00:00")
  const fin = new Date(fechaHasta + "T12:00:00")
  
  const diffTime = fin.getTime() - inicio.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays >= 0 ? diffDays + 1 : 0 
}

//Devuelve la fecha actual en formato YYYY-MM-DD para usar en inputs de HTML.
export const obtenerFechaHoy = (): string => {
  const hoy = new Date()
  // Ajustamos el offset para que el ISO string coincida con nuestra hora local
  const offset = hoy.getTimezoneOffset() * 60000
  const fechaLocal = new Date(hoy.getTime() - offset)
  return fechaLocal.toISOString().split("T")[0]
}

// Formatea una fecha string (YYYY-MM-DD) a un formato visual amigable.
export const formatearFechaVisual = (fechaStr: string): string => {
  if (!fechaStr) return "-"
  const fecha = new Date(fechaStr + "T12:00:00")
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}