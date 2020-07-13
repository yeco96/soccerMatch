import {Component, OnInit} from '@angular/core';
import {TablesService} from 'src/app/service/tables.service';
import {CrudService} from 'src/app/service/crud.service';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {CrearReservaComponent} from "../../components/crear-reserva/crear-reserva.component";
import {Router} from "@angular/router";
import {Usuario} from "../../models/usuario";
import {Equipo} from "../../models/equipo";
import {AuthenticationService} from "../../services/authentication.service";
import {LoaderService} from "../../services/loader.service";
import {CrearEquipoComponent} from "../../crear-equipo/crear-equipo.component";
import {Reto} from "../../models/reto";
import { AceptarRetoComponent } from 'src/app/components/aceptar-reto/aceptar-reto.component';
import { Partido } from 'src/app/models/partido';

@Component({
    selector: 'app-retos',
    templateUrl: './retos.page.html',
    styleUrls: ['./retos.page.scss'],
})
export class RetosPage implements OnInit {
    /* Inicializacion de Objetos*/
    constructor(
        private tables: TablesService,
        private crudService: CrudService,
        public modalController: ModalController,
        private router: Router,
        private authService: AuthenticationService,
        private loader: LoaderService,
        public toastController: ToastController,
        public alertController: AlertController
    ) {
    }

    /*Integracion del componente de crear una reserva apartir de un reto */
    async presentModal() {
        const modal = await this.modalController.create({
            component: CrearReservaComponent,
        });
        return await modal.present();
    }

    mostrarModal() {
        this.presentModal();
    }

    /* Inicializacion de Variables*/
    retos = new Array<Reto>();
    usuario: Usuario;
    equipoObjeto: Equipo;
    filtro: string;

    /*Integracion del crud loader service para la conexion Async y lectura de retos */
    ngOnInit() {
        this.filtro = 'TODO';

        this.crudService.read(this.tables.tablas().RETOS).subscribe(data => {
            this.retos = this.crudService.construir(data) as Array<Reto>;
        });


        /* Servicio de read con la tabla para el mantenimiento*/
        this.crudService.read(this.tables.tablas().EQUIPO).subscribe(data => {
            const equipos = this.crudService.construir(data) as Array<Equipo>;

            this.authService.getDataUser().then(res => {
                this.usuario = res as Usuario;

                if ((!this.usuario.liderEquipo || this.usuario.liderEquipo == "") && (!this.usuario.perteneceEquipo || this.usuario.perteneceEquipo == "")) {
                    this.equipoObjeto = undefined;
                    this.loader.hideLoader();
                    return;
                }

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
            }, reason => {
                this.loader.hideLoader();
            });

        });
    }

    validarPropietario(reto: Reto) {
        if (this.filtro == 'TODO') {
            return true;
        }
        return reto.usuario.uid === this.usuario.uid;
    }


    /*metodo para obtener la fecha completa */
    fechaCompleta(dia) {
        const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        // tslint:disable-next-line: max-line-length
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const date = new Date(dia);

        const fechaNum = date.getDate();
        const mes_name = date.getMonth();

        return (dias[date.getDay() - 1] + ' ' + fechaNum + ' de ' + meses[mes_name] + ' de ' + date.getFullYear()) + ' a las ' + date.getHours() + ' Horas';
    }


    enviarReserva() {
        this.router.navigate(['reserva']);
    }

