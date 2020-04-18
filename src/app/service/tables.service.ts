import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TablesService {

    constructor() {
    }
    /*Definicion de metodos con sus tablas y atributos */
    public ubicacion() {
        return {
            UBICACION: 'Ubicacion',
            PROVINCIA: 'provincia',
            CANTON: 'canton',
            DISTITO: 'distrito'
        };
    }

    public imagenes() {
        return {
            CANCHAS: 'imagenesCancha'
        };
    }

    public tablas() {
        return {
            CANCHAS: 'Canchas',
            EQUIPO: 'Equipo',
            USUARIO: 'Usuario',
            RETOS: 'Retos',
            RESERVA: 'Reserva',
            ESTUDIANTES: 'Students',
            NOTICIAS: 'Noticias',
            CLIENTES: 'Clientes',
            AUDITORIA: 'Auditoria'
        };
    }

    public roles() {
        return {
            JUGADOR: '1',
            CANCHA: '2',
            ADMIN: '3'
        };
    }

    permiso(mascara, permiso) {
        return (Number(mascara) & Number(permiso)) == Number(permiso);
    }
}
