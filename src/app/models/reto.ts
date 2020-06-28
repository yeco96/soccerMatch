import {Cancha} from "./cancha";
import {Usuario} from "./usuario";
import {Equipo} from "./equipo";

export class Reto {
    id: string;
    descripcion: string;
    partido: Partido;



    tipo: Tipo;
    fechaCreacion: any;
    fechaReserva: any;
    estado: string;
    cancha: Cancha;
    usuario: Usuario;


    solicitud: Array<Solicitud>;

}

export class Partido {
    descripcion: string;
    fecha: Date;
    equipoA: Equipo;
    equipoB: Equipo;
}

export class Tipo {
    nombre: string;
}


export class Solicitud {
    usuario: Usuario;
    equipo: Equipo;
    estado: string;
    fecha: any;
  partido: any;
  partido: any;
  partido: any;
}
