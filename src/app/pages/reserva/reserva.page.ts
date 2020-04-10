import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController, ToastController} from "@ionic/angular";
import {AuthenticationService} from "../../services/authentication.service";
import {FormBuilder} from "@angular/forms";
import {LoaderService} from "../../services/loader.service";
import {CrudService} from "../../service/crud.service";
import {TablesService} from "../../service/tables.service";
import {Reserva} from "../../models/Reserva";
import {Usuario} from "../../models/usuario";
import {SMS} from '@ionic-native/sms/ngx';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {MostrarCanchaComponent} from "../../components/mostrar-cancha/mostrar-cancha.component";

@Component({
    selector: 'app-reserva',
    templateUrl: './reserva.page.html',
    styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {

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

    ngOnInit() {
        this.loader.showLoader();
        this.crudService.read(this.tables.tablas().RESERVA).subscribe(data => {
            const reservas = this.crudService.construir(data) as Array<Reserva>;

            this.authService.getDataUser().then(res => {
                const usuario = res as Usuario;
                this.reservas = reservas.filter(reservas => {
                    return reservas.usuario.id === usuario.id;
                });
                this.loader.hideLoader();
            });
        });
        this.filtro = 'PENDIENTE';
    }


    pagar() {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(() => {

            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
                    intent: 'INTENT'  // send SMS with the native android SMS messaging
                    //intent: '' // send SMS without opening any other app
                }
            };

            this.sms.send('89582736', 'Hello world!', options)
                .then(res => console.log('Launched dialer!', res))
                .catch(err => this.presentToast('Error launching dialer ' + err, false));
        }).catch((err) => {
            alert(JSON.stringify(err));
        });
    }

    //
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

    fechaCompleta(dia, tipo) {

        const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const date = new Date(dia);

        const fechaNum = date.getDate();
        const mes_name = date.getMonth();

        if (tipo === "dia") {
            return dias[date.getDay() - 1];
        }

        if (tipo === "mes") {
            return meses[mes_name];
        }

        if (tipo === "numero") {
            return fechaNum;
        }

        if (tipo === "anno") {
            return date.getFullYear();
        }

        if (tipo === "hora") {
            return date.getHours() + ":00";
        }

        return "";
    }

    llamar() {
        this.callNumber.callNumber("89582736", true)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => this.presentToast('Error launching dialer ' + err, false));
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


    async mostrarModalAsync(value) {
        const modal = await this.modalController.create({
            component: MostrarCanchaComponent,
            cssClass: 'my-custom-modal-css',
            componentProps: {
                cancha: value
            }
        });
        return await modal.present();
    }

    mostrarModal(value) {
        this.mostrarModalAsync(value);
    }


    async agregarEquipo() {
        const alert = await this.alertController.create({
            header: '¿Agregar un equipo?',
            message: "Al selecionar un equipo se creara un reto",
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

                    }
                }
            ]
        });

        await alert.present();
    }


    async realizarPago() {
        const alert = await this.alertController.create({
            header: '¡Realizar Pago!',
            message: "Desea enviar un SMS con el pago por Simpe Movil",
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
                        this.pagar();
                    }
                }
            ]
        });

        await alert.present();
    }

}
