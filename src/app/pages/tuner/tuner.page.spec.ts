import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TunerPage } from './tuner.page';

describe('TunerPage', () => {
  let component: TunerPage;
  let fixture: ComponentFixture<TunerPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TunerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
