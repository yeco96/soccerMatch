import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from "@ionic/angular";
import {AuthenticationService} from "../../services/authentication.service";
import {FormBuilder} from "@angular/forms";
import {LoaderService} from "../../services/loader.service";
import {CrudService} from "../../service/crud.service";
import {TablesService} from "../../service/tables.service";
import {Reserva} from "../../models/Reserva";
import {Usuario} from "../../models/usuario";

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
        public modalController: ModalController
    ) {
    }

    reservas = new Array<Reserva>();

    ngOnInit() {
        this.loader.showLoader();
        this.crudService.read(this.tables.tablas().RESERVA).subscribe(data => {
            const reservas = this.crudService.construir(data) as Array<Reserva>;

            this.authService.getDataUser().then(res => {
                const usuario = res as Usuario;
                this.reservas = reservas.filter( reservas => {
                    return reservas.usuario.id === usuario.id;
                });
            });

            this.loader.hideLoader();
        });
    }


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

}
