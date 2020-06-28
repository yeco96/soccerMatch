import {Component, OnInit} from '@angular/core';
import {TablesService} from 'src/app/service/tables.service';
import {CrudService} from 'src/app/service/crud.service';
import {LoaderService} from 'src/app/services/loader.service';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {MyData, UbicacionEquipo} from 'src/app/models/equipo';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Equipo} from '../models/equipo';
import {AuthenticationService} from "../services/authentication.service";
import {Usuario} from "../models/usuario";
import {Canton, Ubicacion} from "../models/ubicacion";
import {Cancha} from "../models/cancha";
import {Noticias} from 'src/app/models/noticias';
import {Partido} from 'src/app/models/partido';


@Component({
    selector: 'app-crear-equipo',
    templateUrl: './crear-equipo.component.html',
    styleUrls: ['./crear-equipo.component.scss'],
})
export class CrearEquipoComponent implements OnInit {
     /* Inicializacion de Objetos y variables*/
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
    filtro: string;

    private imageCollection: AngularFirestoreCollection<MyData>;
/* Inicializacion de Objetos*/
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
        this.filtro = 'LISTO';
    }

/* Inicializacion de Variables y referencias a otras tablas*/ 
    actualizar: boolean;
    equipos = new Array<Equipo>();
    equipoObjeto: Equipo;
    usuario: Usuario;
    obj: Equipo;
    esLider: boolean;
    tieneEquipo: boolean;

    listaEquipos = new Array<Equipo>();
    listaEquiposTemp = new Array<Equipo>();
    listaEquiposMostrar = new Array<Equipo>();


    ubicacion = new Array<Ubicacion>();
    ubicacionJSON: any;
    provincia: Ubicacion;
    canton: Canton;
    cantidadJugadores: any;
    noticia = new Noticias();
    partido= new Array<Partido>();

    canchasTemp: Cancha;

    /* Metodo para crear equipo*/ 
    ngOnInit() {
        /* Inicializacion de Variables */ 
        this.equipoObjeto = new Equipo();
        this.usuario = new Usuario();
        /* Loader de datos*/ 
        this.loader.showLoader();
        this.authService.getDataUser().then(res => {
            this.usuario = res;

            /* Verifica si el usuario no es lider y el campo de lider esta vacio luego si el campo usuario que pertenece al equipo esta vacio*/ 
            if ((!this.usuario.liderEquipo || this.usuario.liderEquipo == "") && (!this.usuario.perteneceEquipo || this.usuario.perteneceEquipo == "")) {
                this.loader.hideLoader();
                return;
            }
            /* Servicio de read con la tabla para el mantenimiento*/ 
            this.crudService.read(this.tables.tablas().EQUIPO).subscribe(data => {
                this.listaEquipos = this.crudService.construir(data) as Array<Equipo>;

                this.equipoObjeto = this.listaEquipos.filter(x => {
                    /*Si es el creador es lider y si no solo es un miembro mas del equipo */
                    if (this.usuario.liderEquipo) {
                        return x.id === this.usuario.liderEquipo;
                    }

                    if (this.usuario.perteneceEquipo) {
                        return x.id === this.usuario.perteneceEquipo;
                    }

                })[0];
                /* Validaciones*/ 
                if (this.equipoObjeto.ubicacion == undefined) {
                    this.equipoObjeto.ubicacion = new UbicacionEquipo();
                }

                this.cantidadJugadores = this.equipoObjeto.jugardores.filter(x => x.miembro).length;

                if (this.usuario.liderEquipo) {
                    this.esLider = true;
                    this.tieneEquipo = true;
                }

                if (this.usuario.perteneceEquipo) {
                    this.esLider = false;
                    this.tieneEquipo = true;
                }

                if (this.tieneEquipo) {
                    this.crudService.read(this.tables.tablas().PARTIDO).subscribe(data => {
                        let partidos = this.crudService.construir(data) as Array<Partido>;

                        this.partido = partidos.filter(a => {
                            return a.equipoA.id == this.equipoObjeto.id || a.equipoB.id == this.equipoObjeto.id;
                        })
                    }, error1 => {
                        this.presentToast('Ocurrio un error al cargar el historial', false)
                    });
                }

                this.loader.hideLoader();
            });

        }, reason => {
            this.loader.hideLoader();
        });

        this.crudService.read(this.tables.ubicacion().UBICACION).subscribe(data => {
            this.ubicacion = this.crudService.construir(data) as Array<Ubicacion>;
            this.ubicacionJSON = JSON.parse(JSON.stringify(this.ubicacion));
        }, error1 => {
            this.presentToast('Ocurrio un error al cargar las canchas', false)
        });

    }

