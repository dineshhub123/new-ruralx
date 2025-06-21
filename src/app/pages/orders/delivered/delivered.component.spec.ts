import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredComponent } from './delivered.component';

describe('DeliveredComponent', () => {
  let component: DeliveredComponent;
  let fixture: ComponentFixture<DeliveredComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveredComponent]
    });
    fixture = TestBed.createComponent(DeliveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
