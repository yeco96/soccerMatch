import { Component, OnInit } from '@angular/core';
import { TablesService } from 'src/app/service/tables.service';
import { CrudService } from 'src/app/service/crud.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ModalController } from '@ionic/angular';
import { CrearRetoComponent } from 'src/app/components/crear-reto/crear-reto.component';

@Component({
  selector: 'app-retos',
  templateUrl: './retos.page.html',
  styleUrls: ['./retos.page.scss'],
})
export class RetosPage implements OnInit {

  retos: any;

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


  ngOnInit() {
    this.loader.showLoading('red_RETOS');
    this.crudService.read(this.tables.tablas().RETOS).subscribe(data => {

      // this.retos = data.map(e => {
      //   return {
      //     id: e.payload.doc.id,
      //     isEdit: false,
      //     Name: e.payload.doc.data()['Name'],
      //     Age: e.payload.doc.data()['Age'],
      //     Address: e.payload.doc.data()['Address'],
      //   };
      // });
      console.log(data);
      this.loader.dismissLoader('red_RETOS');
    });


  }

}
