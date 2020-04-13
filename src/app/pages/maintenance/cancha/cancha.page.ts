import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {FormBuilder} from '@angular/forms';
import {LoaderService} from 'src/app/services/loader.service';
import {CrudService} from 'src/app/service/crud.service';
import {TablesService} from 'src/app/service/tables.service';
import {Cancha} from 'src/app/models/cancha';
import {CrearCanchaComponent} from 'src/app/pages/maintenance/canchaM/crear-cancha/crear-cancha.component';

@Component({
    selector: 'app-cancha',
    templateUrl: './cancha.page.html',
    styleUrls: ['./cancha.page.scss'],
})
export class CanchaPage implements OnInit {
 /* Inicializacion de Objetos*/
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
    /* Inicializacion de Variables*/
    canchas = new Array<Cancha>();
    canchasTemp = new Array<Cancha>();
    texto: string;

    /*Integracion del service Crudloader para la conexion Async */
    ngOnInit() {
        this.loader.showLoader();
        this.crudService.read(this.tables.tablas().CANCHAS).subscribe(data => {
            this.canchas = this.crudService.construir(data) as Array<Cancha>;
            this.canchasTemp = this.canchas;
            this.loader.hideLoader();
        });
    }
    /*Se presenta el componente para crear una cancha */
    async presentModal() {
        const modal = await this.modalController.create({
            component: CrearCanchaComponent
        });
        return await modal.present();
    }
     /*Se realiza el proceso Async de editar */
    async editar(obj: Cancha) {
        const modal = await this.modalController.create({
            component: CrearCanchaComponent,
            componentProps: {
                obj: obj
            }
        });
        return await modal.present();
    }

    mostrarModal() {
        this.presentModal();
    }
     /*Metodo de Buscar filtrando por nombre */
    buscar() {
        this.canchas = this.canchasTemp;
        this.canchas = this.canchas.filter(x => (x.nombre).toLowerCase().includes(this.texto.toLowerCase()))
    }

}
