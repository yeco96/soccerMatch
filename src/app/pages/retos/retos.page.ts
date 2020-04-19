import {Component, OnInit} from '@angular/core';
import {TablesService} from 'src/app/service/tables.service';
import {CrudService} from 'src/app/service/crud.service';
import {ModalController} from '@ionic/angular';
import {Retos} from 'src/app/models/retos';
import {CrearReservaComponent} from "../../components/crear-reserva/crear-reserva.component";

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
        public modalController: ModalController
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
    retos = new Array<Retos>();
    /*Integracion del crud loader service para la conexion Async y lectura de retos */
    ngOnInit() {
        this.crudService.read(this.tables.tablas().RETOS).subscribe(data => {
            this.retos = this.crudService.construir(data) as Array<Retos>;
        });
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

}
