import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { LoaderService } from '../services/loader.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  userEmail: string;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private loader: LoaderService
  ) {}

  ngOnInit() {
  }


  logout() {
    this.loader.showLoader();
    this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.navCtrl.navigateBack('');
      this.loader.hideLoader();
    }).catch(error => {
      console.log(error);
      this.loader.hideLoader();
    });
  }

}
