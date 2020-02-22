import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'retos',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../retos/retos.module').then(m => m.RetosPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home/retos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/retos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
