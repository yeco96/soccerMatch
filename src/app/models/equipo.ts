import {Usuario} from "./usuario";

export class Equipo {
    id: string;
    nombre: string;
    descripcion: string;
    telefono : String;
    imagen: string;
    creacion: string;
    lider: string;
    jugardores: Array<Jugador>;

constructor() {

}

static isNULL(obj: Equipo) {
    if (Equipo.null(obj.nombre)
        && Equipo.null(obj.descripcion)
        && (Equipo.null(obj.telefono))
        && Equipo.null(obj.imagen)
    ) {
        return true;
    }
    return false;
}

static null(value) {
    if(value == null){
        return true;
    }

    if (value instanceof String) {
        if(value === ""){
            return true;
        }
    }
}

static size(value) {
    return value == 0;
}


static validar(obj: Equipo) {
    if (Equipo.isNULL(obj)) {
        return "Debe ingresar todos los datos";
    }

    if (Equipo.null(obj.nombre)) {
        return "Debe ingresar un nombre valido";
    }

    // if (Equipo.null(obj.descripcion)) {
    //     return "Debe ingresar una descripcion valida";
    // }
    //
    // if (Equipo.null(obj.telefono)) {
    //     return "Debe ingresar un telefono valido";
    // }

    // if (Equipo.null(obj.imagen)) {
    //     return "Debe ingresar una imagen valida";
    // }

    return false;
}

}


export class Telefono {
codigo: number;
telefono: number;
tipo: string;
}

export interface MyData {
name: string;
filepath: string;
size: number;
}


export class Jugador {
    usuario: Usuario;
    miembro: boolean;
    estado: string;
    lider: boolean;
}
























