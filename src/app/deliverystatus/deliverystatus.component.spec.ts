import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverystatusComponent } from './deliverystatus.component';

describe('DeliverystatusComponent', () => {
  let component: DeliverystatusComponent;
  let fixture: ComponentFixture<DeliverystatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverystatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverystatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
