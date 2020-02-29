import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { CrudService } from 'src/app/service/crud.service';
import { TablesService } from 'src/app/service/tables.service';
import { Ubicacion, Canton } from 'src/app/models/ubicacion';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.page.html',
  styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage implements OnInit {

  loaderToShow: any;
  editar: boolean;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private crudService: CrudService,
    private tables: TablesService
  ) { }



ubicacion = new Array<Ubicacion>();

  ngOnInit() {
    // this.loader.showLoader();
    this.crudService.read(this.tables.ubicacion().UBICACION).subscribe(data => {

      this.ubicacion = data.map(e => {
        return {
          id: e.payload.doc.id,
          descripcion: (e.payload.doc.data() as Ubicacion).descripcion,
          codigoProvincia: (e.payload.doc.data() as Ubicacion).codigoProvincia,
          estado: (e.payload.doc.data() as Ubicacion).estado,
          canton: (e.payload.doc.data() as Ubicacion).canton
        };
      }) as Array<Ubicacion>;

      console.log(this.ubicacion);
    });
  }

  crearCanchaPrueba() {

    const ubicacion = new Ubicacion();
    ubicacion.codigoProvincia = 1;
    ubicacion.estado = true;
    ubicacion.descripcion = 'San José';

    const canton = new Canton();
    canton.descripcion = 'Tarrazú';
    canton.codigoCanton = 5;
    canton.estado = true;
    ubicacion.canton = new Array();
    ubicacion.canton.push(canton);

    this.loader.showLoader();
    this.crudService.create(this.tables.ubicacion().UBICACION, ubicacion).then(resp => {
      console.log(resp);
      this.loader.hideLoader();
    })
    .catch(error => {
        console.log(error);
        this.loader.hideLoader();
    });
  }
}
