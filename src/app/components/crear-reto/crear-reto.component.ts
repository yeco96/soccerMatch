import { Component, OnInit } from '@angular/core';
import { TablesService } from 'src/app/service/tables.service';
import { CrudService } from 'src/app/service/crud.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ModalController } from '@ionic/angular';
import { Ubicacion, Canton } from 'src/app/models/ubicacion';
import { FormControl } from '@angular/forms';
import { Cancha } from 'src/app/models/cancha';

@Component({
  selector: 'app-crear-reto',
  templateUrl: './crear-reto.component.html',
  styleUrls: ['./crear-reto.component.scss'],
})
export class CrearRetoComponent implements OnInit {

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

  ngOnInit() {
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


  buscarCanchas() {
    this.crudService.read(this.tables.tablas().CANCHAS).subscribe(data => {
      const lista = data.map(e => {
        return {
          id: e.payload.doc.id,
          direccion: (e.payload.doc.data() as Cancha).direccion,
          nombre: (e.payload.doc.data() as Cancha).nombre,
          telefono: (e.payload.doc.data() as Cancha).telefono,
          ubicacion: (e.payload.doc.data() as Cancha).ubicacion
        };
      }) as Array<Cancha>;

      // tslint:disable-next-line: triple-equals
      this.canchas = lista.filter(x => x.ubicacion.codigoProvincia == this.codProvincia && x.ubicacion.codigoCanton == this.codCanton);

      console.log(this.canchas);
    });
  }

  changeProvincia() {
    // tslint:disable-next-line: triple-equals
    this.provincia = this.ubicacion.find(x => x.codigoProvincia == this.codProvincia);
    console.log(this.provincia);
  }

}
