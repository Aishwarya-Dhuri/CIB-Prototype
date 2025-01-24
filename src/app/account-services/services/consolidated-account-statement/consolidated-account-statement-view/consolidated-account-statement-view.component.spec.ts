import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedAccountStatementViewComponent } from './consolidated-account-statement-view.component';

describe('ConsolidatedAccountStatementViewComponent', () => {
  let component: ConsolidatedAccountStatementViewComponent;
  let fixture: ComponentFixture<ConsolidatedAccountStatementViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsolidatedAccountStatementViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedAccountStatementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
