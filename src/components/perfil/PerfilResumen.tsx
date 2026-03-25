import { Settings } from 'lucide-react'
import { Avatar, Boton } from '../ui'
import type { Usuario } from '../../classes/usuario'

export type PropsPerfilResumen = {
  usuario: Usuario
  onEditar: () => void
}

export const PerfilResumen = ({ usuario, onEditar }: PropsPerfilResumen) => {
  return (
    <section className="group bg-gradient-to-r from-surface to-accent/10 rounded-3xl border border-white/70 shadow-[0_18px_40px_rgba(15,23,42,0.08)] px-6 md:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(15,23,42,0.14)]">
      <div className="flex items-center gap-4 md:gap-5 min-w-0">
        <div className="shrink-0 transition-transform duration-300 group-hover:scale-[1.03]">
          <Avatar
            tamaño="grande"
            src={usuario.imagenUrl ?? null}
            alt={usuario.nombre}
            className="transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="min-w-0">
          <div className="text-xl md:text-2xl font-bold text-secondary truncate">
            {usuario.nombre}
          </div>
          {usuario.desc && (
            <div className="text-primary/70 text-sm mt-1 font-semibold truncate">
              {usuario.desc}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 md:gap-5 mt-3 text-sm text-secondary/60 font-semibold tracking-tight">
            {usuario.fechaRegistro && (
              <span className="whitespace-nowrap">📅 Se unió en {new Date(usuario.fechaRegistro).getFullYear()}</span>
            )}
            <span className="whitespace-nowrap">📍 {usuario.ciudad}</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold whitespace-nowrap">
              Bibliokarmas {usuario.bibliokarmas}
            </span>
          </div>
        </div>
      </div>

      <div className="shrink-0 flex sm:justify-end">
        <Boton tipo="secundario" className="px-5 py-2.5 text-sm rounded-2xl shadow-sm w-full sm:w-auto" onClick={onEditar}>
          <Settings className="h-4 w-4" />
          Editar Perfil
        </Boton>
      </div>
    </section>
  )
}
