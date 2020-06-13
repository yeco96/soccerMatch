import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AceptarRetoComponent } from './aceptar-reto.component';

describe('AceptarRetoComponent', () => {
  let component: AceptarRetoComponent;
  let fixture: ComponentFixture<AceptarRetoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceptarRetoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AceptarRetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
