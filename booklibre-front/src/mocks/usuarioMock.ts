import type { Usuario } from '../models/usuarioModel'

export const usuarioMock: Usuario = {
  id: 1,
  nombre: 'Emilia Romero',
  desc: 'Lectora ávida y coleccionista de clásicos.',
  email: 'emily@example.com',
  celular: '+54 11 1234-5678',
  ciudad: 'Gonzalo Catán, BA',
  tipoUsuario: 'Lector',
  bibliokarmas: 2345,
  fechaRegistro: '2021-03-15',
}
