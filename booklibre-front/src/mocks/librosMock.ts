import type { LibroDTO } from '../models/libroModel'

export const librosMock: LibroDTO[] = [
  {
    id: 1,
    titulo: 'El Gran Gatsby',
    autor: 'F. Scott Fitzgerald',
    tipo: 'Común',
    paginas: 180,
    estado: 'Muy bueno',
    propietarioId: 1,
  },
  {
    id: 2,
    titulo: 'Sistemas de Diseño',
    autor: 'Adi Hurwitz',
    tipo: 'Común',
    paginas: 320,
    estado: 'Excelente',
    propietarioId: 1,
    alquiladoPorId: 2,
    fechaDevolucion: '2026-04-15',
  },
  {
    id: 3,
    titulo: 'La Biblioteca de la Medianoche',
    autor: 'Matt Haig',
    tipo: 'Con dedicatoria',
    paginas: 288,
    estado: 'Bueno',
    propietarioId: 1,
  },
]
