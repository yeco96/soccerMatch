import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthGuardService } from './services/auth-guard.service';
import { AuthenticationService } from './services/authentication.service';


import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { ReactiveFormsModule } from '@angular/forms';

import { MenuComponent } from './components/menu/menu.component';
import { CrearRetoComponent } from './components/crear-reto/crear-reto.component';

import { environment } from '../environments/environment';
import * as firebase from 'firebase';
firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent, MenuComponent, CrearRetoComponent],
  entryComponents: [MenuComponent, CrearRetoComponent],
  imports: [BrowserModule, IonicModule.forRoot({ backButtonText: 'Atrás' }), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AngularFireDatabaseModule, AngularFireAuthModule, ReactiveFormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationService, AuthGuardService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
