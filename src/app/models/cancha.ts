import { Usuario } from './usuario';

export class Cancha {
    id: string;
    nombre: string;
    direccion: string;
    telefono: string;
    ubicacion: UbicacionCancha;
    montoEquipo: number;
    metodoPago: MetodoPago;
    parqueo: boolean;
    vestidor: boolean;
    uniforme: boolean;
    arbitro: boolean;
    horario: Horario;
    imagen: string;
    estado: boolean;
    reserva: Array<Reserva>;
    correo: string;
    telefonoSinpe: string;
    usuarioCrea: Usuario;

    constructor() {
    }

    static validarEmail(valor) {

         return(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/.test(valor));

      }

    static validarNumero(valor){

    }

    static isNULL(obj: Cancha) {
        if (Cancha.null(obj.nombre)
            && Cancha.null(obj.direccion)
            && (Cancha.null(obj.telefono))
            && (Cancha.null(obj.ubicacion) || Cancha.null(obj.ubicacion.codigoProvincia) || Cancha.null(obj.ubicacion.codigoCanton))
            && Cancha.null(obj.montoEquipo)
            && (Cancha.null(obj.metodoPago) || Cancha.null(obj.metodoPago.tipo))
            && (Cancha.null(obj.horario) || Cancha.null(obj.horario.dias) || Cancha.null(obj.horario.horaFin) || Cancha.null(obj.horario.horaInicio))
            && Cancha.null(obj.imagen)
        ) {
            return true;
        }
        return false;
    }

    static null(value) {
        if(value == null){
            return true;
        }

        if (value instanceof String) {
            if(value === ""){
                return true;
            }
        }
    }

    static size(value) {
        return value == 0;
    }


    static validar(obj: Cancha) {
        if (Cancha.isNULL(obj)) {
            return "Debe ingresar todos los datos";
        }

        if (Cancha.null(obj.nombre)) {
            return "Debe ingresar un nombre valido";
        }

        if (Cancha.null(obj.direccion)) {
            return "Debe ingresar una dirección valida";
        }

        if ((Cancha.null(obj.telefono)) || (Cancha.size(obj.telefono.toString().length)) || (obj.telefono.toString().length <9) ) {
            return "Debe ingresar un telefono valido";
        }

        if((Cancha.null(obj.ubicacion) || Cancha.null(obj.ubicacion.codigoProvincia) || Cancha.null(obj.ubicacion.codigoCanton))){
            return "Debe ingresar una ubicación valida";
        }

        if (Cancha.null(obj.montoEquipo)) {
            return "Debe ingresar un precio valido";
        }

        if((Cancha.null(obj.metodoPago) || Cancha.null(obj.metodoPago.tipo))){
            return "Debe ingresar un metodo de pago valido";
        }

        if((Cancha.null(obj.horario) || Cancha.null(obj.horario.dias) || Cancha.null(obj.horario.horaFin) || Cancha.null(obj.horario.horaInicio))){
            return "Debe ingresar un horario valido";
        }

        if (Cancha.null(obj.imagen)) {
            return "Debe ingresar una imagen valida";
        }

        if(Cancha.null(obj.correo) || Cancha.validarEmail(obj.correo)){
            return "Debe ingresar correo electronico valido"
        }

        var re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if(!re.test(obj.correo)){
            return "Debe ingresar correo electronico valido"
        }

        if(( (obj.metodoPago.tipo=="SINPE") || (obj.metodoPago.tipo=='AMBOS')) && ((Cancha.null(obj.telefonoSinpe)) || (obj.telefonoSinpe.toString().length <9)) ){
            return "Debe ingresar numero sinpe valido";
        }
        return false;
    }

}

export class Telefono {
    codigo: number;
    telefono: number;
    tipo: string;
}

export class Horario {
    horaInicio: number;
    horaFin: number;
    dias: Array<string>;
    tiempoJuego: number;
}

export class MetodoPago {
    tipo: string;
}

export class UbicacionCancha {
    codigoProvincia: number;
    codigoCanton: number;
    codigoDistrito: number;
}


export interface MyData {
    name: string;
    filepath: string;
    size: number;
}


export class Reserva {
    fecha: Date;
    estado: string;
    idReserva: any;
}
