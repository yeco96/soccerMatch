import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { async } from 'rxjs/internal/scheduler/async';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loader: any;
  isLoading: boolean;

  constructor(
    private loadingController: LoadingController
  ) { }


  // async showLoader(options: any = {}) {

  //   if (options === undefined) {
  //     options = {
  //       message: 'Espere un momento por favor'
  //     };
  //   }

  //   this.loader = await this.loadingController.create(options);
  //   await this.loader.present();
  //   console.log('show');
  // }

  // async hideLoader() {
  //   await this.loader.dismiss()
  //   .then(() => {
  //     this.loader = null;
  //   })
  //   .catch(e => console.log(e));
  //   console.log('hide');
  // }


  async showLoader(options: any = {}) {

    if (!options.message) {
      options = {
        message: 'Espere un momento por favor'
      };
    }

    this.isLoading = true;
    return await this.loadingController.create(options).then(a => {
      a.present().then(() => {
        console.log('loading presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort laoding'));
        }
      });
    });
  }

  async hideLoader() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }

}
