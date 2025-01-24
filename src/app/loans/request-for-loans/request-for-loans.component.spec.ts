import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForLoansComponent } from './request-for-loans.component';

describe('RequestForLoansComponent', () => {
  let component: RequestForLoansComponent;
  let fixture: ComponentFixture<RequestForLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestForLoansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestForLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
