import { Card, CardHeader } from '../ui'
import type { Usuario } from '../../classes/usuario'

export type PropsMisDatosCard = {
  usuario: Usuario
}

const etiquetaTipo = (t: Usuario['tipoUsuario']) =>
  t === 'LectorPublicador' ? 'Lector & Publicador' : t

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
          <div className="text-xs font-semibold text-secondary/60">CELULAR</div>
          <div className="text-sm text-secondary">{usuario.celular}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-secondary/60">CIUDAD</div>
          <div className="text-sm text-secondary">{usuario.ciudad}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-secondary/60">TIPO DE USUARIO</div>
          <div className="text-sm text-secondary">{etiquetaTipo(usuario.tipoUsuario)}</div>
        </div>
      </div>
    </Card>
  )
}
