import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IvrTpinComponent } from './ivr-tpin.component';

describe('IvrTpinComponent', () => {
  let component: IvrTpinComponent;
  let fixture: ComponentFixture<IvrTpinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IvrTpinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IvrTpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
