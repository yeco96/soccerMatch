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
import { AngularFireStorageModule } from '@angular/fire/storage';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MenuComponent } from './components/menu/menu.component';
import { CrearRetoComponent } from './components/crear-reto/crear-reto.component';
import { CrearCanchaComponent } from './pages/maintenance/canchaM/crear-cancha/crear-cancha.component';


import { environment } from '../environments/environment';
import { FileSizeFormatPipe } from './components/file-size-format.pipe';


import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';
import { OlvidoContraseniaComponent } from './components/olvido-contrasenia/olvido-contrasenia.component';

import {NgxMaskIonicModule} from 'ngx-mask-ionic'

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent, MenuComponent, CrearRetoComponent, CrearCanchaComponent, FileSizeFormatPipe,OlvidoContraseniaComponent],
  entryComponents: [MenuComponent, CrearRetoComponent, CrearCanchaComponent, OlvidoContraseniaComponent],
  imports: [BrowserModule, IonicModule.forRoot({ backButtonText: 'Atrás', scrollPadding: true, scrollAssist: false}), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgxMaskIonicModule.forRoot(),
    AngularFirestoreModule, IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AngularFireDatabaseModule, AngularFireAuthModule, AngularFireStorageModule, ReactiveFormsModule, FormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationService, AuthGuardService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
