import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(
        public authenticationService: AuthenticationService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const role = route.data.role;
        return this.authenticationService.isAuthenticated();
    }

}
