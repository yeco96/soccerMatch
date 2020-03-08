import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { CrudService } from 'src/app/service/crud.service';
import { TablesService } from 'src/app/service/tables.service';
import { Cancha, UbicacionCancha } from 'src/app/models/cancha';
import { CrearCanchaComponent } from 'src/app/pages/maintenance/canchaM/crear-cancha/crear-cancha.component';

@Component({
  selector: 'app-cancha',
  templateUrl: './cancha.page.html',
  styleUrls: ['./cancha.page.scss'],
})
export class CanchaPage implements OnInit {

  loaderToShow: any;

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

    // this.loader.showLoader();
    this.crudService.read(this.tables.tablas().CANCHAS).subscribe(data => {

      this.canchas = data.map(e => {
        return {
          id: e.payload.doc.id,
          direccion: (e.payload.doc.data() as Cancha).direccion,
          nombre: (e.payload.doc.data() as Cancha).nombre,
          telefono: (e.payload.doc.data() as Cancha).telefono,
          ubicacion: (e.payload.doc.data() as Cancha).ubicacion
        };
      }) as Array<Cancha>;

      console.log(this.canchas);
      // this.loader.hideLoader();
    });

  }

  crearCanchaPrueba() {
    this.loader.showLoader();

    const canchas = new Cancha();

    canchas.nombre = 'prueba';
    canchas.direccion = 'san jose';
    canchas.telefono = [{codigo: 506, telefono: 25465570, tipo: ''}];

    const ubicacion = {codigoCanton : 5, codigoProvincia : 1};
    canchas.ubicacion = ubicacion as UbicacionCancha;

    this.crudService.create(this.tables.tablas().CANCHAS, canchas).then(resp => {
      console.log(resp);
      this.loader.hideLoader();
    })
    .catch(error => {
        console.log(error);
        this.loader.hideLoader();
    });
  }


  async presentModal() {
    const modal = await this.modalController.create({
      component: CrearCanchaComponent,
    });
    return await modal.present();
  }

  mostrarModal() {
    this.presentModal();
  }

}
