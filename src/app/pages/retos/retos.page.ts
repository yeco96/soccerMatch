import { Component, OnInit } from '@angular/core';
import { TablesService } from 'src/app/service/tables.service';
import { CrudService } from 'src/app/service/crud.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ModalController } from '@ionic/angular';
import { Retos } from 'src/app/models/retos';
import {CrearReservaComponent} from "../../components/crear-reserva/crear-reserva.component";

@Component({
  selector: 'app-retos',
  templateUrl: './retos.page.html',
  styleUrls: ['./retos.page.scss'],
})
export class RetosPage implements OnInit {

  loaderToShow: any;

  constructor(
    private tables: TablesService,
    private crudService: CrudService,
    private loader: LoaderService,
    public modalController: ModalController
  ) { }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CrearReservaComponent,
    });
    return await modal.present();
  }

  mostrarModal() {
    this.presentModal();
  }

  retos = new Array<Retos>();

  ngOnInit() {

    // this.loader.showLoader();
    this.crudService.read(this.tables.tablas().RETOS).subscribe(data => {
      this.retos = this.crudService.construir(data) as Array<Retos>;
      console.log(this.retos);
    });


}}
