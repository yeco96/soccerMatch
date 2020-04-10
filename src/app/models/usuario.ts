import { firestore } from 'firebase';

export class Usuario {
    id: string;
    uid: string;
    correo: string;
    email: string;
    nombre: string;
    apellidos: string;
    telefono: [Telefono];
    contrasena: string;
    fechaNacimiento: any;
    genero : string;
    mascaraAcceso: string;
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
