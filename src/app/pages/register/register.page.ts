import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  validations_form: FormGroup;
  errorMessage  = '';
  successMessage = '';

  validation_messages = {
    nombre: [
      { type: 'required', message: 'Nombre is required.' }
      ],
    apellidos: [
      { type: 'required', message: 'Apellidos is required.' }
    ],
    telefono: [
      { type: 'required', message: 'Telefono is required.' },
      { type: 'minlength', message: 'Telefono must be at least 8 characters long.'}
    ],
    edad: [
      { type: 'required', message: 'Edad is required.' }
    ],
   email: [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Enter a valid email.' }
   ],
   password: [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 5 characters long.' }
   ]
 };

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {

    this.validations_form = this.formBuilder.group({


      nombre: new FormControl('', Validators.compose([
        Validators.required
      ])),
      apellidos: new FormControl('', Validators.compose([
        Validators.required
      ])),
      telefono: new FormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required
      ])),
      edad: new FormControl('', Validators.compose([
        Validators.required
      ])),
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

  tryRegister(value: any) {
    this.authService.registerUser(value)
     .then((res: any) => {
       console.log(res);
       this.errorMessage = '';
       this.successMessage = 'Your account has been created. Please log in.';
     }, (err: { message: string; }) => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = '';
     });
  }

  goLoginPage(){
    this.navCtrl.navigateBack('');
  }


}
