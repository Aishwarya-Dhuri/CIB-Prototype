import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilityRegistrationComponent } from './mobility-registration.component';

describe('MobilityRegistrationComponent', () => {
  let component: MobilityRegistrationComponent;
  let fixture: ComponentFixture<MobilityRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobilityRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilityRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
