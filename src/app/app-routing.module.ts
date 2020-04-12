import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

import {AuthGuardService} from './services/auth-guard.service';
import {TablesService} from "./service/tables.service";

const tables = new TablesService();
const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    },
    {
        path: 'register',
        loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
    },
    {
        path: 'profile',
        loadChildren: () => import('./pages/maintenance/profile/profile.module').then(m => m.ProfilePageModule),
        canActivate: [AuthGuardService],
        data: {
            role: tables.roles().JUGADOR
        }
    },
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
        canActivate: [AuthGuardService],
        data: {
            role: tables.roles().JUGADOR
        }
    },
    {
        path: 'retos',
        loadChildren: () => import('./pages/retos/retos.module').then(m => m.RetosPageModule),
        canActivate: [AuthGuardService],
        data: {
            role: tables.roles().JUGADOR
        }
    },
    {
        path: 'cancha',
        loadChildren: () => import('./pages/maintenance/cancha/cancha.module').then(m => m.CanchaPageModule),
        canActivate: [AuthGuardService],
        data: {
            role: tables.roles().CANCHA
        }
    },
    {
        path: 'noticias',
        loadChildren: () => import('./pages/noticias/noticias.module').then(m => m.NoticiasPageModule),
        canActivate: [AuthGuardService],
        data: {
            role: tables.roles().JUGADOR
        }
    },
    {
        path: 'ubicacion',
        loadChildren: () => import('./pages/maintenance/ubicacion/ubicacion.module').then(m => m.UbicacionPageModule),
        canActivate: [AuthGuardService],
        data: {
            role: tables.roles().ADMIN
        }
    },
    {
        path: 'clientes',
        loadChildren: () => import('./pages/maintenance/clientes/clientes.module').then(m => m.ClientesPageModule),
        canActivate: [AuthGuardService],
        data: {
            role: tables.roles().ADMIN
        }
    },
    {
        path: 'reserva',
        loadChildren: () => import('./pages/reserva/reserva.module').then(m => m.ReservaPageModule),
        canActivate: [AuthGuardService],
        data: {
            role: tables.roles().JUGADOR
        }
    },
    {
        path: 'equipos',
        loadChildren: () => import('./pages/maintenance/equipos/equipos.module').then(m => m.EquiposPageModule),
        canActivate: [AuthGuardService],
        data: {
            role: tables.roles().ADMIN
        }
    },
  {
    path: 'reportes',
    loadChildren: () => import('./Reportes/reportes/reportes.module').then( m => m.ReportesPageModule)
  }


];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
