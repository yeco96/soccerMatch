import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  constructor() { }

  public ubicacion() {
    return {
      PROVINCIA: 'provincia',
      CANTON: 'canton',
      DISTITO: 'distrito'
    };
  }

  public tablas() {
    return {
      CANCHAS: 'Canchas',
      EQUIPO: 'Equipo',
      USUARIO: 'Usuario',
      RETOS: 'Retos',
      ESTUDIANTES: 'Students'
    };
  }
}
