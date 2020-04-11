import {Component, OnInit} from '@angular/core';
import {TablesService} from 'src/app/service/tables.service';
import {CrudService} from 'src/app/service/crud.service';
import {LoaderService} from 'src/app/services/loader.service';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {MyData} from 'src/app/models/equipo';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Equipo} from '../models/equipo';
import {AuthenticationService} from "../services/authentication.service";
import {Usuario} from "../models/usuario";


@Component({
    selector: 'app-crear-equipo',
    templateUrl: './crear-equipo.component.html',
    styleUrls: ['./crear-equipo.component.scss'],
})
export class CrearEquipoComponent implements OnInit {
    editar = false;
    popoverController: any;

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

    tab: string;

    private imageCollection: AngularFirestoreCollection<MyData>;

    constructor(
        private tables: TablesService,
        private crudService: CrudService,
        private loader: LoaderService,
        public modalController: ModalController,
        private storage: AngularFireStorage,
        private database: AngularFirestore,
        public toastController: ToastController,
        public  authService: AuthenticationService,
        public alertController: AlertController
    ) {
        this.isUploading = false;
        this.isUploaded = false;
        // Set collection where our documents/ images info will save
        this.imageCollection = database.collection<MyData>('imagenesCancha');
        this.images = this.imageCollection.valueChanges();
        this.tab = 'INFO';
    }


    actualizar: boolean;
    equipos = new Array<Equipo>();
    equipoObjeto: Equipo;
    usuario: Usuario;
    obj: Equipo;
    esLiber: boolean;
    tieneEquipo: boolean;

    listaEquipos = new Array<Equipo>();
    listaEquiposTemp = new Array<Equipo>();
    listaEquiposMostrar = new Array<Equipo>();

    ngOnInit() {
        this.equipoObjeto = new Equipo();
        this.usuario = new Usuario();
        this.obtenerDatos();
    }


    obtenerDatos() {
        this.loader.showLoader();
        this.authService.getDataUser().then(res => {
            this.usuario = res;

            if (!this.usuario.liderEquipo) {
                this.loader.hideLoader();
                return;
            }

            this.crudService.read(this.tables.tablas().EQUIPO).subscribe(data => {
                this.listaEquipos = this.crudService.construir(data) as Array<Equipo>;
                this.equipoObjeto = this.listaEquipos.filter(x => {
                    return x.id === this.usuario.liderEquipo;
                })[0];
                this.esLiber = true;
                this.tieneEquipo = true;
                this.loader.hideLoader();
            });

        }, reason => {
            this.loader.hideLoader();
        });
    }

    mostrarEquipos() {

    }

    cerrarModal() {
        this.actualizar = false;
        this.modalController.dismiss();
    }

    async enviarSolicitud(equipo: Equipo) {


        if (equipo.jugardores) {
            const validar = equipo.jugardores.filter(x => x.usuario.uid == this.usuario.uid);
            if (validar.length > 0) {
                return this.presentToast('Ya existe una solicitud al equipo', false);
            }
        }


        const alert = await this.alertController.create({
            header: 'Enviar solicitud',
            message: "¿Desea solicitar ingresar al equipo?",
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'cancelar',
                    handler: () => {

                    }
                }, {
                    text: 'Aceptar',
                    handler: () => {
                        if (equipo.jugardores == undefined) {
                            equipo.jugardores = [];
                        }
                        equipo.jugardores.push({usuario: this.usuario, miembro: false, estado: 'PENDIENTE', lider: false});
                        this.loader.showLoader();
                        this.crudService.update(this.tables.tablas().EQUIPO, equipo).then(resp => {
                            this.presentToast('Solicitud enviada', true);
                            this.loader.hideLoader();
                        }).catch(error => {
                            this.presentToast('Ocurrio un error al actualizar  EL EQUIPO', false);
                            this.loader.hideLoader();
                        });
                    }
                }
            ]
        });

        await alert.present();
    }


    async crearEquipo() {

        const result = Equipo.validar(this.equipoObjeto);

        if (result) {
            return this.presentToast(result, false);
        }

        if (this.actualizar) {
            this.loader.showLoader();
            this.crudService.update(this.tables.tablas().EQUIPO, this.equipoObjeto).then(resp => {
                this.loader.hideLoader();
            }).catch(error => {
                this.presentToast('Ocurrio un error al actualizar  EL EQUIPO', false);
                this.loader.hideLoader();
            });
            return;
        }


        const alert = await this.alertController.create({
            header: 'Crear un equipo',
            message: "¿Desea crear un equipo?",
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'cancelar',
                    handler: () => {

                    }
                }, {
                    text: 'Aceptar',
                    handler: () => {
                        this.loader.showLoader();
                        this.equipoObjeto.jugardores.push({usuario: this.usuario, miembro: false, estado: 'PENDIENTE', lider: true});
                        this.crudService.create(this.tables.tablas().EQUIPO, this.equipoObjeto).then(resp => {
                            this.usuario.liderEquipo = resp.id;
                            this.crudService.update(this.tables.tablas().USUARIO, this.usuario).then(resp => {
                                this.loader.hideLoader();
                                this.obtenerDatos();
                                this.listaEquiposMostrar = [];
                                this.presentToast('Usuario guardado correctamente', true);
                            }).catch(error => {
                                this.presentToast('Ocurrio un error al actualizar el usuario', false);
                                this.loader.hideLoader();
                            });
                        }).catch(error => {
                            this.presentToast('Ocurrio un error al crear EL EQUIPO', false);
                            this.loader.hideLoader();
                        });

                    }
                }
            ]
        });

        await alert.present();
    }

    buscarEquipos() {
        const result = Equipo.validar(this.equipoObjeto);
        if (result) {
            return this.presentToast(result, false);
        }
        this.loader.showLoader();
        this.crudService.read(this.tables.tablas().EQUIPO).subscribe(data => {
            this.listaEquiposMostrar = this.crudService.construir(data) as Array<Equipo>;
            this.listaEquiposTemp = this.listaEquiposMostrar;
            this.listaEquiposMostrar = this.listaEquiposMostrar.filter(x => x.nombre.toLowerCase().includes(this.equipoObjeto.nombre.toLowerCase()));
            this.loader.hideLoader();
        }, error1 => this.loader.hideLoader());
    }


