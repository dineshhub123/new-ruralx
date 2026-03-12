import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnDailogComponent } from './return-dailog.component';

describe('ReturnDailogComponent', () => {
  let component: ReturnDailogComponent;
  let fixture: ComponentFixture<ReturnDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnDailogComponent]
    });
    fixture = TestBed.createComponent(ReturnDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
