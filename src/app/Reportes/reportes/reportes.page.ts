import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController, ToastController} from "@ionic/angular";
import {AuthenticationService} from "../../services/authentication.service";
import {FormBuilder} from "@angular/forms";
import {LoaderService} from "../../services/loader.service";
import {CrudService} from "../../service/crud.service";
import {TablesService} from "../../service/tables.service";
import {Reserva} from "../../models/Reserva";
import {SMS} from '@ionic-native/sms/ngx';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';

@Component({
    selector: 'app-reserva',
    templateUrl: './reportes.page.html',
    styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {

    constructor(
        private navCtrl: NavController,
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private loader: LoaderService,
        private crudService: CrudService,
        private tables: TablesService,
        public modalController: ModalController,
        private sms: SMS,
        private callNumber: CallNumber,
        public alertController: AlertController,
        public toastController: ToastController,
        public androidPermissions: AndroidPermissions
    ) {
    }

    reservas = new Array<Reserva>();
    filtro: string;
    filtroTotales: string;
    /*this.usuarios = this.crudService.construir(data) as Array<Usuario>;
    this.usuariosTemp=this.usuarios;
    this.loader.hideLoader();*/

    montoReserva: any;
    filtroTipo: string;

    ngOnInit() {
        this.loader.showLoader();
        this.filtro = 'LISTADO';
        this.filtroTotales = 'PENDIENTE';
        this.filtroTipo = 'TODO';
        this.crudService.read(this.tables.tablas().RESERVA).subscribe(data => {
            this.reservas = this.crudService.construir(data) as Array<Reserva>;
            this.montoReserva = 0;
            this.reservas.forEach(x => {
                if (this.filtroTotales === x.estado) {
                    this.montoReserva += x.cancha.montoEquipo;
                }
            });

            this.loader.hideLoader();
        });
    }

    cargarDatos() {
        this.crudService.read(this.tables.tablas().RESERVA).subscribe(data => {
            this.reservas = this.crudService.construir(data) as Array<Reserva>;
            this.montoReserva = 0;
            this.reservas.forEach(x => {

                if (this.filtroTotales === x.estado) {

                    if (this.filtroTipo === 'TODO') {
                        this.montoReserva += x.cancha.montoEquipo;
                    } else {
                        if (this.filtroTipo === x.cancha.metodoPago.tipo) {
                            this.montoReserva += x.cancha.montoEquipo;
                        }
                    }

                }
                if (this.filtroTotales === 'TODO') {
                    this.montoReserva += x.cancha.montoEquipo;
                }
            });
            this.loader.hideLoader();
        });
    }

    /*Metodo para darle formato al dia */
    fechaCompleta(dia) {
        const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        // tslint:disable-next-line: max-line-length
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const date = new Date(dia);

        const fechaNum = date.getDate();
        const mes_name = date.getMonth();

        return (dias[date.getDay() - 1] + ' ' + fechaNum + ' de ' + meses[mes_name] + ' de ' + date.getFullYear());
    }

    /*ngOnInit2() {
      this.loader.showLoader();
      this.crudService.read(this.tables.tablas().RESERVA).subscribe(data => {
          this.reservas = this.crudService.construir(data) as Array<Reserva>;
          
         this.authService.getDataUser().then(res => {
              const usuario = res as Usuario;
              /*this.reservas = reservas.filter(reservas => {
                  return reservas.usuario.id === usuario.id;
              });
              this.loader.hideLoader();
          }, reason => {
              this.loader.hideLoader();
          });
      });
      this.filtro = 'PENDIENTE';
  }*/

    /*compareValues(key, order = 'asc') {
      return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // property doesn't exist on either object
          return 0;
        }
    
        const varA = (typeof a[key] === 'string')
          ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
          ? b[key].toUpperCase() : b[key];
    
        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return (
          (order === 'desc') ? (comparison * -1) : comparison
        );
      };
    }*/


    // async mostrarCancha(cancha: Cancha) {
    //     const alert = await this.alertController.create({
    //         header: cancha.nombre,
    //         cssClass: 'ion-text-center',
    //         inputs: [
    //             {
    //                 name: 'Dirrección',
    //                 type: 'text',
    //                 value: cancha.direccion,
    //                 disabled: true
    //             },
    //             {
    //                 name: 'Telefono',
    //                 type: 'text',
    //                 value: cancha.telefono != undefined ? cancha.telefono : "Sin Telefono",
    //                 disabled: true
    //             }
    //         ],
    //         buttons: [
    //             {
    //                 text: 'Llamar',
    //                 handler: () => {
    //                     console.log('Confirm Ok');
    //                 }
    //             },
    //             {
    //                 text: 'Listo',
    //                 handler: () => {
    //                     console.log('Confirm Ok');
    //                 }
    //             }
    //         ]
    //     });
    //
    //     await alert.present();
    // }


}

