import {Component, OnInit} from '@angular/core';
import {TablesService} from 'src/app/service/tables.service';
import {CrudService} from 'src/app/service/crud.service';
import {LoaderService} from 'src/app/services/loader.service';
import {ModalController, ToastController, NavController} from '@ionic/angular';
import {FormBuilder} from '@angular/forms';



import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {Usuario} from 'src/app/models/usuario';
import { CrearCanchaComponent } from '../canchaM/crear-cancha/crear-cancha.component';
import { CrearEquipoComponent } from 'src/app/crear-equipo/crear-equipo.component';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    usuario: Usuario;
    editar = true;
    popoverController: any;

    constructor(
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private loader: LoaderService,
        private storage: AngularFireStorage,
        private database: AngularFirestore,
        private crudService: CrudService,
        private tables: TablesService,
        public modalController: ModalController,
        public toastController: ToastController,
        public navCtrl: NavController,
    ) {
    }
   generos = ['Masculino ', 'Feminino', 'No especificar'];

    ngOnInit() {
        this.usuario = new Usuario();
        this.loader.showLoader();
        this.authService.getDataUser().then(res => {
            this.usuario = res;
            this.loader.hideLoader();
        }, reason => {
            this.loader.hideLoader();
        });
    }

    editarPerfil() {
        if (this.editar) {
            this.editar = false;
            return;
        }

        if (!this.editar) {
            this.crudService.update(this.tables.tablas().USUARIO, this.usuario).then(resp => {
                this.loader.hideLoader();
                this.presentToast('Usuario guardado correctamente', true);
            }).catch(error => {
                this.presentToast('Ocurrio un error al actualizar el usuario', false);
                this.loader.hideLoader();
            });

            this.editar = true;
        }
    }


   
  async crearEquipo() {
    const modal = await this.modalController.create({
      component: CrearEquipoComponent
    });
    return await modal.present();
  }

    async presentToast(msj: string, status: boolean) {
        const toast = await this.toastController.create({
            message: msj,
            duration: 2000,
            position: 'bottom',
            color: !status ? 'danger' : 'success'
        });
        toast.present();
    }

}
