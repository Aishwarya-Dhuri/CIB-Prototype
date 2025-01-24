import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardTelegraphicTransferStatusRendererComponent } from './outward-telegraphic-transfer-status-renderer.component';

describe('OutwardTelegraphicTransferStatusRendererComponent', () => {
  let component: OutwardTelegraphicTransferStatusRendererComponent;
  let fixture: ComponentFixture<OutwardTelegraphicTransferStatusRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutwardTelegraphicTransferStatusRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardTelegraphicTransferStatusRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
