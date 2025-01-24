import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSummaryInitiateComponent } from './collection-summary-initiate.component';

describe('CollectionSummaryInitiateComponent', () => {
  let component: CollectionSummaryInitiateComponent;
  let fixture: ComponentFixture<CollectionSummaryInitiateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionSummaryInitiateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionSummaryInitiateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
