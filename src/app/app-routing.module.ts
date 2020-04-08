import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/maintenance/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'retos',
    loadChildren: () => import('./pages/retos/retos.module').then( m => m.RetosPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'cancha',
    loadChildren: () => import('./pages/maintenance/cancha/cancha.module').then( m => m.CanchaPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'noticias',
    loadChildren: () => import('./pages/noticias/noticias.module').then( m => m.NoticiasPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'ubicacion',
    loadChildren: () => import('./pages/maintenance/ubicacion/ubicacion.module').then( m => m.UbicacionPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/maintenance/clientes/clientes.module').then( m => m.ClientesPageModule),
    canActivate: [AuthGuardService]
  }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
