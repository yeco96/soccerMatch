import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  public selectedIndex = 0;
  public selectedIndexMaintenance = 0;
  public appPages = [
    {
      title: 'Reservas',
      url: '/folder/Outbox',
      icon: 'paper-plane'
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  public appMaintenance = [
    {
      title: 'Canchas',
      url: '/cancha',
      icon: 'football'
    },
    {
      title: 'Ubicación',
      url: '/ubicacion',
      icon: 'compass'
    }
  ];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // // let status bar overlay webview
      // this.statusBar.overlaysWebView(true);

      // // set status bar to white
      // this.statusBar.backgroundColorByHexString('#003300');

      this.authenticationService.authState.subscribe(state => {
        if (state) {
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['login']);
        }
      });

    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('login/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
      this.selectedIndexMaintenance = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

}
