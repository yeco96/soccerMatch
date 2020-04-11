import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EquiposPage } from './equipos.page';

describe('EquiposPage', () => {
  let component: EquiposPage;
  let fixture: ComponentFixture<EquiposPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquiposPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EquiposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
