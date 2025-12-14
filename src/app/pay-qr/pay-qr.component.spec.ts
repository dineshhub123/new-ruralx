import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayQrComponent } from './pay-qr.component';

describe('PayQrComponent', () => {
  let component: PayQrComponent;
  let fixture: ComponentFixture<PayQrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayQrComponent]
    });
    fixture = TestBed.createComponent(PayQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
