import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateManagementInitateComponent } from './template-management-initate.component';

describe('TemplateManagementInitateComponent', () => {
  let component: TemplateManagementInitateComponent;
  let fixture: ComponentFixture<TemplateManagementInitateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateManagementInitateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateManagementInitateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
