import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedAccountStatementComponent } from './consolidated-account-statement.component';

describe('ConsolidatedAccountStatementComponent', () => {
  let component: ConsolidatedAccountStatementComponent;
  let fixture: ComponentFixture<ConsolidatedAccountStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsolidatedAccountStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedAccountStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
