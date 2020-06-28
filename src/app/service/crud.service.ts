import {Injectable} from '@angular/core';
import {TablesService} from 'src/app/service/tables.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {RespuestaData} from '../models/respuesta-data';
import {Noticias} from '../models/noticias';
import {Auditoria} from '../models/auditoria';
import {Usuario} from "../models/usuario";
import {Storage} from "@ionic/storage";

@Injectable({
    providedIn: 'root'
})
export class CrudService {
    constructor(
        private db: AngularFirestore,
        private tables: TablesService,
        private storage: Storage
    ) {
    }

    /*Metodp para formatear la fecha */
    formattedDate(d = new Date) {
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        const year = String(d.getFullYear());
        let hours = String(d.getHours());
        let minutes = String(d.getMinutes());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    /*Metodo para crear una tabla en la DB
    *Coleccion en firebase
     */
    create(tabla, record, noticia?: Noticias, auditoria?: Auditoria) {


        /*AUDITORIA CREAR*/

        this.getDataUser().then(value => {
            let usuario = value;
            let auditoria = new Auditoria();
            auditoria.usuario = usuario;
            auditoria.objeto = tabla;
            auditoria.tipo = 'INSERT';
            auditoria.tipo = 'Inserción de un nuevo documento en la coleccion de ' + tabla.toLowerCase();
            auditoria.fecha = this.formattedDate();
            auditoria.jsonAntes = {};
            auditoria.jsonDespues = record;

            this.db.collection(this.tables.tablas().AUDITORIA).add(JSON.parse(JSON.stringify(auditoria)));
        }, reason => {

        });


        if (noticia && noticia.fecha) {
            this.db.collection(this.tables.tablas().NOTICIAS).add(JSON.parse(JSON.stringify(noticia)));
        }
        // if (auditoria) {
        //     this.db.collection(this.tables.tablas().AUDITORIA).add(JSON.parse(JSON.stringify(auditoria)));
        // }

        return this.db.collection(tabla).add(JSON.parse(JSON.stringify(record)));
    }

    /*Metodo de lectura de coleccion  */
    read(tabla) {
        return this.db.collection(tabla).snapshotChanges();
    }

    /*Metodo para contruir una push del objeto*/
    construir(data): any {
        const lista = data.map(e => {
            return {
                id: e.payload.doc.id,
                data: (e.payload.doc.data()),
            };
        }) as Array<RespuestaData>;

        const respuesta = new Array<any>();
        lista.forEach(a => {
            const respuestaObjeto = JSON.parse(JSON.stringify(a.data)) as any;
            respuestaObjeto.id = a.id;
            respuesta.push(respuestaObjeto);
        });
        return respuesta;
    }

    /*
    * Actualizar directo
    *
    * */
    update(tabla, record, noticia?: Noticias, auditoria?: Auditoria) {

        this.getDataUser().then(value => {
            let usuario = value;
            let auditoria = new Auditoria();
            auditoria.usuario = usuario;
            auditoria.objeto = tabla;
            auditoria.tipo = 'UPDATE';
            auditoria.tipo = 'Actualizacion de un documento en la coleccion de ' + tabla.toLowerCase();
            auditoria.fecha = this.formattedDate();
            auditoria.jsonAntes = {};
            auditoria.jsonDespues = record;

            this.db.collection(this.tables.tablas().AUDITORIA).add(JSON.parse(JSON.stringify(auditoria)));
        }, reason => {

        });


        if (noticia && noticia.fecha) {
            this.db.collection(this.tables.tablas().NOTICIAS).add(JSON.parse(JSON.stringify(noticia)));
        }
        // if (auditoria) {
        //     this.db.collection(this.tables.tablas().AUDITORIA).add(JSON.parse(JSON.stringify(auditoria)));
        // }
        return this.db.doc(tabla + '/' + record.id).update(JSON.parse(JSON.stringify(record)));
    }

    /*
    * Actualizar ingresando al documento
    *
    * */
    update_S(tabla, id, record, noticia?: Noticias) {

        this.getDataUser().then(value => {
            let usuario = value;
            let auditoria = new Auditoria();
            auditoria.usuario = usuario;
            auditoria.objeto = tabla;
            auditoria.tipo = 'UPDATE';
            auditoria.tipo = 'Actualizacion de un documento en la coleccion de ' + tabla.toLowerCase();
            auditoria.fecha = this.formattedDate();
            auditoria.jsonAntes = {};
            auditoria.jsonDespues = record;

            this.db.collection(this.tables.tablas().AUDITORIA).add(JSON.parse(JSON.stringify(auditoria)));
        }, reason => {

        });

        if (noticia && noticia.fecha) {
            this.db.collection(this.tables.tablas().NOTICIAS).add(JSON.parse(JSON.stringify(noticia)));
        }
        return this.db.collection(tabla).doc(id).update(JSON.parse(JSON.stringify(record)));
    }


    set(tabla, id, record) {


        this.getDataUser().then(value => {
            let usuario = value;
            let auditoria = new Auditoria();
            auditoria.usuario = usuario;
            auditoria.objeto = tabla;
            auditoria.tipo = 'UPDATE';
            auditoria.tipo = 'Actualizacion de un documento en la coleccion de ' + tabla.toLowerCase();
            auditoria.fecha = this.formattedDate();
            auditoria.jsonAntes = {};
            auditoria.jsonDespues = record;

            this.db.collection(this.tables.tablas().AUDITORIA).add(JSON.parse(JSON.stringify(auditoria)));
        }, reason => {

        });

        return this.db.collection(tabla).doc(id).set(JSON.parse(JSON.stringify(record)));
    }


    delete(tabla, recordId, auditoria?: Auditoria) {

        this.getDataUser().then(value => {
            let usuario = value;
            let auditoria = new Auditoria();
            auditoria.usuario = usuario;
            auditoria.objeto = tabla;
            auditoria.tipo = 'DELETE';
            auditoria.tipo = 'Eliminación de un documento en la coleccion de ' + tabla.toLowerCase();
            auditoria.fecha = this.formattedDate();
            auditoria.jsonAntes = {id: recordId};
            auditoria.jsonDespues = {};

            this.db.collection(this.tables.tablas().AUDITORIA).add(JSON.parse(JSON.stringify(auditoria)));
        }, reason => {

        });


        // if (auditoria) {
        //     this.db.collection(this.tables.tablas().AUDITORIA).add(JSON.parse(JSON.stringify(auditoria)));
        // }
        const doc = this.db.doc(tabla + '/' + recordId.id);
        return doc.delete();
    }


    deleteRura(ruta) {
        const doc = this.db.doc(ruta);
        return doc.delete();
    }


    async getDataUser() {
        return new Promise<any>((resolve, reject) => {
            // let user = firebase.auth().currentUser;
            let usuario = new Usuario();
            // if (user == undefined) {
            //     user = firebase.auth().currentUser;
            // }


            this.storage.get('uid').then((val) => {

                if (!val) {
                    this.storage.remove('uid').then(() => {
                        resolve("El usuario no existe");
                    });
                    return;
                }

                const uid = val.toString();
                this.read(this.tables.tablas().USUARIO).subscribe(data => {
                    const temp = (this.construir(data) as Array<Usuario>);
                    usuario = temp.filter(x => {
                        return x.uid === uid;
                    })[0];

                    if (!usuario) {
                        this.storage.remove('uid').then(() => {
                            resolve("El usuario no existe");
                        });
                    }

                    usuario.fechaNacimiento = new Date(usuario.fechaNacimiento).toISOString();
                    resolve(usuario);
                }, err => reject(err));
            });


        });
    }

}
