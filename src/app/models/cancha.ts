export class  Cancha {
    id: string;
    nombre: string;
    direccion: string;
    telefono: Array<Telefono>;

    constructor() {
    }
}

export class  Telefono {
    codigo: number;
    telefono: number;
}

