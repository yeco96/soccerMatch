import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {FormBuilder} from '@angular/forms';
import {LoaderService} from 'src/app/services/loader.service';
import {CrudService} from 'src/app/service/crud.service';
import {TablesService} from 'src/app/service/tables.service';
import {Equipo} from 'src/app/models/equipo';

@Component({
    selector: 'app-equipos',
    templateUrl: './equipos.page.html',
    styleUrls: ['./equipos.page.scss'],
})
export class EquiposPage implements OnInit {

    constructor(
        private navCtrl: NavController,
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private loader: LoaderService,
        private crudService: CrudService,
        private tables: TablesService,
        public modalController: ModalController) {
    }

    equipos = new Array<Equipo>();
    texto: string;
    equiposTemp = new Array<Equipo>();


    ngOnInit() {
        this.loader.showLoader();
        this.crudService.read(this.tables.tablas().EQUIPO).subscribe(data => {
            this.equipos = this.crudService.construir(data) as Array<Equipo>;
            this.equiposTemp = this.equipos;
            this.loader.hideLoader();
        });
    }

    actualizar(value: Equipo) {
        this.crudService.update(this.tables.tablas().EQUIPO, value).then(resp => {
            console.log(resp);
        }).catch(error => {
            console.log(error);
        });
    }

    buscar() {
        this.equipos = this.equiposTemp;
        this.equipos = this.equipos.filter(x => (x.nombre + ' ' + x.telefono).toLowerCase().includes(this.texto.toLowerCase()))
    }


}
