import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaydealComponent } from './todaydeal.component';

describe('TodaydealComponent', () => {
  let component: TodaydealComponent;
  let fixture: ComponentFixture<TodaydealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodaydealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaydealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
