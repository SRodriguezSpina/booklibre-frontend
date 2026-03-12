import { Card, CardHeader, Boton } from '../ui'
import type { Usuario } from '../../models/usuarioModel'

export type PropsMisDatosCard = {
  usuario: Usuario
  editando: boolean
  onCambioUsuario: (usuarioActualizado: Usuario) => void
  onGuardar: () => void
  onCancelar: () => void
}

export const MisDatosCard = ({usuario,
editando,
  onCambioUsuario,
  onGuardar,
  onCancelar,}: PropsMisDatosCard) => {
  const manejarCambio =
    (campo: keyof Usuario) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      onCambioUsuario({ ...usuario, [campo]: e.target.value })
    }

  const opcionesTipo: Usuario['tipoUsuario'][] = ['Lector', 'Publicador', 'LectorPublicador']

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
          <div className="text-xs font-semibold text-secondary/60">CELULAR</div>
          {editando ? (
            <input
              type="tel"
              value={usuario.celular}
              onChange={manejarCambio('celular')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          ) : (
            <div className="text-sm text-secondary">{usuario.celular}</div>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold text-secondary/60">CIUDAD</div>
          {editando ? (
            <input
              type="text"
              value={usuario.ciudad}
              onChange={manejarCambio('ciudad')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          ) : (
            <div className="text-sm text-secondary">{usuario.ciudad}</div>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold text-secondary/60">TIPO DE USUARIO</div>
          {editando ? (
            <select
              value={usuario.tipoUsuario}
              onChange={manejarCambio('tipoUsuario')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-secondary bg-white focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              {opcionesTipo.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion === 'LectorPublicador' ? 'Lector & Publicador' : opcion}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm text-secondary">
              {usuario.tipoUsuario === 'LectorPublicador' ? 'Lector & Publicador' : usuario.tipoUsuario}
            </div>
          )}
        </div>
      </div>

      {editando && (
        <div className="mt-6 flex gap-3 justify-end">
          <Boton tipo="gris" alClic={onCancelar} className="w-auto px-4 py-2 text-sm">
            Cancelar
          </Boton>
          <Boton tipo="gris" alClic={onGuardar} className="w-auto px-4 py-2 text-sm">
            Guardar cambios
          </Boton>
        </div>
      )}
    </Card>
  )
}
