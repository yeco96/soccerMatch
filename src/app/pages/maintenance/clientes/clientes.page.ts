import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {FormBuilder} from '@angular/forms';
import {LoaderService} from 'src/app/services/loader.service';
import {CrudService} from 'src/app/service/crud.service';
import {TablesService} from 'src/app/service/tables.service';
import {Acceso, Usuario} from 'src/app/models/usuario';


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
    user: Usuario;

    ngOnInit() {
        this.loader.showLoader();
        this.authService.getDataUser().then(res => {
            this.user = res;
            this.crudService.read(this.tables.tablas().USUARIO).subscribe(data => {
                this.usuarios = this.crudService.construir(data) as Array<Usuario>;
                this.usuarios.forEach(x => {
                    if (!x.acceso) {
                        x.acceso = new Acceso();
                    }
                });
                this.usuariosTemp = this.usuarios;
                this.loader.hideLoader();
            });

        });
    }

    actualizar(value: Usuario) {
        this.crudService.update(this.tables.tablas().USUARIO, value).then(resp => {
            console.log(resp);
        }).catch(error => {
            console.log(error);
        });
    }

    buscar() {
        this.usuarios = this.usuariosTemp;
        this.usuarios = this.usuarios.filter(x => (x.nombre + ' ' + x.apellidos).toLowerCase().includes(this.texto.toLowerCase()))

    }
}
