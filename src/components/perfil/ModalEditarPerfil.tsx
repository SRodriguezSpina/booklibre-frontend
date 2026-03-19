import { useState } from 'react'
import { Boton } from '../ui'
import { Usuario } from '../../classes/usuario'
import type { TipoUsuario } from '../../models/usuarioModel'
import { toast } from 'react-toastify'
import { obtenerMensajeError } from '../../utils/errorHandler'

export type PropsModalEditarPerfil = {
  onClose: () => void
  usuario: Usuario
  onGuardar: (usuario: Usuario) => void | Promise<void>
}

const opcionesTipo: TipoUsuario[] = ['Lector', 'Publicador', 'LectorPublicador']

const claseInput =
  'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-secondary bg-white focus:outline-none focus:ring-2 focus:ring-primary/60'
const claseInputError = 'border-red-500 focus:ring-red-500/60'

export const ModalEditarPerfil = ({ onClose, usuario, onGuardar }: PropsModalEditarPerfil) => {
  const [form, setForm] = useState<Usuario>(new Usuario(usuario))
  const [enviando, setEnviando] = useState(false)

  const setCampo =
    (campo: 'nombre' | 'desc' | 'email' | 'celular' | 'ciudad' | 'tipoUsuario') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const valor = campo === 'tipoUsuario' ? (e.target.value as TipoUsuario) : e.target.value
      setForm(form.setCampo(campo, valor))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validado = form.validar()
    setForm(validado)
    if (Object.keys(validado.errors).length > 0) return
    setEnviando(true)
    try {
      await onGuardar(validado)
      onClose()
    } catch (e: unknown) {
      const err = obtenerMensajeError(e)
      toast.error(err.mensaje || 'No se pudieron guardar los cambios.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-editar-perfil-titulo"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <h2 id="modal-editar-perfil-titulo" className="text-xl font-bold text-secondary">
              Editar perfil
            </h2>

            <div>
              <label htmlFor="editar-perfil-nombre" className="text-xs font-semibold text-secondary/60">
                NOMBRE
              </label>
              <input
                id="editar-perfil-nombre"
                type="text"
                value={form.nombre}
                onChange={setCampo('nombre')}
                className={form.errors?.nombre ? `${claseInput} ${claseInputError}` : claseInput}
                required
              />
              {form.errors?.nombre && (
                <p className="mt-1 text-xs text-red-500">{form.errors.nombre}</p>
              )}
            </div>

            <div>
              <label htmlFor="editar-perfil-desc" className="text-xs font-semibold text-secondary/60">
                DESCRIPCIÓN
              </label>
              <textarea
                id="editar-perfil-desc"
                value={form.desc}
                onChange={setCampo('desc')}
                className={`${claseInput} resize-none min-h-[80px]`}
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="editar-perfil-email" className="text-xs font-semibold text-secondary/60">
                EMAIL
              </label>
              <input
                id="editar-perfil-email"
                type="email"
                value={form.email}
                onChange={setCampo('email')}
                className={form.errors?.email ? `${claseInput} ${claseInputError}` : claseInput}
                required
              />
              {form.errors?.email && (
                <p className="mt-1 text-xs text-red-500">{form.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="editar-perfil-celular" className="text-xs font-semibold text-secondary/60">
                CELULAR
              </label>
              <input
                id="editar-perfil-celular"
                type="tel"
                value={form.celular}
                onChange={setCampo('celular')}
                className={claseInput}
              />
            </div>

            <div>
              <label htmlFor="editar-perfil-ciudad" className="text-xs font-semibold text-secondary/60">
                CIUDAD / UBICACIÓN
              </label>
              <input
                id="editar-perfil-ciudad"
                type="text"
                value={form.ciudad}
                onChange={setCampo('ciudad')}
                className={claseInput}
              />
            </div>

            <div>
              <label htmlFor="editar-perfil-tipo" className="text-xs font-semibold text-secondary/60">
                TIPO DE LECTOR
              </label>
              <select
                id="editar-perfil-tipo"
                value={form.tipoUsuario}
                onChange={setCampo('tipoUsuario')}
                className={claseInput}
              >
                {opcionesTipo.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion === 'LectorPublicador' ? 'Lector & Publicador' : opcion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex border-t border-gray-200">
            <Boton
              type="button"
              tipo="gris"
              className="flex-1 rounded-none py-3 text-sm font-semibold"
              onClick={onClose}
              deshabilitado={enviando}
            >
              Cancelar
            </Boton>
            <Boton
              type="submit"
              tipo="primario"
              className="flex-1 rounded-none py-3 text-sm font-semibold"
              deshabilitado={enviando}
            >
              {enviando ? 'Guardando…' : 'Guardar cambios'}
            </Boton>
          </div>
        </form>
      </div>
    </div>
  )
}
