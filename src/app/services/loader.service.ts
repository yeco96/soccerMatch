import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    /* Inicializacion de Variables*/ 
    loader: any;
    isLoading: boolean;

    listo: boolean;
    apagado: boolean;

    constructor(
        private loadingController: LoadingController
    ) {
        this.listo = false;
        this.apagado = false;
    }


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

    /*Metodo para mostrar el loader de los servicios ejm: Crud y Auth en Async */
    async showLoader(options: any = {}) {

        if (!options.message) {
            options = {
                message: 'Espere un momento por favor'
            };
        }

        // this.isLoading = true;
        // return await this.loadingController.create(options).then(a => {
        //   a.present().then(() => {
        //     console.log('loading presented');
        //     if (!this.isLoading) {
        //       a.dismiss().then(() => console.log('abort laoding'));
        //     }
        //   });
        // });


        // await this.loadingController.create(options).then(a => {
        //     a.present().then(() => {
        //         this.loader = a;
        //         this.listo = true;
        //         if (this.apagado) {
        //             this.loader.dismiss();
        //             this.apagado = false;
        //             this.listo = false;
        //             this.loader = undefined;
        //         }
        //     });
        // });

        
        this.loader = await this.loadingController.create(options);
        await this.loader.present();
        this.listo = true;
        if (this.apagado) {
            await this.loader.dismiss();
            this.apagado = false;
            this.listo = false;
            this.loader = undefined;
        }

        setTimeout(10000, this.loadingController.dismiss());


    }
     /*Metodo para esconder el loader de los servicios ejm: Crud y Auth en Async  */
    async hideLoader() {
        if (this.loader) {
            return await this.loader.dismiss();
        }

        if (this.listo) {
            this.listo = false;
            await this.loader.dismiss();
            this.loader = undefined;
        } else {
            this.apagado = true;
            this.listo = false;
        }

        // if (!this.isLoading) {
        //     return;
        // }
        // this.isLoading = false;
        // if (!this.loadingController) {
        //     return;
        // }
        // return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
    }


//   async showLoading(loadingId: string, loadingMessage: string = 'Espere un momento por favor') {
//     const loading = await this.loadingController.create({
//       id: loadingId,
//       message: loadingMessage
//     });
//     return await loading.present();
// }
//
//   async dismissLoader(loadingId: string) {
//       return await this.loadingController.dismiss(null, null, loadingId).then(() => console.log('loading dismissed ' + loadingId));
//   }


}
