import {Component, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {Router} from '@angular/router';
import {AuthenticationService} from './services/authentication.service';
import {Usuario} from "./models/usuario";
import {LoaderService} from "./services/loader.service";
import {TablesService} from "./service/tables.service";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    usuario: Usuario;
    public mostrar = false;
    public selectedIndex = 0;
    public selectedIndexMaintenance = 0;
    public appPages = [];
    tables = new TablesService();

    public appMaintenance;


    constructor(
        public authService: AuthenticationService,
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private authenticationService: AuthenticationService,
        private router: Router,
        private loader: LoaderService,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

  public appReportes = [
    {
      title: 'Reportes',
      url: '/reportes',
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

            this.authenticationService.authState.subscribe(state => {
                if (state) {
                    this.router.navigate(['home']);
                    this.mostrar = true;
                } else {
                    this.router.navigate(['login']);
                    this.mostrar = false;
                }
            });

        });
    }

    ngOnInit() {

        this.usuario = new Usuario();
        this.loader.showLoader();
        this.authService.getDataUser().then(res => {
            this.usuario = res;


  ngOnInit() {
    /*
    * adwajndak
    * adaopidjaoiw
    *
    * */
    const path = window.location.pathname.split('login/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
      this.selectedIndexReportes = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
      this.selectedIndexMaintenance = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }

}
