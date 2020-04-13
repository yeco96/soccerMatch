import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';
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
    /* Inicializacion de Objetos y variables*/
    constructor(private router: Router,
                private platform: Platform,
                private storage: Storage,
                public loader: LoaderService,
                private crudService: CrudService,
                private tables: TablesService) {
        this.platform.ready().then(() => {
            this.ifLoggedIn();
        });
    }

    /*Metodo que identifica si la sesion esta iniciada */
    ifLoggedIn() {
        this.storage.get('uid').then((val) => {
            this.authState.next(!!val);
        });
    }
    /*Metodo para realizar un registro de usuario con autenticacion  */
    registerUser(value: { email: string; password: string; }) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
                .then(
                    res => resolve(res),
                    err => reject(err));
        });
    }
    /*Metodo de inicio de sesion con seguridad */
    loginUser(value: { email: string; password: string; }) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(value.email, value.password)
                .then(res => {
                    const user = firebase.auth().currentUser;
                    if (!user.emailVerified) {
                        return reject({message: 'Favor verificar su correo'});
                    }
                    this.storage.set('uid', res.user.uid).then((val) => {
                        this.authState.next(true);
                        resolve(res);
                    });
                }, err => reject(err));
        });
    }
    /*Metodo para salir de la sesion  */
    logoutUser() {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().signOut()
                .then(res => {
                    this.storage.remove('uid').then(() => {
                        this.authState.next(false);
                        resolve(res);
                    });
                }, err => reject(err));
        });
    }
    /*Metodo para autenticar el usuario actual  */
    userAuth() {
        return firebase.auth().currentUser;
    }
    /*Metodo para saber si el usuario esta autenticado*/
    isAuthenticated() {
        return this.authState.value;
    }
    /*Metodo  Asyn para obtener los datos del usuario*/
    async getDataUser() {
        return new Promise<any>((resolve, reject) => {
            // let user = firebase.auth().currentUser;
            let usuario = new Usuario();
            // if (user == undefined) {
            //     user = firebase.auth().currentUser;
            // }


            this.storage.get('uid').then((val) => {

                if (!val) {
                    this.storage.remove('uid').then(() => {
                        this.authState.next(false);
                        resolve("El usuario no existe");
                    });
                    return;
                }

                const uid = val.toString();
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
                }, err => reject(err));
            });


        });
    }
    /*Metodo con seguridad para el olido de contrasena por parte de un usuario */
    forgetPass(value: { email: string; }) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().sendPasswordResetEmail(value.email)
                .then(
                    res => resolve(res),
                    err => reject(err));
        });
    }
    /*Metodo para validacion de un email */
    validationEmail() {
        return new Promise<any>((resolve, reject) => {
            const user = firebase.auth().currentUser;
            user.sendEmailVerification()
                .then(res => resolve(res),
                    err => reject(err));
        });
    }

}

