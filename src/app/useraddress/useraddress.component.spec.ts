import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseraddressComponent } from './useraddress.component';

describe('UseraddressComponent', () => {
  let component: UseraddressComponent;
  let fixture: ComponentFixture<UseraddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseraddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseraddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate GST and include it in the grand total', () => {
    const totals = component.calculateTotals([
      { quantity: 2, mrp: 100, price: 80, gst_rate: 18 },
      { quantity: 1, mrp: 50, price: 40, gst_rate: 5 }
    ]);

    expect(totals.totalMrp).toBe(250);
    expect(totals.totalPrice).toBe(200);
    expect(totals.totalDiscount).toBe(50);
    expect(totals.totalGst).toBeCloseTo(31.6, 2);
    expect(totals.grandTotal).toBeCloseTo(231.6, 2);
  });
});
