import { Equipo } from './equipo';
import { Usuario } from './usuario';

export class Partido {
  idPartido: String;
  equipoA: Equipo;
  equipoB: Equipo;
  resultadoEquipoA: number;
  resultadoEquipoB: number;
  usuario: Usuario;
  fecha: any;
}
