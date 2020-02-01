import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';

import { Router } from '@angular/router';

import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState = new BehaviorSubject(false);

  constructor( private router: Router,
               private platform: Platform,
               private storage: Storage,
               public toastController: ToastController
    ) {
      this.platform.ready().then(() => {
        this.ifLoggedIn();
      });
    }

  ifLoggedIn() {
    this.storage.get('USER_INFO').then((response) => {
      if (response) {
        this.authState.next(true);
      }
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
          this.storage.set('USER_INFO', res.user.refreshToken).then((response) => {
            this.authState.next(true);
            resolve(res);
          });
        },
        err => reject(err));
    });
   }

   logoutUser() {
     return new Promise((resolve, reject) => {
       if (firebase.auth().currentUser) {
         firebase.auth().signOut()
         .then(() => {

           this.storage.remove('USER_INFO').then(() => {
            this.router.navigate(['login']);
            this.authState.next(false);
            resolve();
          });

          
         }).catch((error) => {
           reject();
         });
       }
     });
   }

   userDetails() {
     return firebase.auth().currentUser;
   }

  isAuthenticated() {
    return this.authState.value;
  }

}
