import {Component, OnInit} from '@angular/core';
import {TablesService} from 'src/app/service/tables.service';

import {LoaderService} from 'src/app/services/loader.service';
import {ModalController, NavController, ToastController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from 'src/app/services/authentication.service';

@Component({
    selector: 'app-olvido-contrasenia',
    templateUrl: './olvido-contrasenia.component.html',
    styleUrls: ['./olvido-contrasenia.component.scss'],
})
export class OlvidoContraseniaComponent implements OnInit {
     /* Inicializacion de Objetos*/
    constructor(private tables: TablesService,
                private loader: LoaderService,
                public modalController: ModalController,
                private authService: AuthenticationService,
                private formBuilder: FormBuilder,
                private navCtrl: NavController,
                public toastController: ToastController
    ) {
    }

         /* Validaciones*/
    validationsForm: FormGroup;
    errorMessage = '';


    validationMessages = {

        email: [
            {type: 'required', message: 'El correo es requerido.'},
            {type: 'pattern', message: 'Por favor ingrese un correo valido'}
        ],
    };

         /* Validacion con patron de contrasena*/
    ngOnInit() {
        this.validationsForm = this.formBuilder.group({
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
        });
    }


    cerrarModal() {
        this.modalController.dismiss();
    }

     /* Metodo loader al console de olvido de contrasena*/
    forgetPass(value: { email: string; }) {
        this.loader.showLoader();
        this.authService.forgetPass(value).then(res => {
            console.log(res);
            this.errorMessage = '';
            this.navCtrl.navigateForward('/login');
            this.loader.hideLoader();
            this.cerrarModal();
        }, err => {
            this.presentToast("Ocurrio un error al restablecer la contrasena", false);
            this.errorMessage = err.message;
            this.loader.hideLoader();
        });

    }
    /*Toast controller para el servicio Async */
    async presentToast(msj, status) {
        const toast = await this.toastController.create({
            message: msj,
            duration: 2000,
            position: 'bottom',
            color: !status ? 'danger' : 'success'
        });
        toast.present();
    }
    /*Regresar al Login */
    goLoginPage() {
        this.cerrarModal();
    }

}
