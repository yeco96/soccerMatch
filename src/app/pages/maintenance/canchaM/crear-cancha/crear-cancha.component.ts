import { Component, OnInit } from '@angular/core';
import { TablesService } from 'src/app/service/tables.service';
import { CrudService } from 'src/app/service/crud.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ModalController } from '@ionic/angular';
import { Ubicacion, Canton } from 'src/app/models/ubicacion';
import { FormControl } from '@angular/forms';
import { Cancha, MetodoPago, Telefono, Horario, UbicacionCancha } from 'src/app/models/cancha';

@Component({
  selector: 'app-crear-cancha',
  templateUrl: './crear-cancha.component.html',
  styleUrls: ['./crear-cancha.component.scss'],
})
export class CrearCanchaComponent implements OnInit {

  constructor(
    private tables: TablesService,
    private crudService: CrudService,
    private loader: LoaderService,
    public modalController: ModalController
  ) { }


  ubicacion = new Array<Ubicacion>();
  ubicacionJSON: any;

  codProvincia: number;
  codCanton: number;

  provincia: Ubicacion;
  canton: Canton;

  canchas = new Array<Cancha>();

  canchaObjeto: Cancha;

  dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

  ngOnInit() {
    this.canchaObjeto = new Cancha();
    this.canchaObjeto.metodoPago = new MetodoPago();
    this.canchaObjeto.telefono = new Array<Telefono>();
    this.canchaObjeto.ubicacion = new UbicacionCancha();
    this.canchaObjeto.horario = new Horario();


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
      this.ubicacionJSON = JSON.parse(JSON.stringify(this.ubicacion));
    });

  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  changeProvincia() {
    // tslint:disable-next-line: triple-equals
    this.provincia = this.ubicacion.find(x => x.codigoProvincia == this.codProvincia);
    console.log(this.provincia);
  }


  guardar() {
    this.loader.showLoader();
    this.crudService.create(this.tables.tablas().CANCHAS, this.canchaObjeto).then(resp => {
      console.log(resp);
      this.loader.hideLoader();
      this.cerrarModal();
    })
    .catch(error => {
        console.log(error);
        this.loader.hideLoader();
    });
  }

}
