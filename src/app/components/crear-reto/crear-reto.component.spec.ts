import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrearRetoComponent } from './crear-reto.component';

describe('CrearRetoComponent', () => {
  let component: CrearRetoComponent;
  let fixture: ComponentFixture<CrearRetoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearRetoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearRetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
