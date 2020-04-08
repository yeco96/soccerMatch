import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { CrudService } from 'src/app/service/crud.service';
import { TablesService } from 'src/app/service/tables.service';
import { Usuario} from 'src/app/models/usuario';


@Component({
  selector: 'app-clientes', 
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  constructor(    
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private crudService: CrudService,
    private tables: TablesService,
    public modalController: ModalController) { }

    usuarios = new Array<Usuario>();

  ngOnInit() {
    this.loader.showLoader();
    this.crudService.read(this.tables.tablas().USUARIO).subscribe(data => {
      this.usuarios = this.crudService.construir(data) as Array<Usuario>;
      this.loader.hideLoader();
    });
  }

}
