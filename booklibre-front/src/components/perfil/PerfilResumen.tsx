import { Avatar, Boton } from '../ui'
import type { Usuario } from '../../models/usuarioModel'

export type PropsPerfilResumen = {
  usuario: Usuario
  editando: boolean
  onEditar: () => void
}

const etiquetaTipoUsuario: Record<Usuario['tipoUsuario'], string> = {
  Lector: 'Lector',
  Publicador: 'Publicador',
  LectorPublicador: 'Lector & Publicador',
}

export const PerfilResumen = ({ usuario, editando, onEditar }: PropsPerfilResumen) => {
  return (
    <section className="bg-gradient-to-r from-surface to-accent/10 rounded-3xl border border-white/70 shadow-[0_18px_40px_rgba(15,23,42,0.08)] px-8 py-6 flex items-center justify-between gap-8">
      <div className="flex items-center gap-5">
        <Avatar tamaño="grande" src={null} alt={usuario.nombre} />
        <div>
          <div className="text-2xl font-bold text-secondary">
            {usuario.nombre}
          </div>
          {usuario.desc && (
            <div className="text-secondary/70 text-sm mt-1 font-medium">
              {usuario.desc}
            </div>
          )}
          <div className="text-secondary/50 text-xs mt-0.5 font-medium">
            {etiquetaTipoUsuario[usuario.tipoUsuario]}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-secondary/50 font-medium tracking-tight">
            {usuario.fechaRegistro && (
              <span>📅 Se unió en {new Date(usuario.fechaRegistro).getFullYear()}</span>
            )}
            <span>📍 {usuario.ciudad}</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
              Bibliokarmas {usuario.bibliokarmas}
            </span>
          </div>
        </div>
      </div>

      <div className="min-w-[150px] flex justify-end gap-3 font-semibold">
        {!editando && (
          <Boton tipo="secundario" className="px-5 py-2.5 text-sm rounded-full shadow-sm" alClic={onEditar}>
            Editar perfil
          </Boton>
        )}
      </div>
    </section>
  )
}
