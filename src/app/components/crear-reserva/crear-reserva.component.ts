import {Component, OnInit} from '@angular/core';
import {TablesService} from "../../service/tables.service";
import {CrudService} from "../../service/crud.service";
import {LoaderService} from "../../services/loader.service";
import {ModalController, ToastController} from "@ionic/angular";
import {Canton, Ubicacion} from "../../models/ubicacion";
import {Cancha} from "../../models/cancha";

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
        public toastController: ToastController
    ) {
    }

    ubicacion = new Array<Ubicacion>();
    ubicacionJSON: any;

    codProvincia: number;
    codCanton: number;

    provincia: Ubicacion;
    canton: Canton;
    fechaBuscar: any;

    canchas = new Array<Cancha>();

    static diaSemana(dia) {
        const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        const date = new Date(dia);
        return dias[date.getDay() - 1];
    }

    getHora(dia) {
        const date = new Date(dia);
        return date.getHours();
    }

    fechaCompleta() {
        const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        // tslint:disable-next-line: max-line-length
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const date = new Date(this.fechaBuscar);

        const fechaNum = date.getDate();
        const mes_name = date.getMonth();

        console.log(dias[date.getDay() - 1] + ' ' + fechaNum + ' de ' + meses[mes_name] + ' de ' + date.getFullYear());
    }

    ngOnInit() {
        this.loader.showLoader();
        this.crudService.read(this.tables.ubicacion().UBICACION).subscribe(data => {
            this.ubicacion = this.crudService.construir(data) as Array<Ubicacion>;
            this.ubicacionJSON = JSON.parse(JSON.stringify(this.ubicacion));
            this.loader.hideLoader();
        }, error1 => this.loader.hideLoader());
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

        this.loader.showLoader();
        this.crudService.read(this.tables.tablas().CANCHAS).subscribe(data => {
            const respuesta = this.crudService.construir(data) as Array<Cancha>;

            this.canchas = respuesta.filter(x => x.ubicacion.codigoProvincia == this.codProvincia && x.ubicacion.codigoCanton == this.codCanton);

            if (this.canchas.length == 0) {
                this.loader.hideLoader();
                return this.presentToast("No existen resultados en estas ubicaciones", false);
            }

            this.canchas = this.canchas.filter(x => x.horario.dias.includes(CrearReservaComponent.diaSemana(this.fechaBuscar)));

            if (this.canchas.length == 0) {
                this.loader.hideLoader();
                return this.presentToast("No existen resultados en ese dia", false);
            }

            this.canchas = this.canchas.filter(x => this.getHora(x.horario.horaInicio) <= this.getHora(this.fechaBuscar) && this.getHora(x.horario.horaFin) >= this.getHora(this.fechaBuscar));

            if (this.canchas.length == 0) {
                this.loader.hideLoader();
                return this.presentToast("No existen resultados para esa hora", false);
            }

            this.loader.hideLoader();
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
            position: 'top',
            color: !status ? "danger" : "primary"
        });
        toast.present();
    }

    solicitar(cancha: Cancha) {

    }
}
