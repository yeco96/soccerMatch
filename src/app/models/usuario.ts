import { firestore } from 'firebase';

export class Usuario {
    id: string;
    uid: string;
    correo: string;
    nombre: string;
    apellidos: string;
    telefono: [Telefono];
    contrasena: string;
    fechaNacimiento: any;
    mascaraAcceso: string;
    inactivo: boolean;
    tipoLogueo: number;
    imagen: string;
}


export class  Telefono {
    codigo: number;
    telefono: number;
}
