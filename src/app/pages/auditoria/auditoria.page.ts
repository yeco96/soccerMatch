import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {FormBuilder} from '@angular/forms';
import {LoaderService} from 'src/app/services/loader.service';
import {CrudService} from 'src/app/service/crud.service';
import {TablesService} from 'src/app/service/tables.service';
import {Auditoria} from 'src/app/models/auditoria';
import {Usuario} from "../../models/usuario";

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.page.html',
  styleUrls: ['./auditoria.page.scss'],
})
export class AuditoriaPage implements OnInit {
 
     ngOnInit() {};

  }
  


