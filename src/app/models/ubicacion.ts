export class Ubicacion {
    id: string;
    codigoProvincia: number;
    descripcion: string;
    estado: boolean;
    canton: Array<Canton>;
}

export class Canton {
    id: string;
    codigoCanton: number;
    descripcion: string;
    estado: boolean;
    distrito: Array<Distrito>;
}

export class Distrito {
    id: string;
    codigoDistrito: number;
    estado: boolean;
    descripcion: string;
}