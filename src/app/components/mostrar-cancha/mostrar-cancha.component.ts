import {Component, OnInit} from '@angular/core';
import {Cancha} from "../../models/cancha";
import {CallNumber} from "@ionic-native/call-number/ngx";
import {ToastController} from "@ionic/angular";
import {AndroidPermissions} from "@ionic-native/android-permissions/ngx";
import {SMS} from "@ionic-native/sms/ngx";

@Component({
    selector: 'app-mostrar-cancha',
    templateUrl: './mostrar-cancha.component.html',
    styleUrls: ['./mostrar-cancha.component.scss'],
})
export class MostrarCanchaComponent implements OnInit {

    constructor(private callNumber: CallNumber,
                private sms: SMS,
                public toastController: ToastController,
                public androidPermissions: AndroidPermissions) {
    }

    cancha: Cancha;

    ngOnInit() {

    }

    llamar(numero) {
        this.callNumber.callNumber(numero, true)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => this.presentToast('Error al enviar al marcar: ' + err, false));
    }


    mensaje(numero) {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(() => {

            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
                    intent: 'INTENT'  // send SMS with the native android SMS messaging
                    //intent: '' // send SMS without opening any other app
                }
            };

            this.sms.send(numero, 'Soccer Match: Solicitud de informacion sobre la reserva', options)
                .then(res => console.log('Launched dialer!', res))
                .catch(err => this.presentToast('Error al enviar al enviar el mensaje ' + err, false));
        }).catch((err) => {
            this.presentToast('Error al enviar al enviar el mensaje ' + JSON.stringify(err), false)
        });
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
