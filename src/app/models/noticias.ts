import {Usuario} from "./usuario";

export class Noticias {
    id: string;
    descripcion: string;
    fecha: any;
    tipo: string;
    objeto: string;
    usuario: Usuario;
    estado: string;
    like: Array<Usuario>;
}
