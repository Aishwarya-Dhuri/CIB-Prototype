import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualForecastComponent } from './manual-forecast.component';

describe('ManualForecastComponent', () => {
  let component: ManualForecastComponent;
  let fixture: ComponentFixture<ManualForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualForecastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
