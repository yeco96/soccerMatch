import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, NavParams, PopoverController} from '@ionic/angular';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {LoaderService} from 'src/app/services/loader.service';
import {Usuario} from "../../models/usuario";
import {CrearEquipoComponent} from 'src/app/crear-equipo/crear-equipo.component';


@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
    page;
    usuario: Usuario;

    /* Inicializacion de Objetos*/
    constructor(
        private navParams: NavParams,
        private popoverController: PopoverController,
        private authService: AuthenticationService,
        private loader: LoaderService,
        private navCtrl: NavController,
        public  modalController: ModalController,
    ) {
    }

    /*Integracion del service loader para la conexion Async */
    ngOnInit() {
        this.page = this.navParams.get('data');
        this.usuario = new Usuario();
        this.loader.showLoader();
        this.authService.getDataUser().then(res => {
            this.usuario = res;
            this.loader.hideLoader();
        }, reason => {
            this.loader.hideLoader();
        });
    }
    /*Navegar pantalla de perfil */
    perfil() {
        this.navCtrl.navigateForward('/profile');
        this.popoverController.dismiss();
    }
    /*Loader Asinc de equipo */
    async equipo() {
        const modal = await this.modalController.create({
            component: CrearEquipoComponent
        });
        this.popoverController.dismiss();
        return await modal.present();
    }

    /*Cerrar Sesion*/
    logout() {
        this.loader.showLoader();
        this.authService.logoutUser()
            .then(res => {
                console.log(res);
                this.navCtrl.navigateForward('/login');
                this.loader.hideLoader();
                this.popoverController.dismiss();
            }, err => {
                this.loader.hideLoader();
            });
    }

}