/* Obtener datos de la tabla*/ 
    obtenerDatos() {
        this.loader.showLoader();
        this.authService.getDataUser().then(res => {
            this.usuario = res;

            if ((!this.usuario.liderEquipo || this.usuario.liderEquipo == "") && (!this.usuario.perteneceEquipo || this.usuario.perteneceEquipo == "")) {
                this.loader.hideLoader();
                return;
            }

            this.crudService.read(this.tables.tablas().EQUIPO).subscribe(data => {
                this.listaEquipos = this.crudService.construir(data) as Array<Equipo>;

                this.equipoObjeto = this.listaEquipos.filter(x => {

                    if (this.usuario.liderEquipo) {
                        return x.id === this.usuario.liderEquipo;
                    }

                    if (this.usuario.perteneceEquipo) {
                        return x.id === this.usuario.perteneceEquipo;
                    }

                })[0];

                if (this.equipoObjeto.ubicacion == undefined) {
                    this.equipoObjeto.ubicacion = new UbicacionEquipo();
                }

                this.cantidadJugadores = this.equipoObjeto.jugardores.filter(x => x.miembro).length;

                if (this.usuario.liderEquipo) {
                    this.esLider = true;
                    this.tieneEquipo = true;
                }

                if (this.usuario.perteneceEquipo) {
                    this.esLider = false;
                    this.tieneEquipo = true;
                }


                this.loader.hideLoader();
            });

        }, reason => {
            this.loader.hideLoader();
        });
    }


    cerrarModal() {
        this.actualizar = false;
        this.modalController.dismiss();
    }
    /* Obtebner datos de ubicacion*/ 
    datosUbicacion(provincia, canton) {
        if (provincia != null && canton == null) {
            const result = this.ubicacion.filter(x => x.codigoProvincia == provincia);
            return result[0].descripcion;
        }

        if (provincia != null && canton != null) {
            const prov = this.ubicacion.filter(x => x.codigoProvincia == provincia)[0];
            const result = prov.canton.filter(c => c.codigoCanton == canton);
            return result[0].descripcion;
        }
    }
    /* Enviar solicitud de validacion de un miembro del equipo de forma Async*/ 
    async enviarSolicitud(equipo: Equipo) {


        if (equipo.jugardores) {
            const validar = equipo.jugardores.filter(x => x.usuario.uid == this.usuario.uid);

            if (validar.length > 0) {

                const jugador = validar[0];
                /*Se indica la reaspuesta a la solicitud */
                if (jugador.miembro) {
                    return this.presentToast('El usuario ya es un miembro del equipo', true);
                }

                if (jugador.estado === "RECHAZADO") {
                    return this.presentToast('El usuario no fue aceptado en el grupo', false);
                }

                if (jugador.estado === "PENDIENTE") {
                    return this.presentToast('Ya existe una solicitud al equipo', false);
                }

            }
        }

        /* Verificacion si desear enciar la solicitud para pertenecer a un equipo*/ 
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
                    /*Se procede/no procede con la solicitud de actualizacion al equipo */
                    text: 'Aceptar',
                    handler: () => {
                        if (equipo.jugardores == undefined) {
                            equipo.jugardores = [];
                        }
                        equipo.jugardores.push({
                            usuario: this.usuario,
                            miembro: false,
                            estado: 'PENDIENTE',
                            lider: false
                        });
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

    /* Metodo para crear un equipo*/ 
    async crearEquipo() {

        const result = Equipo.validar(this.equipoObjeto);

        if (result) {
            return this.presentToast(result, false);
        }
        /*Metodo inicializacion de actualizar*/
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

        /*Metodo de creacion de un quipo */
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
                        if (this.equipoObjeto.jugardores == undefined) {
                            this.equipoObjeto.jugardores = [];
                        }
                        this.equipoObjeto.jugardores.push({
                            usuario: this.usuario,
                            miembro: true,
                            estado: 'LISTO',
                            lider: true
                        });


                        /*Si cumple con las verificaciones se realiza la creacion */
                        this.noticia.fecha = this.formattedDate();
                        this.noticia.tipo = 'Equipo';
                        this.noticia.descripcion="Se creo el equipo "+this.equipoObjeto.nombre;
                        this.crudService.create(this.tables.tablas().EQUIPO, this.equipoObjeto, this.noticia).then(resp => {
                            this.usuario.liderEquipo = resp.id;
                            this.crudService.update(this.tables.tablas().USUARIO, this.usuario).then(resp => {
                                this.loader.hideLoader();
                                this.obtenerDatos();
                                this.listaEquiposMostrar = [];
                                this.presentToast('Equipo guardado correctamente', true);
                            }).catch(error => {
                                this.presentToast('Ocurrio un error al actualizar el equipo', false);
                                this.loader.hideLoader();
                            });
                        }).catch(error => {
                            this.presentToast('Ocurrio un error al crear EL EQUIPO', false);
                            this.loader.hideLoader();
                        });

            /*this.authService.getDataUser().then(res => {
            this.canchaObjeto.usuarioCrea = res;
            this.noticia.fecha = this.formattedDate();
            this.noticia.tipo = 'Cancha';
            this.noticia.descripcion = 'Se agrego la cancha ' + this.canchaObjeto.nombre + ' con el telefono: ' + this.canchaObjeto.telefono;
            this.crudService.create(this.tables.tablas().CANCHAS, this.canchaObjeto, this.noticia).then(resp => {
                this.presentToast('Se registro la cancha correctamente', true);
                this.loader.hideLoader();
                this.cerrarModal();
            }).catch(error => {
                this.presentToast('Ocurrio un error al crear la cancha', false);
                this.loader.hideLoader();
            });
        });*/
                    }
                }
            ]
        });

        await alert.present();
    }
