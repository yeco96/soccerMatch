import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loaderToShow: any;

  titulo : string;

  

  constructor(

    private navCtrl: NavController,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private loader: LoaderService

  ) { }


  validationsForm: FormGroup;
  errorMessage = '';


  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
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

    this.titulo = 'mensaje';

  }


  loginUser(value: { email: string; password: string; }) {
    this.loader.showLoader();
    this.authService.loginUser(value)
    .then(res => {
      console.log(res);
      this.errorMessage = '';
      this.navCtrl.navigateForward('/home');
      this.loader.hideLoader();
    }, err => {
      this.errorMessage = err.message;
      this.loader.hideLoader();
    });
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }

}
