export class Usuario {
    id: string;
    correo: string;
    nombre: string;
    apellidos: string;
    telefono: [Telefono];
    contrasena: string;
    fechaNacimiento: Date;
    mascaraAcceso: string;
    inactivo: boolean;
    tipoLogueo: number;
    imagen: string;}


export class  Telefono {
    codigo: number;
    telefono: number;
}
