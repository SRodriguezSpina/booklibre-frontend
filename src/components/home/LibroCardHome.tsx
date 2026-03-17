import { Link } from 'react-router-dom'
import { GENERO_LABEL, IDIOMA_LABEL, ESTADO_LABEL, TIPO_LABEL } from '../../models/libroModel'

type LibroCardProps = {
    id: number
    img: string
    // --
    genero: string
    titulo: string
    autor: string
    calificacion: number
    // --
    isbn: string
    idioma: string
    tipo: string
    biblokarma: number
    estado: string
    // --
    duenio: string
}

export const LibroCardHome = ({id, img, genero, titulo, autor, calificacion, isbn, idioma, tipo, biblokarma, estado, duenio}: LibroCardProps) => {
    return(
        <Link to={`/libro/${id}`} className=''>
            <div>
                <img src={img} className=''/>
            </div>

            <div>
                <span>{GENERO_LABEL[genero] ?? genero}</span>
                {/* icono estrallas (calificacion) */}
                <span>{calificacion}</span>
                <h3>{titulo}</h3>
                <span>{autor}</span>
            </div>

            <div>
                <span>{isbn}</span>
                <span>{IDIOMA_LABEL[idioma] ?? idioma}</span>
                <span>{TIPO_LABEL[tipo] ?? tipo}</span>
                <span>+{biblokarma}</span>
                <span>{ESTADO_LABEL[estado] ?? estado}</span>
            </div>
            <div>
                <span>@{duenio}</span>
            </div>
        </Link>
    )
}
export default LibroCardHome