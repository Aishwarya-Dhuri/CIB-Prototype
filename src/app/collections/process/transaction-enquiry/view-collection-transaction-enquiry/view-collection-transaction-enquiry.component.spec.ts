import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCollectionTransactionEnquiryComponent } from './view-collection-transaction-enquiry.component';

describe('ViewCollectionTransactionEnquiryComponent', () => {
  let component: ViewCollectionTransactionEnquiryComponent;
  let fixture: ComponentFixture<ViewCollectionTransactionEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCollectionTransactionEnquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCollectionTransactionEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
