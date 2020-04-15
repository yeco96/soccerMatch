import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {FormBuilder} from '@angular/forms';
import {LoaderService} from 'src/app/services/loader.service';
import {CrudService} from 'src/app/service/crud.service';
import {TablesService} from 'src/app/service/tables.service';
import {Noticias} from 'src/app/models/noticias';
import {Usuario} from "../../models/usuario";


@Component({
    selector: 'app-noticias',
    templateUrl: './noticias.page.html',
    styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {
    /* Inicializacion de Objetos*/
    constructor(private navCtrl: NavController,
                private authService: AuthenticationService,
                private loader: LoaderService,
                private crudService: CrudService,
                private tables: TablesService,
                public modalController: ModalController) {
    }

    /* Inicializacion de Variables*/
    noticias = new Array<Noticias>();
    usuario: Usuario;
    /*Integracion del crud loader para la conexion Async y leer las noticias*/
    ngOnInit() {

        this.loader.showLoader();
        this.authService.getDataUser().then(res => {
            this.usuario = res as Usuario;
            this.crudService.read(this.tables.tablas().NOTICIAS).subscribe(data => {
                this.noticias = this.crudService.construir(data) as Array<Noticias>;
                this.loader.hideLoader();
            });
        }, reason => {
            this.loader.hideLoader();
        });

    }


    tiempo(dato: Noticias) {
        const fechaInicio = new Date(dato.fecha).getTime();
        let fechaFin = new Date().getTime();

        let diff = fechaFin - fechaInicio;

        let dias = diff / (1000 * 60 * 60 * 24);

        let horas = diff / (1000 * 60 * 60);

        let minutos = diff / (1000 * 60);

        if (dias > 1) {
            return 'Hace ' + parseInt(dias.toString()) + ' días.';
        } else if (horas > 1) {
            return 'Hace ' + parseInt(horas.toString()) + ' horas.';
        } else if (minutos > 1) {
            return 'Hace ' + parseInt(minutos.toString()) + ' minutos.';
        } else {
            return 'Hace unos segundos.';
        }
    }

    existe(dato: Noticias) {

        if (!dato.like) {
            dato.like = [];
        }

        var existe = false;
        dato.like.forEach(value => {
            if (value.uid == this.usuario.uid) {
                existe = true;
            }
        });

        return existe;
    }

    meGusta(dato: Noticias) {


        if (!dato.like) {
            dato.like = [];
        }

        var existe = false;
        dato.like.forEach(value => {
            if (value.uid == this.usuario.uid) {
                existe = true;
            }
        });

        if (existe) {
            return;
        }

        dato.like.push(this.usuario);

        this.loader.showLoader();
        this.crudService.update(this.tables.tablas().NOTICIAS, dato).then(data => {
            this.loader.hideLoader();
        });
    }

}
