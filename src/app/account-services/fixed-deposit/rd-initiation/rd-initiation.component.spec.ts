import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdInitiationComponent } from './rd-initiation.component';

describe('RdInitiationComponent', () => {
  let component: RdInitiationComponent;
  let fixture: ComponentFixture<RdInitiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdInitiationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RdInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
