import { Card, CardHeader, Boton } from '../ui'
import type { Usuario, PerfilUsuarioTipo } from '../../models/usuarioModel'

export type PropsMisDatosCard = {
  usuario: Usuario
  editando: boolean
  onCambioUsuario: (usuarioActualizado: Usuario) => void
  onGuardar: () => void
  onCancelar: () => void
}

export const MisDatosCard = ({
  usuario,
  editando,
  onCambioUsuario,
  onGuardar,
  onCancelar,
}: PropsMisDatosCard) => {
  const manejarCambio =
    (campo: keyof Usuario) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onCambioUsuario({ ...usuario, [campo]: e.target.value })
    }

  const opcionesTipoPerfil: PerfilUsuarioTipo[] = ['Lector', 'Publicador']

  return (
    <Card className="bg-surface">
      <CardHeader titulo="Mis Datos" />

      <div className="space-y-4">
        <div>
          <div className="text-xs font-semibold text-secondary/60">EMAIL</div>
          {editando ? (
            <input
              type="email"
              value={usuario.email}
              onChange={manejarCambio('email')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          ) : (
            <div className="text-sm text-secondary">{usuario.email}</div>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold text-secondary/60">TELÉFONO</div>
          {editando ? (
            <input
              type="tel"
              value={usuario.telefono}
              onChange={manejarCambio('telefono')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          ) : (
            <div className="text-sm text-secondary">{usuario.telefono}</div>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold text-secondary/60">CIUDAD</div>
          {editando ? (
            <input
              type="text"
              value={usuario.ubicacion}
              onChange={manejarCambio('ubicacion')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          ) : (
            <div className="text-sm text-secondary">{usuario.ubicacion}</div>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold text-secondary/60">TIPO DE PERFIL</div>
          {editando ? (
            <select
              value={usuario.tipoPerfil}
              onChange={manejarCambio('tipoPerfil')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-secondary bg-white focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              {opcionesTipoPerfil.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm text-secondary">{usuario.tipoPerfil}</div>
          )}
        </div>
      </div>

      {editando && (
        <div className="mt-6 flex gap-3 justify-end">
          <Boton tipo="gris" alClic={onCancelar} className="w-auto px-4 py-2 text-sm">
            Cancelar
          </Boton>
          <Boton tipo="primario" alClic={onGuardar} className="w-auto px-4 py-2 text-sm">
            Guardar cambios
          </Boton>
        </div>
      )}
    </Card>
  )
}

