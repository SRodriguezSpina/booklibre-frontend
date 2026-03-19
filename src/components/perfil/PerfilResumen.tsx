import { Settings } from 'lucide-react'
import { Avatar, Boton } from '../ui'
import type { Usuario } from '../../classes/usuario'

export type PropsPerfilResumen = {
  usuario: Usuario
  onEditar: () => void
}

export const PerfilResumen = ({ usuario, onEditar }: PropsPerfilResumen) => {
  return (
    <section className="bg-gradient-to-r from-surface to-accent/10 rounded-3xl border border-white/70 shadow-[0_18px_40px_rgba(15,23,42,0.08)] px-8 py-6 flex items-center justify-between gap-8">
      <div className="flex items-center gap-5">
        <Avatar tamaño="grande" src={null} alt={usuario.nombre} />
        <div>
          <div className="text-2xl font-bold text-secondary">
            {usuario.nombre}
          </div>
          {usuario.desc && (
            <div className="text-primary/70 text-sm mt-1 font-semibold">
              {usuario.desc}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-5 mt-3 text-sm text-secondary/60 font-semibold tracking-tight">
            {usuario.fechaRegistro && (
              <span>📅 Se unió en {new Date(usuario.fechaRegistro).getFullYear()}</span>
            )}
            <span>📍 {usuario.ciudad}</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
              Bibliokarmas {usuario.bibliokarmas}
            </span>
          </div>
        </div>
      </div>

      <div className="min-w-[150px] flex justify-end gap-3 font-semibold">
        <Boton tipo="secundario" className="px-5 py-2.5 text-sm rounded-2xl shadow-sm" onClick={onEditar}>
          <Settings className="h-4 w-4" />
          Editar Perfil
        </Boton>
      </div>
    </section>
  )
}
