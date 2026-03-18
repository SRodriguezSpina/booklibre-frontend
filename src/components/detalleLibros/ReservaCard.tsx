import { Card, CardHeader } from "../ui/Card";
import { Boton } from "../ui/Boton"

export const TarjetaReserva = () => {
  return (
    <Card className="p-6">
      <CardHeader 
        titulo="Tu Reserva" 
        className="text-lg text-secondary-dark"
        icono={
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />

      <div className="mb-4">
        <label className="text-xs font-bold text-secondary uppercase opacity-70 mb-2 block">
          Fechas Seleccionadas:
        </label>
        <div className="bg-background rounded-md p-3 text-sm border border-accent flex items-center">
          <span>24 Oct - 07 Nov, 2023</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm mb-3">
        <span className="text-secondary opacity-80">Recogida</span>
        <span className="font-bold">24 Oct, 2023</span>
      </div>
      <div className="flex justify-between items-center text-sm mb-4">
        <span className="text-secondary opacity-80">Devolución</span>
        <span className="font-bold">07 Nov, 2023</span>
      </div>

      <div className="flex justify-between items-center text-sm mb-6 bg-blue-50 p-3 rounded-lg text-blue-600 font-medium">
        <span>Duración</span>
        <span>14 Días</span>
      </div>

      <Boton 
        tipo="primario" 
        className="w-full py-3 rounded-xl shadow-sm"
        deshabilitado={true}
        onClick={() => console.log("Iniciando reserva...")}
      >
        Confirmar Reserva
      </Boton>

      <p className="text-xs text-center text-secondary opacity-60 mt-3 px-4">
        Con la reserva no se encontrará disponible en el rango de fechas
      </p>

    </Card>
  )
}