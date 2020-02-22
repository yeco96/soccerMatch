import { Component, OnInit } from '@angular/core';

import { TablesService } from './../service/tables.service';
import { CrudService } from './../service/crud.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {


  students: any;
  studentName: string;
  studentAge: number;
  studentAddress: string;

  constructor(
    private tables: TablesService,
    private crudService: CrudService,
    private loader: LoaderService
    ) {}

  ngOnInit() {
    this.loader.showLoader();
    this.crudService.read(this.tables.tablas().ESTUDIANTES).subscribe(data => {

      this.students = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Age: e.payload.doc.data()['Age'],
          Address: e.payload.doc.data()['Address'],
        };
      });
      console.log(this.students);
      this.loader.hideLoader();
    });
  }


  CreateRecord() {
    const record = {};
    record['Name'] = this.studentName;
    record['Age'] = this.studentAge;
    record['Address'] = this.studentAddress;
    this.crudService.create(this.tables.tablas().ESTUDIANTES, record).then(resp => {
      this.studentName = '';
      this.studentAge = undefined;
      this.studentAddress = '';
      console.log(resp);
    })
    .catch(error => {
        console.log(error);
    });
  }

  RemoveRecord(rowID) {
    this.crudService.delete(this.tables.tablas().ESTUDIANTES, rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditName = record.Name;
    record.EditAge = record.Age;
    record.EditAddress = record.Address;
  }

  UpdateRecord(recordRow) {
    const record = {};
    record['Name'] = recordRow.EditName;
    record['Age'] = recordRow.EditAge;
    record['Address'] = recordRow.EditAddress;
    this.crudService.update(this.tables.tablas().ESTUDIANTES, recordRow.id, record);
    recordRow.isEdit = false;
  }

}
