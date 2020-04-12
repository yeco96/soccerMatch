import {Component, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {Router} from '@angular/router';
import {AuthenticationService} from './services/authentication.service';
import {Usuario} from "./models/usuario";
import {LoaderService} from "./services/loader.service";
import {TablesService} from "./service/tables.service";
import {CrudService} from "./service/crud.service";
import {Storage} from "@ionic/storage";

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
    public selectedIndexReportes = 0;
    public appPages = [];
    tables = new TablesService();

    public appMaintenance;
    public appReportes = [];


    constructor(
        public authService: AuthenticationService,
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private storage: Storage,
        private crudService: CrudService,
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

            // // let status bar overlay webview
            // this.statusBar.overlaysWebView(true);

            // // set status bar to white
            // this.statusBar.backgroundColorByHexString('#003300');

            this.authenticationService.authState.subscribe(state => {
                if (state) {
                    this.leerData();
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


        this.leerData();

        // this.authService.getDataUser().then(res => {
        //
        //     this.loader.hideLoader();
        // }, reason => {
        //     this.loader.hideLoader();
        // });


        const path = window.location.pathname.split('login/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
            this.selectedIndexReportes = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
            this.selectedIndexMaintenance = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        }
    }

    leerData() {
        this.crudService.read(this.tables.tablas().USUARIO).subscribe(data => {
            const temp = (this.crudService.construir(data) as Array<Usuario>);

            this.storage.get('uid').then((val) => {

                if (!val) {
                    this.loader.hideLoader();
                    return;
                }

                const uid = val.toString();

                this.usuario = temp.filter(x => {
                    return x.uid === uid;
                })[0];

                if (!this.usuario.uid) {
                    this.loader.hideLoader();
                    return;
                }


                this.appPages = [
                    {
                        title: 'Reservas',
                        url: '/reserva',
                        icon: 'paper-plane',
                        visible: this.tables.permiso(this.usuario.acceso.mascara, this.tables.roles().JUGADOR)
                    }
                ];

                this.appMaintenance = [
                    {
                        title: 'Canchas',
                        url: '/cancha',
                        icon: 'football',
                        visible: this.tables.permiso(this.usuario.acceso.mascara, this.tables.roles().ADMIN)
                    },
                    {
                        title: 'Ubicación',
                        url: '/ubicacion',
                        icon: 'compass',
                        visible: this.tables.permiso(this.usuario.acceso.mascara, this.tables.roles().ADMIN)
                    },
                    {
                        title: 'Clientes',
                        url: '/clientes',
                        icon: 'person',
                        visible: this.tables.permiso(this.usuario.acceso.mascara, this.tables.roles().ADMIN)
                    },
                    {
                        title: 'Equipos',
                        url: '/equipos',
                        icon: 'people',
                        visible: this.tables.permiso(this.usuario.acceso.mascara, this.tables.roles().ADMIN)
                    }
                ];

                this.appReportes = [
                    {
                        title: 'Reportes',
                        url: '/reportes',
                        icon: 'compass',
                        visible: this.tables.permiso(this.usuario.acceso.mascara, this.tables.roles().CANCHA)
                    }
                ];


                this.loader.hideLoader();

            });

        }, err => this.loader.hideLoader());
    }

}
