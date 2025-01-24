import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualForecastUploadComponent } from './manual-forecast-upload.component';

describe('ManualForecastUploadComponent', () => {
  let component: ManualForecastUploadComponent;
  let fixture: ComponentFixture<ManualForecastUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualForecastUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualForecastUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
