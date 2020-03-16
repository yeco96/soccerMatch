import { Component, OnInit } from '@angular/core';
import { TablesService } from 'src/app/service/tables.service';
import { CrudService } from 'src/app/service/crud.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ModalController } from '@ionic/angular';
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

  constructor(    private tables: TablesService,
    private crudService: CrudService,
    private loader: LoaderService,
    public modalController: ModalController,
    private storage: AngularFireStorage,
    private database: AngularFirestore,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {}


  cerrarModal() {
    this.modalController.dismiss();
  }
}
