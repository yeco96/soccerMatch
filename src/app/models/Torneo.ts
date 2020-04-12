export class Torneo {
    id: string;
    descripcion: string;
    partido: [Partido];
    id_Cancha: string;
    id_TipoReto:string;
    id_Estado: string;
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
