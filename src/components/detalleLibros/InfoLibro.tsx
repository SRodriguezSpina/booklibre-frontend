import { Libro } from "../../classes/Libro"
import { DetalleFila, DetalleItem } from "../ui/DetalleGrid"
import { Card, CardHeader } from "../ui/Card"
import { GENERO_LABEL, IDIOMA_LABEL, ESTADO_LABEL, TIPO_LABEL } from "../../models/libroModel"
import { formatearFechaVisual } from "../../utils/dateHandlerReserva"

interface InfoLibroProps {
  libro: Libro
  karmaCalculado: number
}

export const InfoLibro = ({ libro, karmaCalculado }: InfoLibroProps) => {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {GENERO_LABEL[libro.genero ?? ""] ?? libro.genero}
          </span>
          <div className="flex items-center gap-0.5 text-sm">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < Math.round(libro.rating) ? "text-yellow-400" : "text-accent/30"}>
                ★
              </span>
            ))}
            <span className="text-secondary opacity-60 ml-1">({libro.rating})</span>
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-secondary-dark mb-4">{libro.titulo}</h1>
        <div>
          <p className="text-xs text-secondary font-bold uppercase opacity-70">Autor</p>
          <p className="font-semibold">{libro.autor}</p>
        </div>

      </div>

      <div>
        <h3 className="font-bold text-xl mb-3 text-secondary-dark">Sinopsis</h3>
        <p className="text-secondary leading-relaxed mb-4">
          {libro.descripcion}
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <CardHeader
          titulo="Detalles del Libro"
          className="text-xl text-secondary-dark mb-6"
        />

        <div className="flex flex-col gap-8">

          <DetalleFila>
            <DetalleItem label="Tipo" colSpan="col-span-2 md:col-span-3">
              <span className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full flex w-fit items-center gap-1.5 border border-orange-100">
                {TIPO_LABEL[libro.tipo ?? ""] ?? libro.tipo}
              </span>
            </DetalleItem>

            <DetalleItem label="Bibliokarmas" colSpan="col-span-2 md:col-span-1">
              <span className="bg-green-50 text-green-600 font-bold px-4 py-1.5 rounded-lg flex w-fit border border-green-100 transition-all">
                +{karmaCalculado}
              </span>
            </DetalleItem>
          </DetalleFila>

          <DetalleFila>
            <DetalleItem label="Género">{GENERO_LABEL[libro.genero ?? ""] ?? libro.genero}</DetalleItem>
            <DetalleItem label="Páginas">{libro.paginas}</DetalleItem>
            <DetalleItem label="Idioma">{IDIOMA_LABEL[libro.idioma ?? ""] ?? libro.idioma}</DetalleItem>
            <DetalleItem label="Editorial">{libro.editorial}</DetalleItem>
          </DetalleFila>

          <DetalleFila>
            <DetalleItem label="ISBN-13">{libro.isbn}</DetalleItem>
            <DetalleItem label="Publicado">
              {libro.fechaPublicacion ? formatearFechaVisual(libro.fechaPublicacion) : "-"}
            </DetalleItem>
            <DetalleItem label="Estado">
              <span className="text-blue-500">
                {ESTADO_LABEL[libro.estado ?? ""] ?? libro.estado}
              </span>
            </DetalleItem>
            <DetalleItem label="Ranking">{libro.rating}</DetalleItem>
          </DetalleFila>

        </div>
      </Card>
    </section>
  )
}