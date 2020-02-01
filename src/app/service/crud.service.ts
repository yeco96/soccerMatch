import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  constructor(
    private firestore: AngularFirestore
  ) { }


  create_NewStudent(record) {
    return this.firestore.collection('Students').add(record);
  }

  read_Students() {
    return this.firestore.collection('Students').snapshotChanges();
  }

  update_Student(recordId, record) {
    this.firestore.doc('Students/' + recordId).update(record);
  }

  delete_Student(recordId) {
    this.firestore.doc('Students/' + recordId).delete();
  }
}
