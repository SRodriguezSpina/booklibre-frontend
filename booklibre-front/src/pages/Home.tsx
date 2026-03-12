import { useState } from 'react';
import { homeService } from '../services/homeService';
import type { SearchParams } from '../services/homeService';
import { SearchBar } from '../components/SearchBar';
import { Filters } from '../components/home/Filters';
import type { FiltersState } from '../components/home/Filters';
import type { LibroHome } from '../models/libroModel'
import { LibroCardHome } from '../components/home/LibroCardHome'
// import { Pager } from '../components/Pager';

export const Home = () => {

    // agregar los estados nuevos: query, filters, libors y pages (paginado)
    const [books, setBooks] = useState<LibroHome[]>([])

    const search = async (params: SearchParams) => {
        const data = await homeService.search(params)
        setBooks(data.content)
    }

    return (
        <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
            <section>
                {/* barra de búsqueda */}
                <SearchBar onSearch={(query) => search({ query })} placeholder='Buscar por título...' />
            </section>
            <section>
                {/* filtros de busqueda */}
                <Filters onApplyFilters={(filters: FiltersState) => search(filters)} />
            </section>
            <section>
                {/* resultados y el paginador abajo */}
                {books.map((book) => (
                    <LibroCardHome
                        key={book.id}
                        id={book.id}
                        img={book.img}
                        genero={book.genero}
                        titulo={book.titulo}
                        autor={book.autor}
                        calificacion={book.calificacion}
                        isbn={book.isbn}
                        idioma={book.idioma}
                        tipo={book.tipo}
                        biblokarma={book.biblokarma}
                        estado={book.estado}
                        duenio={book.duenio}
                    />
                ))}
                {/* <Pager /> */}
            </section>
        </main>
    )
}