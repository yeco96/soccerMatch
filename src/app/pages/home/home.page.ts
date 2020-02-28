import { Component, OnInit, HostListener } from '@angular/core';

import { PopoverController, Events } from '@ionic/angular';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private popoverController: PopoverController,
    private events: Events,
  ) { }

  ngOnInit() {
  }

  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuComponent,
      event: ev,
      componentProps: { page: 'home' },
      cssClass: 'popover_class',
    });

    /** Sync event from popover component */
    // this.events.subscribe('fromPopoverEvent', () => {
    //   this.syncTasks();
    // });
    return await popover.present();
  }

}
