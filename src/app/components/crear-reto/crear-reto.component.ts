import { Component, OnInit } from '@angular/core';
import { TablesService } from 'src/app/service/tables.service';
import { CrudService } from 'src/app/service/crud.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ModalController } from '@ionic/angular';
import { Ubicacion, Canton } from 'src/app/models/ubicacion';
import { FormControl } from '@angular/forms';
import { Cancha } from 'src/app/models/cancha';
import { RespuestaData } from 'src/app/models/respuesta-data';
import { Usuario } from 'src/app/models/usuario';

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
  fechaBuscar: any;

  canchas = new Array<Cancha>();

  diaSemana() {
    const date = new Date(this.fechaBuscar);

    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    console.log(date.toLocaleDateString('es-MX', options));
  }

  diaSemana2() {
    const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    // tslint:disable-next-line: max-line-length
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const date = new Date(this.fechaBuscar);

    const fechaNum = date.getDate();
    // tslint:disable-next-line: variable-name
    const mes_name = date.getMonth();

    console.log(dias[date.getDay() - 1] + ' ' + fechaNum + ' de ' + meses[mes_name] + ' de ' + date.getFullYear());
  }

  ngOnInit() {
    this.crudService.read(this.tables.ubicacion().UBICACION).subscribe(data => {
      this.ubicacion = this.crudService.construir(data) as Array<Ubicacion>;
      this.ubicacionJSON = JSON.parse(JSON.stringify(this.ubicacion));
    });
  }


  cerrarModal() {
    this.modalController.dismiss();
  }

  buscarCanchas() {
    this.crudService.read(this.tables.tablas().CANCHAS).subscribe(data => {
      const respuesta = this.crudService.construir(data) as Array<Cancha>;
      // tslint:disable-next-line: triple-equals
      this.canchas = respuesta.filter(x => x.ubicacion.codigoProvincia == this.codProvincia && x.ubicacion.codigoCanton == this.codCanton);
      this.diaSemana();
      this.diaSemana2();
    });
  }

  changeProvincia() {
    // tslint:disable-next-line: triple-equals
    this.provincia = this.ubicacion.find(x => x.codigoProvincia == this.codProvincia);
    console.log(this.provincia);
  }

}
