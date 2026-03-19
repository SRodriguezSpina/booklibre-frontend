//Calcula la diferencia en días entre dos fechas (formato YYYY-MM-DD).
export const calcularDiferenciaDias = (fechaDesde: string, fechaHasta: string): number => {
  if (!fechaDesde || !fechaHasta) return 0
  
  const inicio = new Date(fechaDesde)
  const fin = new Date(fechaHasta)
  
  const diffTime = fin.getTime() - inicio.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays > 0 ? diffDays : 0
}

//Devuelve la fecha actual en formato YYYY-MM-DD para usar en inputs de HTML.
export const obtenerFechaHoy = (): string => {
  return new Date().toISOString().split("T")[0]
}

// Formatea una fecha string (YYYY-MM-DD) a un formato visual amigable.
export const formatearFechaVisual = (fechaStr: string): string => {
  if (!fechaStr) return "-"
  const fecha = new Date(fechaStr + "T12:00:00")
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}