import {Injectable} from '@angular/core';
import {TablesService} from 'src/app/service/tables.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {RespuestaData} from '../models/respuesta-data';
import {Noticias} from '../models/noticias';
import {Auditoria} from '../models/auditoria';

@Injectable({
    providedIn: 'root'
})
export class CrudService {
    constructor(
        private db: AngularFirestore,
        private tables: TablesService
    ) {
    }
    /*Metodo para crear una tabla en la DB
    *Coleccion en firebase
     */
    create(tabla, record, noticia?: Noticias, auditoria?:Auditoria) {
        if (noticia) {
            this.db.collection(this.tables.tablas().NOTICIAS).add(JSON.parse(JSON.stringify(noticia)));
        }if (auditoria) {
            this.db.collection(this.tables.tablas().AUDITORIA).add(JSON.parse(JSON.stringify(auditoria)));
        }
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
    update(tabla, record, noticia?: Noticias, auditoria?:Auditoria) {
        if (noticia) {
            this.db.collection(this.tables.tablas().NOTICIAS).add(JSON.parse(JSON.stringify(noticia)));
        }if (auditoria) {
            this.db.collection(this.tables.tablas().AUDITORIA).add(JSON.parse(JSON.stringify(auditoria)));
        }
        return this.db.doc(tabla + '/' + record.id).update(JSON.parse(JSON.stringify(record)));
    }

    /*
    * Actualizar ingresando al documento
    *
    * */
    update_S(tabla, id, record, noticia?: Noticias) {
        if (noticia) {
            this.db.collection(this.tables.tablas().NOTICIAS).add(JSON.parse(JSON.stringify(noticia)));
        }
        return this.db.collection(tabla).doc(id).update(JSON.parse(JSON.stringify(record)));
    }

    delete(tabla, recordId , auditoria?:Auditoria) {
        if (auditoria) {
            this.db.collection(this.tables.tablas().AUDITORIA).add(JSON.parse(JSON.stringify(auditoria)));
        }
        const doc = this.db.doc(tabla + '/' + recordId.id);
        return doc.delete();
    }

}



