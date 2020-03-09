import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { CrudService } from 'src/app/service/crud.service';
import { TablesService } from 'src/app/service/tables.service';
import { Noticias } from 'src/app/models/noticias';



@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {

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

  noticias = new Array<Noticias>();

  ngOnInit() {

    // this.loader.showLoader();
    this.crudService.read(this.tables.tablas().NOTICIAS).subscribe(data => {

      this.noticias = data.map(e => {
        return {
          id: e.payload.doc.id,
          descripcion: (e.payload.doc.data() as Noticias).descripcion,
          fecha: (e.payload.doc.data() as Noticias).fecha,
          tipo: (e.payload.doc.data() as Noticias).tipo,
          usuario: (e.payload.doc.data() as Noticias).usuario,
        };
      }) as Array<Noticias>;

      console.log(this.noticias);
    });
  }
}
