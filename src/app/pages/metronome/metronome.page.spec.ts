import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetronomePage } from './metronome.page';

describe('MetronomePage', () => {
  let component: MetronomePage;
  let fixture: ComponentFixture<MetronomePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MetronomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
