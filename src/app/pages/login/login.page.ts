import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TablesService } from 'src/app/service/tables.service';
import { NavController, IonDatetime } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { LoaderService } from '../../services/loader.service';
import { ModalController } from '@ionic/angular';
import { OlvidoContraseniaComponent } from 'src/app/components/olvido-contrasenia/olvido-contrasenia.component';

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
    public modalController: ModalController
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
      this.errorMessage = '';
      this.navCtrl.navigateForward('/home');
      this.loader.hideLoader();
    }, err => {
      // this.errorMessage = err.message;
      console.log(err.message);
      this.errorMessage = 'Los datos del usuario no son correctos';
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
