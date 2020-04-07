import { Component, OnInit } from '@angular/core';
import { TablesService } from 'src/app/service/tables.service';
import { CrudService } from 'src/app/service/crud.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ModalController, NavController,ToastController } from '@ionic/angular';
import { Ubicacion, Canton } from 'src/app/models/ubicacion';
import { Cancha, MetodoPago, Telefono, Horario, UbicacionCancha, MyData } from 'src/app/models/cancha';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-olvido-contrasenia',
  templateUrl: './olvido-contrasenia.component.html',
  styleUrls: ['./olvido-contrasenia.component.scss'],
})
export class OlvidoContraseniaComponent implements OnInit {

  loaderToShow: any;
  titulo: string;

  constructor(    private tables: TablesService,
    private loader: LoaderService,
    public modalController: ModalController,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    public toastController: ToastController
    ) { }

    validationsForm: FormGroup;
    errorMessage = '';


    validationMessages = {

      email: [
        { type: 'required', message: 'El correo es requerido.' },
        { type: 'pattern', message: 'Por favor ingrese un correo valido' }
      ],
    };

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


forgetPass(value :{email: string;}) {
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

  async presentToast(msj, status) {
    const toast = await this.toastController.create({
        message: msj,
        duration: 2000,
        position: 'top',
        color: !status ? "danger" : "primary"
    });
    toast.present();
}

  goLoginPage() {
    this.navCtrl.navigateBack('');
  }

}
