import {Component, OnInit} from '@angular/core';

import {PopoverController} from '@ionic/angular';
import {MenuComponent} from '../../components/menu/menu.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(
        private popoverController: PopoverController
    ) {
    }

    ngOnInit() {
    }

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
