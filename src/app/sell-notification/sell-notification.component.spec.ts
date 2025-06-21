import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellNotificationComponent } from './sell-notification.component';

describe('SellNotificationComponent', () => {
  let component: SellNotificationComponent;
  let fixture: ComponentFixture<SellNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellNotificationComponent]
    });
    fixture = TestBed.createComponent(SellNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
