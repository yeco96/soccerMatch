import {Component, OnInit} from '@angular/core';
import {TablesService} from "../../service/tables.service";
import {CrudService} from "../../service/crud.service";
import {LoaderService} from "../../services/loader.service";
import {AlertController, ModalController, ToastController} from "@ionic/angular";
import {Canton, Ubicacion} from "../../models/ubicacion";
import {Cancha} from "../../models/cancha";
import {Reserva} from "../../models/reserva";
import {AuthenticationService} from "../../services/authentication.service";
import {Usuario} from "../../models/usuario";

@Component({
    selector: 'app-crear-reserva',
    templateUrl: './crear-reserva.component.html',
    styleUrls: ['./crear-reserva.component.scss'],
})
export class CrearReservaComponent implements OnInit {

    constructor(
        private tables: TablesService,
        private crudService: CrudService,
        private loader: LoaderService,
        public modalController: ModalController,
        public toastController: ToastController,
        public alertController: AlertController,
        public authenticationService: AuthenticationService
    ) {
    }

    ubicacion = new Array<Ubicacion>();
    ubicacionJSON: any;

    codProvincia: number;
    codCanton: number;

    provincia: Ubicacion;
    canton: Canton;
    fechaBuscar: any;
    fechaMnima: any;

    canchas = new Array<Cancha>();

    reserva: Reserva;
    usuario: Usuario;

    buscarValidar: boolean;

    static diaSemana(dia) {
        const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        const date = new Date(dia);
        return dias[date.getDay() - 1];
    }

    getHora(dia) {
        const date = new Date(dia);
        return date.getHours();
    }

    fechaCompleta(dia) {
        const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        // tslint:disable-next-line: max-line-length
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const date = new Date(dia);

        const fechaNum = date.getDate();
        const mes_name = date.getMonth();

        return (dias[date.getDay() - 1] + ' ' + fechaNum + ' de ' + meses[mes_name] + ' de ' + date.getFullYear()) + ' a las ' + date.getHours() + ' Horas';
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

    ngOnInit() {

        this.loader.showLoader();
        this.crudService.read(this.tables.ubicacion().UBICACION).subscribe(data => {
            this.ubicacion = this.crudService.construir(data) as Array<Ubicacion>;
            this.ubicacionJSON = JSON.parse(JSON.stringify(this.ubicacion));

            this.usuario = new Usuario();
            this.authenticationService.getDataUser().then(res => {
                this.usuario = res;
                this.loader.hideLoader();
            }, reason => {
                this.loader.hideLoader();
            });


        }, error1 => this.loader.hideLoader());


        this.fechaMnima = this.formattedDate();
    }


    cerrarModal() {
        this.modalController.dismiss();
    }

    buscarCanchas() {

        if (this.codProvincia == null || this.codCanton == null) {
            return this.presentToast("Debe selecionar unar ubicacion validad", false);
        }

        if (this.fechaBuscar == null) {
            return this.presentToast("Debe selecionar una fecha", false);
        }

        this.buscarValidar = true;
        this.loader.showLoader();
        this.crudService.read(this.tables.tablas().CANCHAS).subscribe(data => {

            if (!this.buscarValidar) {
                return;
            }

            const respuesta = this.crudService.construir(data) as Array<Cancha>;

            this.canchas = respuesta.filter(x => x.ubicacion.codigoProvincia == this.codProvincia && x.ubicacion.codigoCanton == this.codCanton);

            if (this.canchas.length == 0) {
                this.loader.hideLoader();
                this.buscarValidar = false;
                return this.presentToast("No existen resultados en estas ubicaciones", false);
            }

            this.canchas = this.canchas.filter(x => x.horario.dias.includes(CrearReservaComponent.diaSemana(this.fechaBuscar)));

            if (this.canchas.length == 0) {
                this.loader.hideLoader();
                this.buscarValidar = false;
                return this.presentToast("No existen resultados en ese dia", false);
            }

            this.canchas = this.canchas.filter(x => this.getHora(x.horario.horaInicio) <= this.getHora(this.fechaBuscar) && this.getHora(x.horario.horaFin) >= this.getHora(this.fechaBuscar));

            if (this.canchas.length == 0) {
                this.loader.hideLoader();
                this.buscarValidar = false;
                return this.presentToast("No existen resultados para esa hora", false);
            }

            this.canchas = this.canchas.filter(x => x.reserva != undefined ? x.reserva.filter(z => this.fechaCompleta(z.fecha) != this.fechaCompleta(this.fechaBuscar)) : true);

            this.canchas = this.canchas.filter(x => {

                if (x.reserva == undefined) {
                    return true;
                }

                const resultado = x.reserva.filter(z => {
                    return this.fechaCompleta(z.fecha) == this.fechaCompleta(this.fechaBuscar);
                });

                return resultado.length == 0;
            });


            if (this.canchas.length == 0) {
                this.loader.hideLoader();
                this.buscarValidar = false;
                return this.presentToast("Las canchas se encuentran reservadas en dicho horario", false);
            }

            this.loader.hideLoader();
            this.buscarValidar = false;
        }, error1 => this.loader.hideLoader());
    }

    changeProvincia() {
        this.provincia = this.ubicacion.find(x => x.codigoProvincia == this.codProvincia);
        this.codCanton = undefined;
    }

    async presentToast(msj, status) {
        const toast = await this.toastController.create({
            message: msj,
            duration: 2000,
            position: 'bottom',
            color: !status ? 'danger' : 'success'
        });
        toast.present();
    }


    async solicitar(cancha: Cancha) {
        this.enviarReserva(cancha);
    }


    async enviarReserva(cancha: Cancha) {
        const alert = await this.alertController.create({
            header: '¿Desea confirmar?',
            message: cancha.nombre + ' - ' + this.fechaCompleta(this.fechaBuscar),
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

                        this.reserva = new Reserva();
                        this.reserva.estado = 'PENDIENTE';
                        this.reserva.cancha = cancha;
                        this.reserva.fechaCreacion = new Date();
                        this.reserva.fechaReserva = this.fechaBuscar;
                        this.reserva.usuario = this.usuario;

                        this.loader.showLoader();
                        this.crudService.create(this.tables.tablas().RESERVA, this.reserva).then(resp => {

                            if (cancha.reserva === undefined) {
                                cancha.reserva = [];
                            }

                            cancha.reserva.push({
                                estado: 'LISTO',
                                fecha: this.fechaBuscar.toString().replace("T", " ").replace("Z", " ")
                            });
                            this.crudService.update(this.tables.tablas().CANCHAS, cancha).then(resp => {
                                this.loader.hideLoader();
                                this.cerrarModal();
                                this.presentToast("La reserva se realizo correctamente", true);
                            }).catch(error => {
                                this.presentToast('Ocurrio un error al crear la reserva', false);
                                this.loader.hideLoader();
                            });


                        }).catch(error => {
                            this.presentToast('Ocurrio un error al crear la reserva', false);
                            this.loader.hideLoader();
                        });
                    }
                }
            ]
        });

        await alert.present();
    }
}
