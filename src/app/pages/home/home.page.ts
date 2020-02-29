import { Component, OnInit, HostListener } from '@angular/core';

import { PopoverController } from '@ionic/angular';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
  }

  async settingsPopover() {
    const popover = await this.popoverController.create({
      component: MenuComponent,
      componentProps: { page: 'home' },
      cssClass: 'popover_class',
    });
    return await popover.present();
  }

}
