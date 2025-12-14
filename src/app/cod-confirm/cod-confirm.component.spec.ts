import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodConfirmComponent } from './cod-confirm.component';

describe('CodConfirmComponent', () => {
  let component: CodConfirmComponent;
  let fixture: ComponentFixture<CodConfirmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodConfirmComponent]
    });
    fixture = TestBed.createComponent(CodConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
