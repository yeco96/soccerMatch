export class  Cancha {
    id: string;
    nombre: string;
    direccion: string;
    telefono: Array<Telefono>;
    ubicacion: UbicacionCancha;
    montoEquipo: number;
    metodoPago: MetodoPago;
    parqueo: boolean;
    bestidor: boolean;
    uniforme: boolean;
    arbitro: boolean;
    horario: Horario;

    constructor() {
    }
}

export class  Telefono {
    codigo: number;
    telefono: number;
    tipo: string;
}

export class  Horario {
    horaInicio: number;
    horaFin: number;
    dias: Array<string>;
    tiempoJuego: number;
}

export class  MetodoPago {
    tipo: string;
}

export class  UbicacionCancha {
    codigoProvincia: number;
    codigoCanton: number;
    codigoDistrito: number;
}


