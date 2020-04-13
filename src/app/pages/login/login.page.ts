import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController, NavController, ToastController} from '@ionic/angular';
import {AuthenticationService} from '../../services/authentication.service';
import {LoaderService} from '../../services/loader.service';
import {OlvidoContraseniaComponent} from 'src/app/components/olvido-contrasenia/olvido-contrasenia.component';
import {Usuario} from 'src/app/models/usuario';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
     /* Inicializacion de Objetos*/
    constructor(
        private navCtrl: NavController,
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private loader: LoaderService,
        public modalController: ModalController,
        public toastController: ToastController
    ) {
    }

    validationsForm: FormGroup;
    errorMessage = '';

    /* Validacion de campos*/
    validationMessages = {
        email: [
            {type: 'required', message: 'El correo es requerido.'},
            {type: 'pattern', message: 'Por favor ingrese un correo valido'}
        ],
        password: [
            {type: 'required', message: 'La contraseña es requerida'},
            {type: 'minlength', message: 'Por favor ingrese una contraseña valida'}
        ]
    };
     /* Validacion de que se ingreso con el formato correcto*/
    ngOnInit() {
        this.validationsForm = this.formBuilder.group({
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            password: new FormControl('', Validators.compose([
                Validators.minLength(5),
                Validators.required
            ])),
        });
    }

     /* Validacion de usuario ingresado correctamente*/
    loginUser(value: { email: string; password: string; }) {
        this.loader.showLoader();
        this.authService.loginUser(value)
            .then(res => {
                console.log(res);
                this.authService.getDataUser().then((value: Usuario) => {
                     /* Validacion de actividado inactividad de un usuario*/
                    if (value.activo) {
                        this.errorMessage = '';
                        this.navCtrl.navigateForward('/home');
                        this.loader.hideLoader();

                    } else {
                        this.logout();
                        this.errorMessage = 'Usuario se encuentra inactivo';
                    }
                }, reason => {
                    this.loader.hideLoader();
                })

            }, err => {
                this.errorMessage = err.message;
                this.loader.hideLoader();
            });
    }
     /* Salir de sesion*/
    logout() {
        this.authService.logoutUser()
            .then(res => {
                console.log(res);
                this.navCtrl.navigateForward('/login');
                this.loader.hideLoader();
            }, err => {
                this.loader.hideLoader();
            });
    }
     /* Ir al registro en caso de no estar registrado*/
    goToRegisterPage() {
        this.navCtrl.navigateForward('/register');
    }

     /* Presenta el compononete de olvido su contrasena */
    async presentModal() {
        const modal = await this.modalController.create({
            component: OlvidoContraseniaComponent,
        });
        return await modal.present();
    }

    mostrarModal() {
        this.presentModal();
    }
}
