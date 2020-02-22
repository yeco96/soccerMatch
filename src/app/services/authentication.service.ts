import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';

import { Router } from '@angular/router';

import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState = new BehaviorSubject(false);

  constructor( private router: Router,
               private platform: Platform,
               private storage: Storage,
               public toastController: ToastController,
               public loader: LoaderService
    ) {
      this.platform.ready().then(() => {
        this.ifLoggedIn();
      });
    }

  ifLoggedIn() {
    // this.loader.showLoading('token');
    this.storage.get('refreshToken').then((val) => {
      this.authState.next(val ? true : false);
      // this.loader.dismissLoader('token');
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
          this.storage.set('refreshToken', res.user.refreshToken).then((val) => {
            this.authState.next(true);
            resolve(res);
          });
        },
        err => reject(err));
    });
   }

   logoutUser() {
    return new Promise<any>((resolve, reject) => {
      //  if (firebase.auth().currentUser) {
         firebase.auth().signOut()
         .then(
          res => {
            this.storage.remove('refreshToken').then(() => {
              this.authState.next(false);
              resolve(res);
            });
          },
          err => reject(err));
      //  }
     });
   }

  userDetails() {
     return firebase.auth().currentUser;
  }

  isAuthenticated() {
    return this.authState.value;
  }

}
