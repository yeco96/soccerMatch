import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { NavController } from '@ionic/angular';
import { TablesService } from 'src/app/service/tables.service';
import { CrudService } from 'src/app/service/crud.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ModalController } from '@ionic/angular';
import { Ubicacion, Canton } from 'src/app/models/ubicacion';
import { Usuario,Telefono} from 'src/app/models/usuario';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';


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
    fechaNacimiento: [
      { type: 'required', message: 'fechaNacimiento is required.' }
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
    private formBuilder: FormBuilder,
    private tables: TablesService,
    private crudService: CrudService,
    private loader: LoaderService,
    public modalController: ModalController,
    private storage: AngularFireStorage,
    private database: AngularFirestore,
  ) {}

  usuarios = new Array <Usuario> ();
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
        Validators.minLength(8),
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
       this.guardar(JSON.parse(JSON.stringify(value)) as Usuario)
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

  guardar(value : Usuario) {
    this.loader.showLoader();
    this.crudService.create(this.tables.tablas().USUARIO, value).then(resp => {
      console.log(resp);
      this.loader.hideLoader();
    })
    .catch(error => {
        console.log(error);
        this.loader.hideLoader();
    });
  }

}
