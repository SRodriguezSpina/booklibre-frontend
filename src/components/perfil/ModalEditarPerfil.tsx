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
  'mt-1 w-full rounded-lg border border-outline/40 px-3 py-2.5 text-sm text-on-surface bg-surface-high focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors'
const claseInputError = 'border-danger/60 focus:ring-danger/40'

export const ModalEditarPerfil = ({ onClose, usuario, onGuardar }: PropsModalEditarPerfil) => {
  const [form, setForm] = useState<Usuario>(new Usuario(usuario))
  const [enviando, setEnviando] = useState(false)

  const detectarCampoDuplicado = (mensaje: string): 'email' | 'celular' | null => {
    const texto = mensaje.toLowerCase()
    if (texto.includes('email')) return 'email'
    if (texto.includes('celular') || texto.includes('telefono') || texto.includes('teléfono')) {
      return 'celular'
    }
    return null
  }

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
      if (err.estado === 409) {
        const campo = detectarCampoDuplicado(err.mensaje)
        if (campo) {
          const usuarioConError = new Usuario({ ...validado })
          usuarioConError.errors = { ...validado.errors, [campo]: err.mensaje }
          setForm(usuarioConError)
          return
        }
      }
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
        className="bg-surface border border-outline/25 rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.6)] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-outline/20">
              <h2 id="modal-editar-perfil-titulo" className="text-lg font-bold text-on-surface">
                Editar perfil
              </h2>
            </div>

            <div>
              <label htmlFor="editar-perfil-nombre" className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase">
                Nombre
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
              <label htmlFor="editar-perfil-desc" className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase">
                Descripción
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
              <label htmlFor="editar-perfil-email" className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase">
                Email
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
              <label htmlFor="editar-perfil-celular" className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase">
                Celular
              </label>
              <input
                id="editar-perfil-celular"
                type="tel"
                value={form.celular}
                onChange={setCampo('celular')}
                className={form.errors?.celular ? `${claseInput} ${claseInputError}` : claseInput}
              />
              {form.errors?.celular && (
                <p className="mt-1 text-xs text-red-500">{form.errors.celular}</p>
              )}
            </div>

            <div>
              <label htmlFor="editar-perfil-ciudad" className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase">
                Ciudad / Ubicación
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
              <label htmlFor="editar-perfil-tipo" className="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase">
                Tipo de lector
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

          <div className="flex border-t border-outline/20">
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
