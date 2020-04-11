import {Component, OnInit} from '@angular/core';
import {TablesService} from 'src/app/service/tables.service';
import {CrudService} from 'src/app/service/crud.service';
import {LoaderService} from 'src/app/services/loader.service';
import {ModalController, ToastController} from '@ionic/angular';
import {Canton, Ubicacion} from 'src/app/models/ubicacion';
import {Cancha, Horario, MetodoPago, MyData, Telefono, UbicacionCancha} from 'src/app/models/cancha';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {Noticias} from 'src/app/models/noticias';


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

    validations_form: FormGroup;
    errorMessage = '';
    successMessage = '';

    validation_messages = {
        telefono: [
            {type: 'required', message: 'campo requerido.'},
            {type: 'minlength', message: 'debe contener el tamaño adecuado'},
            {type: 'maxlength', message: 'debe contener el tamaño adecuado'}
        ],
        numeroSinpe: [
            {type: 'required', message: 'campo requerido.'},
            {type: 'minlength', message: 'debe contener el tamaño adecuado'},
            {type: 'maxlength', message: 'debe contener el tamaño adecuado'}
        ]       
    }

    private imageCollection: AngularFirestoreCollection<MyData>;

    constructor(
        private tables: TablesService,
        private crudService: CrudService,
        private loader: LoaderService,
        public modalController: ModalController,
        private storage: AngularFireStorage,
        private database: AngularFirestore,
        public toastController: ToastController,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService      
    ) {
        this.isUploading = false;
        this.isUploaded = false;
        // Set collection where our documents/ images info will save
        this.imageCollection = database.collection<MyData>('imagenesCancha');
        this.images = this.imageCollection.valueChanges();
    }


    actualizar: boolean;
    ubicacion = new Array<Ubicacion>();
    ubicacionJSON: any;
    provincia: Ubicacion;
    canton: Canton;
    canchas = new Array<Cancha>();
    canchaObjeto: Cancha;
    dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    noticia = new Noticias();
    canchasTemp:Cancha;


    obj: Cancha;

    ngOnInit() {
        this.canchaObjeto = new Cancha();
        this.canchaObjeto.metodoPago = new MetodoPago();
        this.canchaObjeto.telefono = "";
        this.canchaObjeto.ubicacion = new UbicacionCancha();
        this.canchaObjeto.horario = new Horario();
        

        this.validations_form = this.formBuilder.group({
            telefono: new FormControl('', Validators.compose([
                Validators.minLength(9),
                Validators.maxLength(9),
                Validators.required
            ])),
            numeroSinpe: new FormControl('', Validators.compose([
                Validators.minLength(9),
                Validators.maxLength(9),
                Validators.required
            ])),
        });

        this.loader.showLoader();
        this.crudService.read(this.tables.ubicacion().UBICACION).subscribe(data => {
            this.ubicacion = this.crudService.construir(data) as Array<Ubicacion>;
            this.ubicacionJSON = JSON.parse(JSON.stringify(this.ubicacion));
            if (this.obj) { 
                
                this.canchaObjeto = this.obj;               
                this.canchasTemp = Object.assign({}, this.canchaObjeto);
                this.actualizar = true;
            }
            this.loader.hideLoader();
        }, error1 => this.presentToast('Ocurrio un error al cargar las canchas', false));


    }

    cerrarModal() {
        this.actualizar = false;
        this.modalController.dismiss();
    }


    changeProvincia(){
        this.provincia = this.ubicacion.find(x => x.codigoProvincia.toString() === this.canchaObjeto.ubicacion.codigoProvincia.toString());
    }

    guardar() {

        const result = Cancha.validar(this.canchaObjeto);

        if (result) {
            return this.presentToast(result, false);
        }

        this.loader.showLoader();
        if (this.actualizar) {
            this.noticia=new Noticias();
            if(this.canchaObjeto.montoEquipo!=this.canchasTemp.montoEquipo){
                this.noticia.descripcion='Cambio el monto de la cancha';            
                this.noticia.fecha= this.formattedDate();
                this.noticia.tipo='Cancha'
            } 
            this.crudService.update(this.tables.tablas().CANCHAS, this.canchaObjeto, this.noticia.descripcion?this.noticia:undefined).then(resp => {
 
                this.loader.hideLoader();
                this.cerrarModal();
            }).catch(error => {
                this.presentToast('Ocurrio un error al actualizar la cancha', false);
                this.loader.hideLoader();
            });
            return;
        }

        this.authService.getDataUser().then(res => {
        this.canchaObjeto.usuarioCrea = res;    
        this.noticia.fecha= this.formattedDate();
        this.noticia.tipo='Cancha'
        this.noticia.descripcion='Se agrego la cancha '+this.canchaObjeto.nombre+' con el telefono: '+this.canchaObjeto.telefono;
            this.crudService.create(this.tables.tablas().CANCHAS, this.canchaObjeto, this.noticia).then(resp => {
                this.presentToast('Se registro la cancha correctamente', true);
                this.canchaObjeto.nombre
                this.loader.hideLoader();
                this.cerrarModal();
            }).catch(error => {
                this.presentToast('Ocurrio un error al crear la cancha', false);
                this.loader.hideLoader();
            });
        });
    }

    formattedDate(d = new Date) {
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        const year = String(d.getFullYear());
        let hours = String(d.getHours());
        let minutes = String(d.getMinutes());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }



    elimiar() {
        this.loader.showLoader();
        this.crudService.delete(this.tables.tablas().CANCHAS, this.canchaObjeto).then(resp => {
            this.loader.hideLoader();
            this.cerrarModal();
        }).catch(error => {
            this.presentToast('Ocurrio un error al borrar la cancha', false);
            this.loader.hideLoader();
        });
    }


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
        const customMetadata = {app: 'Soccer Match Images'};
        // File reference
        const fileRef = this.storage.ref(path);
        // The main task
        this.task = this.storage.upload(path, file, {customMetadata});
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

    async presentToast(msj: string, status: boolean) {
        const toast = await this.toastController.create({
            message: msj,
            duration: 2000,
            position: 'top',
            color: !status ? 'danger' : 'primary'
        });
        toast.present();
    }
}