// elimiar() {
//   this.loader.showLoader();
//   this.crudService.delete(this.tables.tablas().EQUIPO, this.equipoObjeto).then(resp => {
//       this.loader.hideLoader();
//       this.cerrarModal();
//   }).catch(error => {
//       this.presentToast('Ocurrio un error al borrar el equipo', false);
//       this.loader.hideLoader();
//   });
// }

//
// uploadFile(event: FileList) {
//   // The File object
//   const file = event.item(0);
//
//   // Validation for Images Only
//   if (file.type.split('/')[0] !== 'image') {
//       console.error('unsupported file type :( ');
//       return;
//   }
//
//   this.isUploading = true;
//   this.isUploaded = false;
//   this.fileName = file.name;
//
//   // The storage path
//   const path = `SoccerMatchStorage/${new Date().getTime()}_${file.name}`;
//   // Totally optional metadata
//   const customMetadata = {app: 'Soccer Match Images'};
//   // File reference
//   const fileRef = this.storage.ref(path);
//   // The main task
//   this.task = this.storage.upload(path, file, {customMetadata});
//   // Get file progress percentage
//   this.percentage = this.task.percentageChanges();
//
//   this.snapshot = this.task.snapshotChanges().pipe(
//       finalize(() => {
//           // Get uploaded file storage path
//           this.UploadedFileURL = fileRef.getDownloadURL();
//
//           this.UploadedFileURL.subscribe(resp => {
//               this.addImagetoDB({
//                   name: file.name,
//                   filepath: resp,
//                   size: this.fileSize
//               });
//               this.equipoObjeto.imagen = resp;
//               this.isUploading = false;
//               this.isUploaded = true;
//           }, error => {
//               console.error(error);
//           });
//       }),
//       tap(snap => {
//           this.fileSize = snap.totalBytes;
//       })
//   );
// }
//
// addImagetoDB(image: MyData) {
//   // Create an ID for document
//   const id = this.database.createId();
//
//   // Set document id with value in database
//   this.imageCollection.doc(id).set(image).then(resp => {
//       console.log(resp);
//   }).catch(error => {
//       console.log('error ' + error);
//   });
// }

    editarEquipo() {
        if (!this.editar) {
            this.editar = true;
            return;
        }
        if (this.editar) {
            this.loader.showLoader();
            this.crudService.update(this.tables.tablas().EQUIPO, this.equipoObjeto).then(resp => {
                this.loader.hideLoader();
                this.presentToast('Equipo guardado correctamente', true);
            }).catch(error => {
                this.presentToast('Ocurrio un error al actualizar el EQUIPO', false);
                this.loader.hideLoader();
            });

            this.editar = false;
        }
    }

    async presentToast(msj: string, status: boolean) {
        const toast = await this.toastController.create({
            message: msj,
            duration: 2000,
            position: 'bottom',
            color: !status ? 'danger' : 'success'
        });
        toast.present();
    }
}

