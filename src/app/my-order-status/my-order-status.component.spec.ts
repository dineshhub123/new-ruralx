import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrderStatusComponent } from './my-order-status.component';

describe('MyOrderStatusComponent', () => {
  let component: MyOrderStatusComponent;
  let fixture: ComponentFixture<MyOrderStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyOrderStatusComponent]
    });
    fixture = TestBed.createComponent(MyOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
