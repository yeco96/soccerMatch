import {Cancha} from "./cancha";
import {Usuario} from "./usuario";

export class Reto {
    id: string;
    descripcion: string;
    partido: [Partido];
    id_Cancha: string;
    id_TipoReto:string;
    id_Estado: string;


    tipo: Tipo;
    fechaCreacion: any;
    fechaReserva: any;
    estado: string;
    cancha: Cancha;
    usuario: Usuario;
    id_MetodoPago: string;

}

export class Partido {
    descripcion: string;
    fecha: Date;
    equipoA: [Equipo];
    equipoB: [Equipo];
}

export class Equipo {
    id: string;
    nombre: string;
}


export class Tipo {
    nombre: string;
}
