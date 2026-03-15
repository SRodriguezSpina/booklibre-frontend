import { Link } from 'react-router-dom'

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
                <span>{genero}</span>
                {/* icono estrallas (calificacion) */}
                <span>{calificacion}</span>
                <h3>{titulo}</h3>
                <span>{autor}</span>
            </div>

            <div>
                <span>{isbn}</span>
                <span>{idioma}</span>
                <span>{tipo}</span>
                <span>+{biblokarma}</span>
                <span>{estado}</span>
            </div>
            <div>
                <span>@{duenio}</span>
            </div>
        </Link>
    )
}
export default LibroCardHome