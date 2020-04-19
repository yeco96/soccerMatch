import {Usuario} from "./usuario";

export class Auditoria {
    id_auditoria: string;
    descripcion: string;
    fecha: any;
    tipo: string;
    objeto: string;
    usuario: Usuario;
    jsonAntes: {};
    jsonDespues: {};
}
