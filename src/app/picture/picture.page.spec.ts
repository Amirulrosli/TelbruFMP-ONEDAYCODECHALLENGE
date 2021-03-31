import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PicturePage } from './picture.page';

describe('PicturePage', () => {
  let component: PicturePage;
  let fixture: ComponentFixture<PicturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicturePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PicturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