    async enviarSolicitud(value: Reto) {


        if ((!this.usuario.liderEquipo || this.usuario.liderEquipo === "") && (!this.usuario.perteneceEquipo || this.usuario.perteneceEquipo === "")) {
            this.presentToast('Error usuario no pertence a un equipo ', false);

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

        if (this.equipoObjeto && this.equipoObjeto.id == undefined) {
            return this.presentToast('Intentelo nuevamente', false);
        }

        if (this.equipoObjeto == undefined) {
          return this.presentToast('Debe crear un equipo', false);
        }

        if (value.partido.equipoA.id === this.equipoObjeto.id) {
            return this.presentToast('No puede solicitar un reto propio', false);
        }

        if (value.solicitud) {
            let existe = false;
            value.solicitud.forEach(x => {
                if (x.usuario.uid === this.usuario.uid) {
                    existe = true;
                }
            });

            if (existe) {
                return this.presentToast('Ya existe una solicitud', false);
            }
        }


        const alert = await this.alertController.create({
            header: '¡Solicitud!',
            message: "Desea enviar una solicutud al reto",
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
                        if (!value.solicitud) {
                            value.solicitud = [];
                        }

                        value.solicitud.push({estado: 'PENDIENTE', usuario: this.usuario, equipo: this.equipoObjeto, fecha: new Date()});

                        this.loader.showLoader();
                        this.crudService.update(this.tables.tablas().RETOS, value).then(resp => {
                            this.presentToast('Se envio la solitud', true);
                            this.loader.hideLoader();
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


    /*Metodo  para mostrar el modal de crear una cancha*/
    async crearCancha() {
        const modal = await this.modalController.create({
            component: CrearEquipoComponent
        });
        await modal.present();
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

    verNotificacion(reto: Reto) {

        if (!reto.solicitud || reto.solicitud.length == 0) {
            return this.presentToast('No tiene solicitudes', false);
        }

        this.presentToast('Tiene ' + reto.solicitud.length + ' solicitudes ', true);
        this.mostrarModalAsync(reto.solicitud, reto);
    }

    informacion() {
        this.presentToast('Información', true);
    }


    async mostrarModalAsync(value, reto) {
        const modal = await this.modalController.create({
            component: AceptarRetoComponent,
            cssClass: 'my-custom-modal-css',
            componentProps: {
                solicitud: value,
                reto: reto
            }
        });
        return await modal.present();
    }


    async cancelarReto(reto){

      const alert = await this.alertController.create({
          header: 'Elminar!',
          message: "Desea eliminar el reto",
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
                    this.crudService.delete(this.tables.tablas().RETOS, {id: reto.id}).then(resp => {

                      //cambiar de estado la reserva

                      this.presentToast('Se elmino el reto', true);
                      this.loader.hideLoader();
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


    fechaValida(fecha) {
        const date = new Date(fecha);

        if(date > new Date()){
          return "PENDIENTE"
        }

        return "REALIZADO"
    }


    async ingresarMarcador(reto: Reto) {






              const alert = await this.alertController.create({
                  header: '¿Agregar un equipo?',
                  message: "Al selecionar un equipo se creara un reto",
                  inputs: [{
                      type: "number",
                      name: 'EquipoA',
                      label: 'Equipo A',
                      placeholder:"Equipo A",
                      checked: true
                  }, {
                      type: "number",
                      name: 'EquipoB',
                      label: 'Equipo B',
                      placeholder:"Equipo B",
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

                            if (!data) {
                              return this.presentToast('Debe ingresar los marcadores', false);
                            }

                            if (data.EquipoA == undefined || data.EquipoA == "") {
                              return this.presentToast('Debe ingresar el marcador del equipo A', false);
                            }


                            if (data.EquipoB == undefined || data.EquipoB == "") {
                              return this.presentToast('Debe ingresar el marcador del equipo B', false);
                            }

                            const partido = new Partido();

                            partido.equipoA = reto.partido.equipoA;
                            partido.equipoB = reto.partido.equipoB;

                            partido.resultadoEquipoA = data.EquipoA;
                            partido.resultadoEquipoB = data.EquipoB;


                            this.loader.showLoader();
                            this.crudService.create(this.tables.tablas().PARTIDO, partido).then(resp => {

                              reto.estado = 'CON RESULTADO';
                              reto.partido.resultadoEquipoA = partido.resultadoEquipoA;
                              reto.partido.resultadoEquipoB = partido.resultadoEquipoB;
                              this.crudService.update(this.tables.tablas().RETOS, reto).then(resp => {
                                this.presentToast('Se ingreso el resultado', true);

                                  this.loader.hideLoader();
                              }).catch(error => {
                                  this.presentToast('Ocurrio un error al enviar la solitud', false);
                                  this.loader.hideLoader();
                              });

                              this.loader.hideLoader();
                            }).catch(error => {
                                this.presentToast('Ocurrio un error al crear el resultado', false);
                                this.loader.hideLoader();
                            });
                          }
                      }
                  ]
              });

              await alert.present();



    }


    async verDatos(reto: Reto){

      const datos = reto.partido.equipoA.nombre + " " + reto.partido.resultadoEquipoA + " / " + reto.partido.equipoB.nombre + " " + reto.partido.resultadoEquipoB;

      const alert = await this.alertController.create({
          header: 'RESULTADOS',
          message: datos,
          buttons: [
                {
                  text: 'Aceptar',
                  handler: () => {

                  }

              }
          ]
      });

      await alert.present();
    }


}
