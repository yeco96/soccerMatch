import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TablesService } from 'src/app/service/tables.service';
import { NavController, IonDatetime, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { LoaderService } from '../../services/loader.service';
import { ModalController } from '@ionic/angular';
import { OlvidoContraseniaComponent } from 'src/app/components/olvido-contrasenia/olvido-contrasenia.component';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loaderToShow: any;
  titulo: string;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    public modalController: ModalController,
    public toastController: ToastController
  ) { }


  validationsForm: FormGroup;
  errorMessage = '';


  validationMessages = {

    email: [
      { type: 'required', message: 'El correo es requerido.' },
      { type: 'pattern', message: 'Por favor ingrese un correo valido' }
    ],

    password: [
      { type: 'required', message: 'La contraseña es requerida' },
      { type: 'minlength', message: 'Por favor ingrese una contraseña valida' }
    ]
  };

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


  loginUser(value: {  email: string;  password: string;  }) {
    this.loader.showLoader();
    this.authService.loginUser(value)
    .then(res => {
      console.log(res);
      this.authService.getDataUser().then((value: Usuario) => {
        if(value.activo){
                this.errorMessage = '';
      this.navCtrl.navigateForward('/home');
      this.loader.hideLoader();

        }else{
          this.logout();
          this.errorMessage = 'Usuario se encuentra inactivo';
        }
      })

    }, err => {
      this.errorMessage = err.message;
      this.loader.hideLoader();
    });
  }

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
  
  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }

  goToForgetPassword() {
    this.navCtrl.navigateForward('/forgetPassword');
  }

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
