import { User } from 'lucide-react'
import { Card } from '../ui'
import type { Usuario } from '../../classes/usuario'

export type PropsMisDatosCard = {
  usuario: Usuario
}

const etiquetaTipo = (t: Usuario['tipoUsuario']) =>
  t === 'LectorPublicador' ? 'Lector & Publicador' : t

export const MisDatosCard = ({ usuario }: PropsMisDatosCard) => {
  return (
    <Card className="bg-surface/60 border border-white/60 shadow-[0_18px_40px_rgba(15,23,42,0.08)] rounded-3xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.14)]">
      <div className="flex items-center gap-3 px-5 pt-5">
        <div className="h-9 w-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <User className="h-4.5 w-4.5" />
        </div>
        <h3 className="text-xl font-bold text-secondary">Mis Datos</h3>
      </div>

      <div className="px-5 pb-5 pt-3 divide-y divide-secondary/10">
        <div className="py-3">
          <div className="text-xs font-bold tracking-widest text-secondary/40">EMAIL</div>
          <div className="mt-1 text-sm font-semibold text-secondary">{usuario.email}</div>
        </div>

        <div className="py-3">
          <div className="text-xs font-bold tracking-widest text-secondary/40">TELÉFONO</div>
          <div className="mt-1 text-sm font-semibold text-secondary">{usuario.celular}</div>
        </div>

        <div className="py-3">
          <div className="text-xs font-bold tracking-widest text-secondary/40">CIUDAD</div>
          <div className="mt-1 text-sm font-semibold text-secondary">{usuario.ciudad}</div>
        </div>

        <div className="py-3">
          <div className="text-xs font-bold tracking-widest text-secondary/40">TIPO DE PERFIL</div>
          <div className="mt-1 text-sm font-semibold text-secondary">
            {etiquetaTipo(usuario.tipoUsuario)}
          </div>
        </div>
      </div>
    </Card>
  )
}
