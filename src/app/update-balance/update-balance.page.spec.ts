import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateBalancePage } from './update-balance.page';

describe('UpdateBalancePage', () => {
  let component: UpdateBalancePage;
  let fixture: ComponentFixture<UpdateBalancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateBalancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateBalancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
