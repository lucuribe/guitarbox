import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TunerPage } from './tuner.page';

describe('TunerPage', () => {
  let component: TunerPage;
  let fixture: ComponentFixture<TunerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TunerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
