import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuditoriaPage } from './auditoria.page';

describe('AuditoriaPage', () => {
  let component: AuditoriaPage;
  let fixture: ComponentFixture<AuditoriaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
