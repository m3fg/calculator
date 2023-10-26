import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcQueryComponent } from './calc-query.component';

describe('CalcQueryComponent', () => {
  let component: CalcQueryComponent;
  let fixture: ComponentFixture<CalcQueryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalcQueryComponent]
    });
    fixture = TestBed.createComponent(CalcQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
