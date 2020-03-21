import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';

import { Router } from '@angular/router';

import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { LoaderService } from './loader.service';
import { CrudService } from '../service/crud.service';
import { TablesService } from '../service/tables.service';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState = new BehaviorSubject(false);

  constructor( private router: Router,
               private platform: Platform,
               private storage: Storage,
               public toastController: ToastController,
               public loader: LoaderService,
               private crudService: CrudService,
               private tables: TablesService,
    ) {
      this.platform.ready().then(() => {
        this.ifLoggedIn();
      });
    }

  ifLoggedIn() {
    this.storage.get('uid').then((val) => {
      this.authState.next(val ? true : false);
    });
  }

  registerUser(value: { email: string; password: string; }) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err));
    });
  }

  loginUser(value: { email: string; password: string; }) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(
        res => {
          this.storage.set('uid', res.user.uid).then((val) => {
            this.authState.next(true);
            resolve(res);
          });
        },
        err => reject(err));
    });
   }

   logoutUser() {
    return new Promise<any>((resolve, reject) => {
         firebase.auth().signOut()
         .then(
          res => {
            this.storage.remove('uid').then(() => {
              this.authState.next(false);
              resolve(res);
            });
          },
          err => reject(err));
     });
   }

  userAuth() {
     return firebase.auth().currentUser;
  }

  isAuthenticated() {
    return this.authState.value;
  }

  async getDataUser() {
    return new Promise<any>((resolve, reject) => {
      let usuario = new Usuario();
      const uid = firebase.auth().currentUser.uid.toString();
      this.crudService.read(this.tables.tablas().USUARIO).subscribe(data => {
        const temp = (this.crudService.construir(data) as Array <Usuario>);
        usuario = temp.filter(x => {
         return x.uid === uid;
        })[0];
        usuario.fechaNacimiento = new Date(usuario.fechaNacimiento).toISOString();
        resolve(usuario);
      },
      err => reject(err));
    });
  }

  forgetPass(value: { email: string;}){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(value.email)
      .then(
        res => resolve(res),
        err => reject(err));
    });
  }

}
