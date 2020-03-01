export class  Cancha {
    id: string;
    nombre: string;
    direccion: string;
    telefono: Array<Telefono>;
    ubicacion: Ubicacion;

    constructor() {
    }
}

export class  Telefono {
    codigo: number;
    telefono: number;
}

export class  Ubicacion {
    codigoProvincia: number;
    codigoCanton: number;
    codigoDistrito: number;
}


