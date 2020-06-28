import { Component, OnInit } from '@angular/core';
import { Solicitud } from 'src/app/models/reto';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-aceptar-reto',
  templateUrl: './aceptar-reto.component.html',
  styleUrls: ['./aceptar-reto.component.scss'],
})
export class AceptarRetoComponent implements OnInit {

  solicitud: Array<Solicitud>;

  constructor(
          public modalController: ModalController
  ) { }

  ngOnInit() {
    console.log(this.solicitud);
  }

  cerrarModal() {
      this.modalController.dismiss();
  }

  aceptar(s: Solicitud) {

  }

}
