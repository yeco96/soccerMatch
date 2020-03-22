import {Component, OnInit} from '@angular/core';
import {TablesService} from "../../service/tables.service";
import {CrudService} from "../../service/crud.service";
import {LoaderService} from "../../services/loader.service";
import {ModalController, ToastController} from "@ionic/angular";
import {Canton, Ubicacion} from "../../models/ubicacion";
import {Cancha} from "../../models/cancha";

@Component({
  selector: 'app-crear-reserva',
  templateUrl: './crear-reserva.component.html',
  styleUrls: ['./crear-reserva.component.scss'],
})
export class CrearReservaComponent implements OnInit {

  constructor(
      private tables: TablesService,
      private crudService: CrudService,
      private loader: LoaderService,
      public modalController: ModalController,
      public toastController: ToastController
  ) {
  }

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

    if (this.codProvincia == null || this.codCanton == null) {
      return this.presentToast("Debe selecionar unar ubicacion validad", false);
    }

    if (this.fechaBuscar == null) {
      return this.presentToast("Debe selecionar una fecha", false);
    }

    this.crudService.read(this.tables.tablas().CANCHAS).subscribe(data => {
      const respuesta = this.crudService.construir(data) as Array<Cancha>;
      // tslint:disable-next-line: triple-equals
      this.canchas = respuesta.filter(x => x.ubicacion.codigoProvincia == this.codProvincia && x.ubicacion.codigoCanton == this.codCanton);

      if (this.canchas.length == 0) {
        return this.presentToast("No existen resultados", false);
      }
      // this.diaSemana();
      // this.diaSemana2();
    });
  }

  changeProvincia() {
    // tslint:disable-next-line: triple-equals
    this.provincia = this.ubicacion.find(x => x.codigoProvincia == this.codProvincia);
    this.codCanton = undefined;
  }

  async presentToast(msj, status) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 2000,
      position: 'top',
      color: !status ? "danger" : "primary"
    });
    toast.present();
  }

}
