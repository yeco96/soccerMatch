import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {FormBuilder} from '@angular/forms';
import {LoaderService} from 'src/app/services/loader.service';
import {CrudService} from 'src/app/service/crud.service';
import {TablesService} from 'src/app/service/tables.service';
import {Usuario} from 'src/app/models/usuario';


@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.page.html',
    styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

    constructor(
        private navCtrl: NavController,
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private loader: LoaderService,
        private crudService: CrudService,
        private tables: TablesService,
        public modalController: ModalController) {
    }

    usuarios = new Array<Usuario>();
    texto: string;
    usuariosTemp = new Array<Usuario>();

    ngOnInit() {
        this.loader.showLoader();
        this.crudService.read(this.tables.tablas().USUARIO).subscribe(data => {
            this.usuarios = this.crudService.construir(data) as Array<Usuario>;
            this.usuariosTemp = this.usuarios;
            this.loader.hideLoader();
        });
    }

    actualizar(value: Usuario) {
        // this.loader.showLoader();
        this.crudService.update(this.tables.tablas().USUARIO, value).then(resp => {
            console.log(resp);
            // this.loader.hideLoader();
        }).catch(error => {
            console.log(error);
            // this.loader.hideLoader();
        });
    }

    buscar() {
        this.usuarios = this.usuariosTemp;
        this.usuarios = this.usuarios.filter(x => (x.nombre + ' ' + x.apellidos).toLowerCase().includes(this.texto.toLowerCase()))

    }
}
