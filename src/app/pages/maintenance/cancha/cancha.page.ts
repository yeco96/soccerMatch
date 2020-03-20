import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { CrudService } from 'src/app/service/crud.service';
import { TablesService } from 'src/app/service/tables.service';
import { Cancha, UbicacionCancha, MyData } from 'src/app/models/cancha';
import { CrearCanchaComponent } from 'src/app/pages/maintenance/canchaM/crear-cancha/crear-cancha.component';

@Component({
  selector: 'app-cancha',
  templateUrl: './cancha.page.html',
  styleUrls: ['./cancha.page.scss'],
})
export class CanchaPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private crudService: CrudService,
    private tables: TablesService,
    public modalController: ModalController
  ) { }

canchas = new Array<Cancha>();

  ngOnInit() {
    this.loader.showLoader();
    this.crudService.read(this.tables.tablas().CANCHAS).subscribe(data => {
      this.canchas = this.crudService.construir(data) as Array<Cancha>;
      this.loader.hideLoader();
    });
  }


  async presentModal() {
    const modal = await this.modalController.create({
      component: CrearCanchaComponent
    });
    return await modal.present();
  }

  async editar(obj : Cancha) {
    const modal = await this.modalController.create({
      component: CrearCanchaComponent,
      componentProps: {
        obj: obj
      }
    });
    return await modal.present();
  }

  mostrarModal() {
    this.presentModal();
  }

}
