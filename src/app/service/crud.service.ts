import {Injectable} from '@angular/core';
import {TablesService} from 'src/app/service/tables.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {RespuestaData} from '../models/respuesta-data';
import {Noticias} from '../models/noticias';

@Injectable({
    providedIn: 'root'
})
export class CrudService {
    constructor(
        private db: AngularFirestore,
        private tables: TablesService
    ) {
    }

    create(tabla, record, noticia?: Noticias) {
        if (noticia) {
            this.db.collection(this.tables.tablas().NOTICIAS).add(JSON.parse(JSON.stringify(noticia)));
        }
        return this.db.collection(tabla).add(JSON.parse(JSON.stringify(record)));
    }

    read(tabla) {
        return this.db.collection(tabla).snapshotChanges();
    }

    read_Change(tabla) {
        return this.db.collection(tabla).stateChanges();
    }

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

    update(tabla, record, noticia?: Noticias) {
        if (noticia) {
            this.db.collection(this.tables.tablas().NOTICIAS).add(JSON.parse(JSON.stringify(noticia)));
        }
        return this.db.doc(tabla + '/' + record.id).update(JSON.parse(JSON.stringify(record)));
    }


    update_S(tabla, id, record, noticia?: Noticias) {
        if (noticia) {
            this.db.collection(this.tables.tablas().NOTICIAS).add(JSON.parse(JSON.stringify(noticia)));
        }
        return this.db.collection(tabla).doc(id).update(JSON.parse(JSON.stringify(record)));
    }

    delete(tabla, recordId) {
        const doc = this.db.doc(tabla + '/' + recordId.id);
        return doc.delete();
    }

    find(tabla, recordId) {
        return this.db.collection(tabla).doc(recordId.id).get();
    }

    get(tabla) {
        return this.db.collection(tabla).get();
    }

}
