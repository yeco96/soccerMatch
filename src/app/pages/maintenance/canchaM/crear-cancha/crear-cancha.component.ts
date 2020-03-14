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
  selector: 'app-crear-cancha',
  templateUrl: './crear-cancha.component.html',
  styleUrls: ['./crear-cancha.component.scss'],
})
export class CrearCanchaComponent implements OnInit {

  // Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  // Uploaded Image List
  images: Observable<MyData[]>;

  // File details
  fileName: string;
  fileSize: number;

  // Status check
  isUploading: boolean;
  isUploaded: boolean;

  //Validations
  validations_form: FormGroup;
  errorMessage  = '';
  successMessage = '';

  validation_messages = {
    nombre: [
      { type: 'required', message: 'Nombre is required.' }
      ],
    direccion: [
      { type: 'required', message: 'Direccion is required.' }
    ],
    telefono: [
      { type: 'required', message: 'Telefono is required.' },
      { type: 'minlength', message: 'Telefono must be at least 8 characters long.'}
    ],/*
    ubicacion: [
      { type: 'required', message: 'Ubicacion is required.' }
    ],*/
    montoEquipo: [
     { type: 'required', message: 'Monto is required.' }
   ],
    metodoPago: [
     { type: 'required', message: 'Metodo de pago is required.' },
   ],
   provincia: [
    { type: 'required', message: 'Provincia is required.' },
   ],
   canton: [
      { type: 'required', message: 'canton is required.' },
    ],  
    imagen: [
      { type: 'required', message: 'imagen is required.' },
    ],
    inicio: [
      { type: 'required', message: 'inicio is required.' },
    ],
    fin: [
      { type: 'required', message: 'fin is required.' },
    ],
    dias: [
      { type: 'required', message: 'dias is required.' },
    ],
    parqueo: [
      { type: 'required', message: 'dias is required.' },
    ],
    vestidor: [
      { type: 'required', message: 'dias is required.' },
    ],
    uniforme: [
      { type: 'required', message: 'dias is required.' },
    ],
    arbitro: [
      { type: 'required', message: 'dias is required.' },
    ],
  };


  private imageCollection: AngularFirestoreCollection<MyData>;
  constructor(
    private tables: TablesService,
    private crudService: CrudService,
    private loader: LoaderService,
    public modalController: ModalController,
    private storage: AngularFireStorage,
    private database: AngularFirestore,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {

    this.isUploading = false;
    this.isUploaded = false;
    // Set collection where our documents/ images info will save
    this.imageCollection = database.collection<MyData>('imagenesCancha');
    this.images = this.imageCollection.valueChanges();
   }


  ubicacion = new Array<Ubicacion>();
  ubicacionJSON: any;
  provincia: Ubicacion;
  canton: Canton;
  canchas = new Array<Cancha>();
  canchaObjeto: Cancha;
  dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

  ngOnInit() {
    this.canchaObjeto = new Cancha();
    this.canchaObjeto.metodoPago = new MetodoPago();
    this.canchaObjeto.telefono = new Array<Telefono>();
    this.canchaObjeto.ubicacion = new UbicacionCancha();
    this.canchaObjeto.horario = new Horario();


    this.crudService.read(this.tables.ubicacion().UBICACION).subscribe(data => {
      this.ubicacion = this.crudService.construir(data) as Array<Ubicacion>;
      console.log(this.ubicacion);
      this.ubicacionJSON = JSON.parse(JSON.stringify(this.ubicacion));
    });
    this.validations_form = this.formBuilder.group({


      nombre: new FormControl('', Validators.compose([
        Validators.required
      ])),
      metodoPago: new FormControl('', Validators.compose([
        Validators.required
      ])),
      montoEquipo: new FormControl('', Validators.compose([
        Validators.required
      ])),
      telefono: new FormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required
      ])),
      provincia: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      direccion: new FormControl('', Validators.compose([
        Validators.required
      ])),  
      canton: new FormControl('', Validators.compose([
        Validators.required
      ])),  
      inicio: new FormControl('', Validators.compose([
        Validators.required
      ])),  
      fin: new FormControl('', Validators.compose([
        Validators.required
      ])),  
      dias: new FormControl('', Validators.compose([
        Validators.required
      ])),     
      vestidor: new FormControl('', Validators.compose([
        Validators.required
      ])),   
      parqueo: new FormControl('', Validators.compose([
        Validators.required
      ])),   
      arbitro: new FormControl('', Validators.compose([
        Validators.required
      ])),   
      uniforme: new FormControl('', Validators.compose([
        Validators.nullValidator
      ])),   
    });
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  changeProvincia() {
    // tslint:disable-next-line: triple-equals
    this.provincia = this.ubicacion.find(x => x.codigoProvincia == this.canchaObjeto.ubicacion.codigoProvincia);
    console.log(this.provincia);
  }


  guardar() {
    this.loader.showLoader();
    this.crudService.create(this.tables.tablas().CANCHAS, this.canchaObjeto).then(resp => {
      console.log(resp);
      this.loader.hideLoader();
      this.cerrarModal();
    })
    .catch(error => {
        console.log(error);
        this.loader.hideLoader();
    });
  }

  /*  tryRegister(value: any) {
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
*/


  uploadFile(event: FileList) {


    // The File object
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
     console.error('unsupported file type :( ');
     return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // The storage path
    const path = `SoccerMatchStorage/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Soccer Match Images' };

    // File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();

        this.UploadedFileURL.subscribe(resp => {
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.canchaObjeto.imagen = resp;
          this.isUploading = false;
          this.isUploaded = true;
        }, error => {
          console.error(error);
        });
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    );
  }

  addImagetoDB(image: MyData) {
    // Create an ID for document
    const id = this.database.createId();

    // Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log('error ' + error);
    });
  }


}
