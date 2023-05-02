import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SongDisplayerComponent } from './song-displayer.component';

describe('SongListComponent', () => {
  let component: SongDisplayerComponent;
  let fixture: ComponentFixture<SongDisplayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [IonicModule.forRoot(), SongDisplayerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SongDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 