import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalereportsComponent } from './salereports.component';

describe('SalereportsComponent', () => {
  let component: SalereportsComponent;
  let fixture: ComponentFixture<SalereportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalereportsComponent]
    });
    fixture = TestBed.createComponent(SalereportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
