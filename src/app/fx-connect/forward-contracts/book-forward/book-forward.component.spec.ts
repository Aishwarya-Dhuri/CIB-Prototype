import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookForwardComponent } from './book-forward.component';

describe('BookForwardComponent', () => {
  let component: BookForwardComponent;
  let fixture: ComponentFixture<BookForwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookForwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookForwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
