import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcartDailogComponent } from './addcart-dailog.component';

describe('AddcartDailogComponent', () => {
  let component: AddcartDailogComponent;
  let fixture: ComponentFixture<AddcartDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddcartDailogComponent]
    });
    fixture = TestBed.createComponent(AddcartDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
