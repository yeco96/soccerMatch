import {Component, OnInit} from '@angular/core';

import {PopoverController} from '@ionic/angular';
import {MenuComponent} from '../../components/menu/menu.component';
import {Noticias} from "../../models/noticias";
import {CrudService} from "../../service/crud.service";
import {LoaderService} from "../../services/loader.service";
import {TablesService} from "../../service/tables.service";
import {Usuario} from "../../models/usuario";
import {Equipo} from "../../models/equipo";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(
        private popoverController: PopoverController,
        private crudService: CrudService,
        private tables: TablesService,
        private authService: AuthenticationService,
    private loader: LoaderService
    ) {
    }

    noticias : Array<Noticias>;
    ngOnInit() {


    }
    /*Metodo Async que realiza las configuraciones iniciales */
    async settingsPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: MenuComponent,
            event: ev,
            animated: true,
            translucent: true
        });
        return await popover.present();
    }

}
