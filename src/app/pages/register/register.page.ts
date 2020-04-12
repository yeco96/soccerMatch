import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {ModalController, NavController, ToastController} from '@ionic/angular';
import {TablesService} from 'src/app/service/tables.service';
import {CrudService} from 'src/app/service/crud.service';
import {LoaderService} from 'src/app/services/loader.service';
import {Usuario} from 'src/app/models/usuario';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


    validations_form: FormGroup;
    errorMessage = '';
    successMessage = '';

    validation_messages = {
        nombre: [
            {type: 'required', message: 'campo requerido.'}
        ],
        apellidos: [
            {type: 'required', message: 'campo requerido.'}
        ],
        telefono: [
            {type: 'required', message: 'campo requerido.'},
            {type: 'minlength', message: 'debe contener el tamaño adecuado'},
            {type: 'maxlength', message: 'debe contener el tamaño adecuado'}
        ],
        fechaNacimiento: [
            {type: 'required', message: 'campo requerido'}
        ],
        email: [
            {type: 'required', message: 'campo requerido.'},
            {type: 'pattern', message: 'El correo debe ser valido.'}
        ],
        password: [
            {type: 'required', message: 'campo requerido.'},
            {type: 'minlength', message: 'debe contener minimo 6 caracteres.'}
        ]
    };

    constructor(
        private navCtrl: NavController,
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private tables: TablesService,
        private crudService: CrudService,
        private loader: LoaderService,
        public modalController: ModalController,
        public toastController: ToastController
    ) {
    }

    usuarios = new Array<Usuario>();
    usuarioObjeto: Usuario;

    ngOnInit() {

        this.usuarioObjeto = new Usuario();
        this.validations_form = this.formBuilder.group({
            nombre: new FormControl('', Validators.compose([
                Validators.required
            ])),
            apellidos: new FormControl('', Validators.compose([
                Validators.required
            ])),
            telefono: new FormControl('', Validators.compose([
                Validators.minLength(9),
                Validators.maxLength(9),
                Validators.required
            ])),
            fechaNacimiento: new FormControl('', Validators.compose([
                Validators.required
            ])),
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            password: new FormControl('', Validators.compose([
                Validators.minLength(6),
                Validators.required
            ])),
        });
    }

    tryRegister(value: any) {
        this.authService.registerUser(value)
            .then((res: any) => {
                console.log(res);
                value.uid = res.user.uid;
                this.guardar(JSON.parse(JSON.stringify(value)) as Usuario);
                this.successMessage = 'Your account has been created. Please log in.';
                this.navCtrl.navigateBack('');
                this.errorMessage = '';
                this.authService.validationEmail().then((respuesta: any) => {
                    this.presentToast('Se te envio un correo, favor verificalo');
                });
            }, (err: { message: string; }) => {
                console.log(err);
                this.errorMessage = err.message;
                this.successMessage = '';
            });
    }

    goLoginPage() {
        this.navCtrl.navigateBack('');
    }

    guardar(value: any) {
        this.loader.showLoader();
        value.fechaNacimiento = new Date(value.fechaNacimiento);
        value.password = undefined;
        value.activo = true;
        this.crudService.create(this.tables.tablas().USUARIO, value as Usuario).then(resp => {
            console.log(resp);
            this.loader.hideLoader();
        }).catch(error => {
            console.log(error);
            this.loader.hideLoader();
        });
    }

    async presentToast(msj: string) {
        const toast = await this.toastController.create({
            message: msj,
            duration: 2000,
            position: 'bottom',
            color: 'primary'
        });
        toast.present();
    }
}
