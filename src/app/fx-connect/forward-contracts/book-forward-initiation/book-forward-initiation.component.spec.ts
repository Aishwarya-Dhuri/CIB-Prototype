import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookForwardInitiationComponent } from './book-forward-initiation.component';

describe('BookForwardInitiationComponent', () => {
  let component: BookForwardInitiationComponent;
  let fixture: ComponentFixture<BookForwardInitiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookForwardInitiationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookForwardInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
