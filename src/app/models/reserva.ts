import {Cancha} from "./cancha";
import {Usuario} from "./usuario";

export class Reserva {
    id: string;
    fechaCreacion: any;
    fechaReserva: any;
    estado: string;
    cancha: Cancha;
    usuario: Usuario;
    id_MetodoPago: string;
    idReto: string;
    rutaCancelar: string;
}
