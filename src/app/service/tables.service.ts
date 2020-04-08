import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  constructor() { }

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
      ESTUDIANTES: 'Students',
      NOTICIAS: 'Noticias',
      CLIENTES: 'Clientes'
    };
  }
}
