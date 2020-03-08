import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

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

  update(tabla, recordId, record) {
    this.firestore.doc(tabla + '/' + recordId).update(JSON.parse(JSON.stringify(record)));
  }

  delete(tabla, recordId) {
    this.firestore.doc(tabla + '/' + recordId).delete();
  }

  find(tabla, recordId) {
    return this.firestore.collection(tabla).doc(recordId);
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

  getSongDetail(songId: string): AngularFirestoreDocument<any> {
    return this.firestore.collection('songList').doc(songId);
  }

}
