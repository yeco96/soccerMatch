import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    /* Inicializacion de Objetos*/
    constructor(
        public authenticationService: AuthenticationService
    ) {
    }
    /*Metodo de guarda para autorizar una autenticacion retornando el servicio */
    canActivate(route: ActivatedRouteSnapshot): boolean {
        const role = route.data.role;
        return this.authenticationService.isAuthenticated();
    }

}
