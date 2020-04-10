import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ProfilePage } from 'src/app/pages/maintenance/profile/profile.page';
import {Usuario} from "../../models/usuario";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  page;
  usuario: Usuario;

  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController,
    private authService: AuthenticationService,
    private loader: LoaderService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.page = this.navParams.get('data');
    this.usuario = new Usuario();
    this.authService.getDataUser().then(res => {
      this.usuario = res;
    });
  }

  perfil() {
    this.navCtrl.navigateForward('/profile');
    this.popoverController.dismiss();
  }

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
