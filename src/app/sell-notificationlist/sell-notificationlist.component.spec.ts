import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellNotificationlistComponent } from './sell-notificationlist.component';

describe('SellNotificationlistComponent', () => {
  let component: SellNotificationlistComponent;
  let fixture: ComponentFixture<SellNotificationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellNotificationlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellNotificationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
