import { Component, OnInit } from '@angular/core';
import { Solicitud, Reto } from 'src/app/models/reto';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { TablesService } from 'src/app/service/tables.service';
import { CrudService } from 'src/app/service/crud.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-aceptar-reto',
  templateUrl: './aceptar-reto.component.html',
  styleUrls: ['./aceptar-reto.component.scss'],
})
export class AceptarRetoComponent implements OnInit {

  solicitud: Array<Solicitud>;
  reto: Reto;

  constructor(
          public modalController: ModalController,
          private tables: TablesService,
          private crudService: CrudService,
          private loader: LoaderService,
          public toastController: ToastController,
          public alertController: AlertController
  ) { }

  ngOnInit() {
    console.log(this.solicitud);
  }

  cerrarModal() {
      this.modalController.dismiss();
  }

  async aceptar(value: Solicitud) {
    const alert = await this.alertController.create({
        header: '¡Solicitud!',
        message: "Desea aceptar la solicutud de " + value.equipo.nombre,
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

                  this.reto.partido.equipoB = value.equipo;
                  this.reto.estado = "LISTO";

                    this.loader.showLoader();
                    this.crudService.update(this.tables.tablas().RETOS, this.reto).then(resp => {
                        this.presentToast('Se acepto la solitud', true);
                        this.loader.hideLoader();
                        this.modalController.dismiss();
                    }).catch(error => {
                        this.presentToast('Ocurrio un error al enviar la solitud', false);
                        this.loader.hideLoader();
                    });
                }

            }
        ]
    });

    await alert.present();
  }

  /*Toast controller para el servicio Async y definir una configuracion */
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
