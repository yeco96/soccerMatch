import { firestore } from 'firebase';

export class Usuario {
    id: string;
    liderEquipo: string;
    perteneceEquipo: string;
    uid: string;
    correo: string;
    email: string;
    nombre: string;
    apellidos: string;
    telefono: [Telefono];
    fechaNacimiento: any;
    genero : string;
    acceso: Acceso;
    activo: boolean;
    tipoLogueo: number;
    imagen: string;
    estado: boolean;
    sexo: string;
}


export class  Telefono {
    codigo: number;
    telefono: number;
}

export class  Acceso {
    mascara: string;
}
