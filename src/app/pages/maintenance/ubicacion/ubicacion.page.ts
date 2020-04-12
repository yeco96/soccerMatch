import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {FormBuilder} from '@angular/forms';
import {LoaderService} from 'src/app/services/loader.service';
import {CrudService} from 'src/app/service/crud.service';
import {TablesService} from 'src/app/service/tables.service';
import {Canton, Ubicacion} from 'src/app/models/ubicacion';

@Component({
    selector: 'app-ubicacion',
    templateUrl: './ubicacion.page.html',
    styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage implements OnInit {

    editar: boolean;

    constructor(
        private navCtrl: NavController,
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private loader: LoaderService,
        private crudService: CrudService,
        private tables: TablesService
    ) {
    }


    ubicacion = new Array<Ubicacion>();

    ngOnInit() {
        this.crudService.read(this.tables.ubicacion().UBICACION).subscribe(data => {
            this.ubicacion = this.crudService.construir(data) as Array<Ubicacion>;
        });
    }

    crearCanchaPrueba() {

        const ubicacion = new Ubicacion();
        ubicacion.codigoProvincia = 1;
        ubicacion.estado = true;
        ubicacion.descripcion = 'San José';

        const canton = new Canton();
        canton.descripcion = 'Tarrazú';
        canton.codigoCanton = 5;
        canton.estado = true;
        ubicacion.canton = [];
        ubicacion.canton.push(canton);

        this.loader.showLoader();
        this.crudService.create(this.tables.ubicacion().UBICACION, ubicacion).then(resp => {
            console.log(resp);
            this.loader.hideLoader();
        }).catch(error => {
            console.log(error);
            this.loader.hideLoader();
        });
    }
}
