export class Reto {
    id: string;
    descripcion: string;
    partido: [Partido];
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

