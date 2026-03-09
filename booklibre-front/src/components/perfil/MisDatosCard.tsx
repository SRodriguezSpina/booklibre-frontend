import { Card, CardHeader } from '../ui'
import type { Usuario } from '../../models/usuarioModel'

export type PropsMisDatosCard = {
  usuario: Usuario
}

export const MisDatosCard = ({ usuario }: PropsMisDatosCard) => {
  return (
    <Card className="bg-surface">
      <CardHeader titulo="Mis Datos" />

      <div className="space-y-4">
        <div>
          <div className="text-xs font-semibold text-secondary/60">EMAIL</div>
          <div className="text-sm text-secondary">{usuario.email}</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-secondary/60">TELÉFONO</div>
          <div className="text-sm text-secondary">{usuario.telefono}</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-secondary/60">TIPO DE PERFIL</div>
          <div className="text-sm text-secondary">{usuario.tipoPerfil}</div>
        </div>
      </div>
    </Card>
  )
}

