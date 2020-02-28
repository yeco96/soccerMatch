import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CanchaPage } from './cancha.page';

describe('CanchaPage', () => {
  let component: CanchaPage;
  let fixture: ComponentFixture<CanchaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanchaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CanchaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