/* Metodo para buscar equipos*/ 
    buscarEquipos() {
        const result = Equipo.validar(this.equipoObjeto);
        if (result) {
            return this.presentToast(result, false);
        }
        this.loader.showLoader();
        this.crudService.read(this.tables.tablas().EQUIPO).subscribe(data => {

            if (this.tieneEquipo) {
                return;
            }

            this.listaEquiposMostrar = this.crudService.construir(data) as Array<Equipo>;
            this.listaEquiposTemp = this.listaEquiposMostrar;
            this.listaEquiposMostrar = this.listaEquiposMostrar.filter(x => x.nombre.toLowerCase().includes(this.equipoObjeto.nombre.toLowerCase()));
            this.loader.hideLoader();
        }, error1 => this.loader.hideLoader());
    }

    /* Validacion de la solicitud si es aprobada o rechazada*/ 
    async validarSolicitud(estado, jugador) {
        const estadoStr = (estado ? 'Aprobar' : 'Rechazar');
        const titulo = estado ? 'Aprobar Solicitud' : 'Rechazar Solicitud';
        const alert = await this.alertController.create({
            header: titulo,
            message: "¿Desea " + estadoStr + " al jugador?",
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

                        this.equipoObjeto.jugardores.forEach(x => {
                            if (JSON.stringify(x) === JSON.stringify(jugador)) {
                                if (estado) {
                                    x.miembro = true;
                                    x.estado = 'LISTO';
                                } else {
                                    x.miembro = false;
                                    x.estado = 'RECHAZADO';
                                }
                            }
                        });

                        this.crudService.update(this.tables.tablas().EQUIPO, this.equipoObjeto).then(resp => {
                            this.crudService.update_S(this.tables.tablas().USUARIO, jugador.usuario.id, {perteneceEquipo: this.equipoObjeto.id}).then(resp => {
                                this.loader.hideLoader();
                                this.listaEquiposMostrar = [];
                            }).catch(error => {
                                this.presentToast('Ocurrio un error al actualizar el usuario', false);
                                this.loader.hideLoader();
                            });
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

    changeProvincia() {
        if (this.equipoObjeto.ubicacion.codigoProvincia) {
            this.provincia = this.ubicacion.find(x => x.codigoProvincia.toString() === this.equipoObjeto.ubicacion.codigoProvincia.toString());
        }
    }
    /* Metodo para borrar cancha*/ 
    async borrarCancha() {

        const alert = await this.alertController.create({
            header: 'Borrar equipo',
            message: "¿Desea borrar su equipo?",
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

                        this.usuario.liderEquipo = "";

                        this.equipoObjeto.jugardores.forEach(value => {
                            this.crudService.update_S(this.tables.tablas().USUARIO, value.usuario.id, {
                                liderEquipo: "",
                                perteneceEquipo: ""
                            })
                        });

                        this.crudService.delete(this.tables.tablas().EQUIPO, this.equipoObjeto);
                        this.cerrarModal();
                        this.loader.hideLoader();
                        this.listaEquiposMostrar = [];
                    }
                }
            ]
        });

        await alert.present();

    }
    /* Metodo para editar un equipo*/ 
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
/*Toast controller para el servicio Async */
    async presentToast(msj: string, status: boolean) {
        const toast = await this.toastController.create({
            message: msj,
            duration: 2000,
            position: 'bottom',
            color: !status ? 'danger' : 'success'
        });
        toast.present();
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

    

}

