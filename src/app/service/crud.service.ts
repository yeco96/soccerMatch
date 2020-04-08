import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { RespuestaData } from '../models/respuesta-data';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  constructor(
    private firestore: AngularFirestore
  ) { }


  create(tabla, record) {
    return this.firestore.collection(tabla).add(JSON.parse(JSON.stringify(record)));
  }

  read(tabla) {
    return this.firestore.collection(tabla).snapshotChanges();
  }

  read_Change(tabla) {
    return this.firestore.collection(tabla).stateChanges();
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

  update(tabla, record) {
    return this.firestore.doc(tabla + '/' + record.id).update(JSON.parse(JSON.stringify(record)));
  }

  delete(tabla, recordId) {
    const doc = this.firestore.doc(tabla + '/' + recordId.id);
    return doc.delete();
  }

  find(tabla, recordId) {
    return this.firestore.collection(tabla).doc(recordId.id).get();
  }

  get(tabla) {
    return this.firestore.collection(tabla).get();
  }

  where(tabla) {
    this.firestore.collection(tabla).get().subscribe(snapshot => {
    if (snapshot.empty) {
    console.log('No matching documents.');
    return;
    }

    snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
    });
    });
  }
}
