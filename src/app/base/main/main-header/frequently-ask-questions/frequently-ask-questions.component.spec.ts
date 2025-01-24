import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequentlyAskQuestionsComponent } from './frequently-ask-questions.component';

describe('FrequentlyAskQuestionsComponent', () => {
  let component: FrequentlyAskQuestionsComponent;
  let fixture: ComponentFixture<FrequentlyAskQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrequentlyAskQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequentlyAskQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
