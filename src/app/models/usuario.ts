export class Usuario {
    id: string;
    correo: string;
    nombre: string;
    apellidos: string;
    telefono: [Telefono];
}


export class  Telefono {
    codigo: number;
    telefono: number;
}

