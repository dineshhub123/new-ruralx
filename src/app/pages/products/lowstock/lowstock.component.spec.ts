import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowstockComponent } from './lowstock.component';

describe('LowstockComponent', () => {
  let component: LowstockComponent;
  let fixture: ComponentFixture<LowstockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LowstockComponent]
    });
    fixture = TestBed.createComponent(LowstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
