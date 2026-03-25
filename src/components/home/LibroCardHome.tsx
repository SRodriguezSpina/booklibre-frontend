import { Link } from 'react-router-dom'
import { GENERO_LABEL, IDIOMA_LABEL, ESTADO_LABEL, TIPO_LABEL } from '../../models/libroModel'
import { Star } from 'lucide-react'

type LibroCardProps = {
    id: number
    imagenUrl: string
    // --
    genero: string
    titulo: string
    autor: string
    calificacion: number
    // --
    isbn: string
    idioma: string
    tipo: string
    bibliokarma: number
    estado: string
    // --
    duenio: string
}

export const LibroCardHome = ({ id, imagenUrl, genero, titulo, autor, calificacion, isbn, idioma, tipo, bibliokarma, estado, duenio }: LibroCardProps) => {
    return (
        <Link to={`/libros/${id}`} className='flex flex-col bg-surface rounded-2xl overflow-hidden shadow-sm border border-accent hover:shadow-md transition-shadow'>
            <div className='w-full h-52 overflow-hidden'>
                <img src={imagenUrl} className='w-full h-full object-cover' />
            </div>

            <div className='flex flex-col gap-1 px-4 pt-3 min-h-[72px]'>
                <div className='flex justify-between items-center'>
                    <span className='text-xs font-semibold text-primary'>{GENERO_LABEL[genero] ?? genero}</span>
                    <div className='flex items-center gap-1 text-xs text-secondary-light'>
                        <Star size={12} className='fill-yellow-400 text-yellow-400' />
                        <span>{calificacion}</span>
                    </div>
                </div>
                <h3 className='text-sm font-bold text-secondary-dark leading-tight line-clamp-2'>{titulo}</h3>
                <span className='text-xs text-secondary-light'>{autor}</span>
            </div>

            <div className='grid grid-cols-2 gap-x-3 gap-y-1 px-4 pt-3 text-xs text-secondary'>
                <div>
                    <p className='text-secondary-light uppercase tracking-wide text-[10px]'>ISBN</p>
                    <p className='font-medium truncate'>{isbn}</p>
                </div>
                <div>
                    <p className='text-secondary-light uppercase tracking-wide text-[10px]'>Idioma</p>
                    <p className='font-medium'>{IDIOMA_LABEL[idioma] ?? idioma}</p>
                </div>
                <div>
                    <p className='text-secondary-light uppercase tracking-wide text-[10px]'>Tipo</p>
                    <p className='font-medium'>{TIPO_LABEL[tipo] ?? tipo}</p>
                </div>
                <div>
                    <p className='text-secondary-light uppercase tracking-wide text-[10px]'>Biblokarma</p>
                    <p className='font-medium text-primary'>+{bibliokarma}</p>
                </div>
            </div>

            <div className='mt-auto'>
                <div className='px-4 pt-2 pb-2'>
                    <p className='text-secondary-light uppercase tracking-wide text-[10px]'>Estado</p>
                    <span className='inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent text-primary-dark'>
                        {ESTADO_LABEL[estado] ?? estado}
                    </span>
                </div>
                <div className='flex items-center gap-2 px-4 py-3 border-t border-accent'>
                    <div className='w-6 h-6 rounded-full bg-primary-light flex items-center justify-center text-white text-[10px] font-bold'>
                        {duenio.charAt(0).toUpperCase()}
                    </div>
                    <span className='text-xs text-secondary-light'>@{duenio}</span>
                </div>
            </div>
        </Link>
    )
}
export default LibroCardHome