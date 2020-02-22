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
      CANCHAS: 'canchas',
      RETOS: 'retos',
      ESTUDIANTES: 'Students'
    };
  }
}
