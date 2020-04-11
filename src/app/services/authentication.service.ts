import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {LoadingController, Platform} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {LoaderService} from './loader.service';
import {CrudService} from '../service/crud.service';
import {TablesService} from '../service/tables.service';
import {Usuario} from '../models/usuario';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    authState = new BehaviorSubject(false);

    constructor(private router: Router,
                private platform: Platform,
                private storage: Storage,
                public loader: LoaderService,
                private crudService: CrudService,
                private tables: TablesService,
                private loadingController: LoadingController
    ) {
        this.platform.ready().then(() => {
            this.ifLoggedIn();
        });
    }


    ifLoggedIn() {
        this.storage.get('uid').then((val) => {
            this.authState.next(!!val);
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
                        const user = firebase.auth().currentUser;
                        if (!user.emailVerified) {
                            return reject({message: 'Favor verificar su correo'});
                        }
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
            let user = firebase.auth().currentUser;
            let usuario = new Usuario();
            if (user == undefined) {
                user = firebase.auth().currentUser;
            }
            const uid = user.uid.toString();
            this.crudService.read(this.tables.tablas().USUARIO).subscribe(data => {
                    const temp = (this.crudService.construir(data) as Array<Usuario>);
                    usuario = temp.filter(x => {
                        return x.uid === uid;
                    })[0];

                    if (!usuario) {
                        this.storage.remove('uid').then(() => {
                            this.authState.next(false);
                            resolve("El usuario no existe");
                        });
                    }

                    usuario.fechaNacimiento = new Date(usuario.fechaNacimiento).toISOString();
                    resolve(usuario);
                },
                err => reject(err));
        });
    }

    forgetPass(value: { email: string; }) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().sendPasswordResetEmail(value.email)
                .then(
                    res => resolve(res),
                    err => reject(err));
        });
    }

    /*disableAccount(value: { email: string;}){
      return new Promise<any>((resolve, reject) => {
        firebase.auth().(value.email)
        .then(
          res => resolve(res),
          err => reject(err));
      });
    }*/

    validationEmail() {
        return new Promise<any>((resolve, reject) => {
            const user = firebase.auth().currentUser;
            user.sendEmailVerification()
                .then(
                    res => resolve(res),
                    err => reject(err));
        });
    }

}

