import { Avatar, Boton } from '../ui'
import type { Usuario } from '../../models/usuarioModel'

export type PropsPerfilResumen = {
  usuario: Usuario
}

export const PerfilResumen = ({ usuario }: PropsPerfilResumen) => {
  return (
    <section className="bg-gradient-to-r from-surface to-accent/10 rounded-3xl border border-white/70 shadow-[0_18px_40px_rgba(15,23,42,0.08)] px-8 py-6 flex items-center justify-between gap-8">
      <div className="flex items-center gap-5">
        <Avatar tamaño="grande" src={usuario.avatarUrl} alt={`${usuario.nombre} ${usuario.apellido}`} />
        <div>
          <div className="text-2xl font-semibold text-secondary">
            {usuario.nombre} {usuario.apellido}
          </div>
          <div className="text-secondary/70 text-sm mt-1">{usuario.rol}</div>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-secondary/70">
            <span>{usuario.fechaUnion}</span>
            <span>{usuario.ubicacion}</span>
            <span className="font-semibold text-secondary">Bibliokarma {usuario.bibliokarma}</span>
          </div>
        </div>
      </div>

      <div className="min-w-[150px] flex justify-end">
        <Boton tipo="secundario" className="w-full" alClic={() => {}}>
          Editar Perfil
        </Boton>
      </div>
    </section>
  )
}

