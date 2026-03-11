import type { Libro } from '../models/libroModel'

export const librosMock: Libro[] = [
  {
    id: '1',
    titulo: 'El Gran Gatsby',
    autor: 'F. Scott Fitzgerald',
    genero: 'Literatura Clásica',
    portadaUrl: null,
    estado: 'Disponible',
    fechaAgregado: '2023-10-24',
  },
  {
    id: '2',
    titulo: 'Sistemas de Diseño',
    autor: 'Adi Huriwits',
    genero: 'Diseño',
    portadaUrl: null,
    estado: 'Prestado',
    fechaAgregado: '2023-09-12',
  },
  {
    id: '3',
    titulo: 'La Biblioteca de la Medianoche',
    autor: 'Matt Haig',
    genero: 'Ciencia Ficción',
    portadaUrl: null,
    estado: 'Disponible',
    fechaAgregado: '2023-08-05',
  },
]

