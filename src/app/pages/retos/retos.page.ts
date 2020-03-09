import { Component, OnInit } from '@angular/core';
import { TablesService } from 'src/app/service/tables.service';
import { CrudService } from 'src/app/service/crud.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ModalController } from '@ionic/angular';
import { CrearRetoComponent } from 'src/app/components/crear-reto/crear-reto.component';
import { Reto } from 'src/app/models/reto';
import { Retos } from 'src/app/models/retos';

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
      component: CrearRetoComponent,
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

      this.retos = data.map(e => {
        return {
          id: e.payload.doc.id,
          region: (e.payload.doc.data() as Retos).region,
          summary: (e.payload.doc.data() as Retos).summary,
        };
      }) as Array<Retos>;

      console.log(this.retos);
    });


}}
