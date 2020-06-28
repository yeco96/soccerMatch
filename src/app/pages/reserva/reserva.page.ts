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
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {MostrarCanchaComponent} from "../../components/mostrar-cancha/mostrar-cancha.component";
import {Cancha} from "../../models/cancha";
import {CrearEquipoComponent} from "../../crear-equipo/crear-equipo.component";
import {Equipo} from "../../models/equipo";

@Component({
    selector: 'app-reserva',
    templateUrl: './reserva.page.html',
    styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
    /* Inicializacion de Objetos*/
    constructor(
        private navCtrl: NavController,
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private loader: LoaderService,
        private crudService: CrudService,
        private tables: TablesService,
        public modalController: ModalController,
        private sms: SMS,
        public alertController: AlertController,
        public toastController: ToastController,
        public androidPermissions: AndroidPermissions
    ) {
    }

    /* Inicializacion de Variables*/
    reservas = new Array<Reserva>();
    filtro: string;
    usuario: Usuario;
    tipoReto: boolean;
    equipoObjeto: Equipo;

    /*Integracion del crud loader service para la conexion Async y lectura de reservas*/
    ngOnInit() {
        this.loader.showLoader();
        this.crudService.read(this.tables.tablas().RESERVA).subscribe(data => {
            const reservas = this.crudService.construir(data) as Array<Reserva>;

            this.authService.getDataUser().then(res => {
                this.usuario = res as Usuario;
                this.reservas = reservas.filter(reservas => {
                    return reservas.usuario.id === this.usuario.id;
                });


                if ((!this.usuario.liderEquipo || this.usuario.liderEquipo == "") && (!this.usuario.perteneceEquipo || this.usuario.perteneceEquipo == "")) {
                    this.loader.hideLoader();
                    this.equipoObjeto = undefined;
                    return;
                }

                /* Servicio de read con la tabla para el mantenimiento*/
                this.crudService.read(this.tables.tablas().EQUIPO).subscribe(data => {
                    const equipos = this.crudService.construir(data) as Array<Equipo>;

                    this.equipoObjeto = equipos.filter(x => {
                        /*Si es el creador es lider y si no solo es un miembro mas del equipo */
                        if (this.usuario.liderEquipo) {
                            return x.id === this.usuario.liderEquipo;
                        }

                        if (this.usuario.perteneceEquipo) {
                            return x.id === this.usuario.perteneceEquipo;
                        }

                    })[0];

                    this.loader.hideLoader();
                });



            }, reason => {
                this.loader.hideLoader();
            });
        });
        this.filtro = 'PENDIENTE';
    }

    /*Metodo para realizar un pago de la reserva  */
    pagar(cancha: Cancha) {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(() => {
            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
                    intent: 'INTENT'  // send SMS with the native android SMS messaging
                    //intent: '' // send SMS without opening any other app
                }
            };

            const pago = "PASE " + cancha.montoEquipo + " " + cancha.telefonoSinpe + " PAGO RESERVA CANCHA";
            this.sms.send("+2627", pago, options)
                .then(res => console.log('Launched dialer!', res))
                .catch(err => this.presentToast('Error al enviar al enviar el mensaje ' + err, false));
        }).catch((err) => {
            this.presentToast('Error al enviar al enviar el mensaje ' + JSON.stringify(err), false)
        });
    }

    /*Metodo para obtener una fecha completa */
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

    /*Metodo para mostrar un CSS en servicio Async */
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

    /*Metodo  para mostrar el modal de crear una cancha*/
    async crearCancha() {
        const modal = await this.modalController.create({
            component: CrearEquipoComponent
        });
        await modal.present();
    }

    /*Metodo para agregar un equipo */
    async agregarEquipo(reserva) {


        await this.authService.getDataUser().then(res => {
            this.usuario = res as Usuario;
            this.loader.hideLoader();
        }, reason => {
            this.loader.hideLoader();
        });

        if ((!this.usuario.liderEquipo || this.usuario.liderEquipo === "") && (!this.usuario.perteneceEquipo || this.usuario.perteneceEquipo === "")) {
            this.presentToast('Error usuario no pertence a un equipo ', false);
            this.equipoObjeto = undefined;

            const alert = await this.alertController.create({
                header: '¿Equipo?',
                message: "Desea crear o unirse a un equipo",
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
                            this.crearCancha();
                        }
                    }
                ]
            });

            await alert.present();

            return;
        }


        const alert = await this.alertController.create({
            header: '¿Agregar un equipo?',
            message: "Al selecionar un equipo se creara un reto",
            inputs: [{
                type: "radio",
                name: 'Amistoso',
                value: 'Amistoso',
                label: 'Amistoso',
                checked: true
            }, {
                type: "radio",
                name: 'Competitivo',
                value: 'Competitivo',
                label: 'Competitivo',
                checked: false
            }],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'cancelar',
                    handler: () => {

                    }
                }, {
                    text: 'Aceptar',
                    handler: data => {
                        if (!reserva.tipo) {
                            reserva.tipo = {};
                        }
                        reserva.tipo.nombre = data;
                        this.crearReto(reserva);
                    }
                }
            ]
        });

        await alert.present();
    }

    /*Metodo  para crear un reto*/
    async crearReto(value) {


      const alert = await this.alertController.create({
          header: 'Crear!',
          message: "Desea crear el reto",
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
                    if (!value.partido) {
                        value.partido = {};
                    }
                    if (this.equipoObjeto && this.equipoObjeto.id == undefined) {
                        return this.presentToast('Intentelo nuevamente', false);
                    }

                    value.partido.equipoA = this.equipoObjeto;
                    this.crudService.create(this.tables.tablas().RETOS, value).then(resp => {

                        value.estado = 'RETO';
                        value.idReto = resp.id;
                        this.crudService.update(this.tables.tablas().RESERVA, value).then(resp => {
                            this.presentToast('Se creo el reto', true);
                            this.loader.hideLoader();
                        }).catch(error => {
                            this.presentToast('Ocurrio un error al crear el reto', false);
                            this.loader.hideLoader();
                        });

                    }).catch(error => {
                        this.presentToast('Ocurrio un error al crear el reto', false);
                        this.loader.hideLoader();
                    });
                  }

              }
          ]
      });

      await alert.present();



    }

    /*Metodo  para cerrar un reto*/
    async cerrarReto(value) {



      const alert = await this.alertController.create({
      header: 'Elminar!',
      message: "Desea eliminar el reto y mantener la reserva",
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
                this.crudService.delete(this.tables.tablas().RETOS, {id: value.idReto}).then(resp => {

                    value.estado = 'PENDIENTE';
                    value.idReto = "";
                    this.crudService.update(this.tables.tablas().RESERVA, value).then(resp => {
                        this.presentToast('Se creo el reto', true);
                        this.loader.hideLoader();
                    }).catch(error => {
                        this.presentToast('Ocurrio un error al crear el reto', false);
                        this.loader.hideLoader();
                    });

                }).catch(error => {
                    this.presentToast('Ocurrio un error al crear el reto', false);
                    this.loader.hideLoader();
                });
              }

          }
      ]
  });

  await alert.present();




    }

    /*Metodo  para realizar un pago de manera Async*/
    async realizarPago(cancha: Cancha) {


        if (cancha.metodoPago.tipo == 'EFECTIVO') {
            const alert = await this.alertController.create({
                header: '¡Realizar Pago!',
                message: "El pago se realiza en sitio",
                buttons: [
                    {
                        text: 'OK',
                        handler: () => {

                        }
                    }
                ]
            });

            await alert.present();
            return;
        }


        const alert = await this.alertController.create({
            header: '¡Realizar Pago!',
            message: "Desea realizar el pago por Simpe Movil",
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
                        this.pagar(cancha);
                    }
                }
            ]
        });

        await alert.present();
    }

    async elimarReserva(value) {
      const alert = await this.alertController.create({
      header: 'Elminar!',
      message: "Desea eliminar la reserva y liberar el campo",
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
                  this.crudService.read(this.tables.tablas().CANCHAS).subscribe(data => {
                      const canchas = this.crudService.construir(data) as Array<Cancha>;

                      canchas.forEach(c => {

                        let borrar = false;

                        if (c.reserva) {
                          c.reserva.forEach((item, index) => {
                            if (item.idReserva === value.id) {
                              borrar = true;
                              c.reserva.splice(index, 1);
                            }
                          });

                          if (borrar) {
                            this.crudService.update(this.tables.tablas().CANCHAS, c).then(resp => {

                              this.crudService.delete(this.tables.tablas().RESERVA, { id: value.id }).then(resp => {
                                this.presentToast('Correcto', true);
                                this.loader.hideLoader();
                              }).catch(error => {
                                this.presentToast('Ocurrio un error al crear el reto', false);
                                this.loader.hideLoader();
                              });

                            }).catch(error => {
                              this.presentToast('Ocurrio un error al crear el reto', false);
                              this.loader.hideLoader();
                            });
                          }


                        }

                      });

                      this.loader.hideLoader();
                  });



              }

          }
      ]
  });

  await alert.present();

    }

}
