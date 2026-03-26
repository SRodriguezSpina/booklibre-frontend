import { Libro } from "../../classes/Libro"
import { Card, CardHeader } from "../ui/Card"

interface InfoLibroProps {
  libro: Libro
  karmaCalculado: number // NUEVO: Recibe el cálculo del padre
}

export const InfoLibro = ({ libro, karmaCalculado }: InfoLibroProps) => {
  const estadoClase =
    libro.estado === "EXCELENTE"
      ? "bg-success/15 text-success border-success/30"
      : libro.estado === "MUY_BUENO" || libro.estado === "BUENO"
        ? "bg-primary/15 text-primary-light border-primary/30"
        : "bg-danger/15 text-danger border-danger/30"

  const valor = (dato?: string | number) =>
    dato === undefined || dato === null || dato === "" ? "—" : dato

  const generoLegible =
    typeof libro.genero === "string" && libro.genero.length > 0
      ? libro.genero.replaceAll("_", " ")
      : "—"

  const detalleItems = [
    { label: "Género", value: generoLegible },
    { label: "Páginas", value: valor(libro.paginas) },
    { label: "Idioma", value: valor(libro.idioma) },
    { label: "Editorial", value: valor(libro.editorial) },
    { label: "ISBN-13", value: valor(libro.isbn) },
    { label: "Publicado", value: valor(libro.fechaPublicacion) },
    {
      label: "Estado",
      value: (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${estadoClase}`}>
          {libro.estado}
        </span>
      ),
    },
    { label: "Ranking", value: valor(libro.rating) },
  ] as const

  return (
    <section className="flex flex-col gap-6 lg:gap-7">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <span className="bg-primary/15 text-primary-light text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-widest border border-primary/30">
            {generoLegible}
          </span>
          <div className="flex items-center text-warning text-xs sm:text-sm font-semibold">
            ★★★★★{" "}
            <span className="text-on-surface-variant ml-1.5">({libro.rating})</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface leading-tight">
          {libro.titulo}
        </h1>

        <div className="inline-flex items-center gap-3 rounded-xl border border-outline/25 bg-surface-high/60 px-3 py-2.5 w-fit">
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              Autor
            </p>
            <p className="font-semibold text-on-surface">{libro.autor}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-outline/20 bg-surface/50 p-4 sm:p-5">
        <h3 className="font-bold text-lg sm:text-xl mb-2 text-on-surface">Sinopsis</h3>
        <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
          {libro.descripcion}
        </p>
      </div>

      <Card className="p-4 sm:p-6 lg:p-7 bg-surface/70 border-outline/30 rounded-2xl">
        <CardHeader
          titulo="Detalles del Libro"
          className="text-lg sm:text-xl text-on-surface mb-4 sm:mb-5"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div className="sm:col-span-2 rounded-xl border border-outline/20 bg-surface-high/50 p-3.5 sm:p-4">
            <p className="text-[10px] sm:text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
              Tipo
            </p>
            <span className="bg-primary/15 text-primary-light text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center border border-primary/30">
              {valor(libro.tipo)}
            </span>
          </div>
          <div className="rounded-xl border border-outline/20 bg-surface-high/50 p-3.5 sm:p-4">
            <p className="text-[10px] sm:text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
              Bibliokarmas
            </p>
            <span className="bg-success/15 text-success font-bold px-3 sm:px-4 py-1.5 rounded-lg inline-flex border border-success/30">
              +{karmaCalculado}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {detalleItems.map((item) => (
            <div key={item.label} className="rounded-xl border border-outline/20 bg-surface-high/35 p-3.5 sm:p-4">
              <p className="text-[10px] sm:text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
                {item.label}
              </p>
              <div className="text-base font-semibold text-on-surface break-words">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}