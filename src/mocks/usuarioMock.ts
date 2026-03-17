import { Usuario } from '../classes/usuario'

export const usuarioMock = new Usuario({
  id: 1,
  nombre: 'Emilia Romero',
  desc: 'Lectora ávida y coleccionista de clásicos.',
  email: 'emily@example.com',
  celular: '+54 11 1234-5678',
  ciudad: 'Gonzalo Catán, BA',
  tipoUsuario: 'Lector',
  bibliokarmas: 2345,
  fechaRegistro: '2021-03-15',
})

export const usuarioMock2 = new Usuario({
  id: 2,
  nombre: 'Juan Perez',
  desc: 'Publicador de libros de ciencia ficción.',
  email: 'juan@example.com',
  celular: '+54 11 1234-5678',
  ciudad: 'Gonzalo Catán, BA',
  tipoUsuario: 'Publicador',
  bibliokarmas: 1234,
  fechaRegistro: '2021-03-15',
})
