import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTpinComponent } from './generate-tpin.component';

describe('GenerateTpinComponent', () => {
  let component: GenerateTpinComponent;
  let fixture: ComponentFixture<GenerateTpinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateTpinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateTpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
