import type { Libro } from '../models/libroModel'

export const librosMock: Libro[] = [
  {
    id: '1',
    titulo: 'El Gran Gatsby',
    autor: 'F. Scott Fitzgerald',
    genero: 'Literatura Clásica',
    portadaUrl: null,
    estado: 'Disponible',
    fechaAgregado: '24 Oct, 2023',
  },
  {
    id: '2',
    titulo: 'Sistemas de Diseño',
    autor: 'Adi Huriwits',
    genero: 'Diseño',
    portadaUrl: null,
    estado: 'Prestado',
    fechaAgregado: '12 Sep, 2023',
  },
  {
    id: '3',
    titulo: 'La Biblioteca de la Medianoche',
    autor: 'Matt Haig',
    genero: 'Ciencia Ficción',
    portadaUrl: null,
    estado: 'Disponible',
    fechaAgregado: '05 Ago, 2023',
  },
]

