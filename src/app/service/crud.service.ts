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
    return this.firestore.collection(tabla).add(Object.assign({}, record));
  }

  read(tabla) {
    return this.firestore.collection(tabla).snapshotChanges();
  }

  update(tabla, recordId, record) {
    this.firestore.doc(tabla + '/' + recordId).update(Object.assign({}, record));
  }

  delete(tabla, recordId) {
    this.firestore.doc(tabla + '/' + recordId).delete();
  }

  find(tabla, recordId) {
    this.firestore.doc(tabla + '/' + recordId).get();
  }

  getSongDetail(songId: string): AngularFirestoreDocument<any> {
    return this.firestore.collection('songList').doc(songId);
  }

}
