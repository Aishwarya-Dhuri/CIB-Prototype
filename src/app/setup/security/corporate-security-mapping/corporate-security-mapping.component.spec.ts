import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateSecurityMappingComponent } from './corporate-security-mapping.component';

describe('CorporateSecurityMappingComponent', () => {
  let component: CorporateSecurityMappingComponent;
  let fixture: ComponentFixture<CorporateSecurityMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateSecurityMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateSecurityMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
