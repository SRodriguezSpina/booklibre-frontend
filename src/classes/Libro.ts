import type {
  LibroDTO,
  TipoLibro,
  EstadoLibro,
  Genero,
  Idioma,
  PrestamoDTO,
  RangoReservaDTO,
} from "../models/libroModel";
import { calcularDiferenciaDias } from "../utils/dateHandlerReserva";

export class Libro {
  id: number;
  prestamoId?: number;
  titulo: string;
  autor: string;
  autorImg?: string;
  estado: EstadoLibro;
  propietarioId: number;
  imagenUrl: string;
  alquiladoPorId?: number;
  bibliokarma?: number;
  rating: number;
  estoyReservado: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  tipo?: TipoLibro;
  descripcion?: string;
  genero?: Genero;
  paginas?: number;
  isbn?: string;
  idioma?: Idioma;
  editorial?: string;
  fechaPublicacion?: string;
  cantidadReservas?: number;
  reservas: RangoReservaDTO[]; 

  constructor(data: Partial<Libro>) {
    Object.assign(this, data);
    this.id = data.id || 0;
    this.titulo = data.titulo || "";
    this.autor = data.autor || "";
    this.estado = data.estado || ("DISPONIBLE" as EstadoLibro);
    this.propietarioId = data.propietarioId || 0;
    this.imagenUrl = data.imagenUrl || "";
    this.rating = data.rating || 0;
    this.estoyReservado = data.estoyReservado ?? false;
    this.reservas = data.reservas ?? [];  
  }

  static fromJson(json: LibroDTO): Libro {
    return new Libro({
      ...json,
    });
  }

  static fromPrestamoJson(json: PrestamoDTO): Libro {
    return new Libro({
      id: json.id,
      titulo: json.titulo,
      autor: json.autor,
      estado: json.estado,
      propietarioId: json.propietarioId,
      imagenUrl: json.imagenUrl,
      alquiladoPorId: json.alquiladoPorId ?? undefined,
      fechaDesde: json.fechaDesde ?? undefined,
      fechaHasta: json.fechaHasta ?? undefined,
      rating: json.rating,
      bibliokarma: json.bibliokarma ?? undefined,
      reservas: [], 
    });
  }

  estaDevuelto(): boolean {
    if (!this.fechaHasta) return false;
    const hoy = new Date();
    const fechaFin = new Date(this.fechaHasta);
    hoy.setHours(0, 0, 0, 0);
    fechaFin.setHours(0, 0, 0, 0);
    return fechaFin < hoy;
  }

  estoyDisponible(): boolean {
    return !this.fechaHasta || this.estaDevuelto();
  }

  estaProximoAVencer(): boolean {
    if (!this.fechaHasta || this.estaDevuelto()) return false;
    const hoy = new Date();
    const fechaFin = new Date(this.fechaHasta);
    const diffTiempo = fechaFin.getTime() - hoy.getTime();
    const diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
    return diffDias >= 0 && diffDias <= 3;
  }

  estaCalificado(): boolean {
    return this.rating > 0;
  }

  calcularBibliokarma(
    fechaDesde: string,
    fechaHasta: string,
    bibliokarmasUsuario: number,
  ): number {
    if (!fechaDesde || !fechaHasta) return 0;
    const diasReserva = calcularDiferenciaDias(fechaDesde, fechaHasta);
    if (diasReserva <= 0) return 0;
    const base = 5 * diasReserva;
    const plus = this.calcularPlusBibliokarma(bibliokarmasUsuario);
    return base + plus;
  }

  private calcularPlusBibliokarma(bibliokarmasUsuario: number): number {
    const paginas = this.paginas ?? 0;
    const reservas = this.cantidadReservas ?? 0;

    const estrategias: Record<NonNullable<TipoLibro>, () => number> = {
      Comun: () => paginas * (bibliokarmasUsuario < 1000 ? 5 : 2),
      ConDedicatoria: () => 200 + 10 * reservas,
      Coleccionable: () => Math.ceil(bibliokarmasUsuario / 5) + paginas,
    };

    return this.tipo ? (estrategias[this.tipo]?.() ?? 0) : 0;
  }
}