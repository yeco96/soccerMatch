import { Component, OnInit } from '@angular/core';
import { TablesService } from 'src/app/service/tables.service';
import { CrudService } from 'src/app/service/crud.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ModalController } from '@ionic/angular';

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

  ngOnInit() {}


  cerrarModal() {
    this.modalController.dismiss();
  }


  buscarCanchas() {
    const a = this.crudService.get(this.tables.tablas().CANCHAS).subscribe(resp => {
      console.log(resp);
      this.loader.hideLoader();
    });

  }

}
