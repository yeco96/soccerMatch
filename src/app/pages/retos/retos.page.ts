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
}
