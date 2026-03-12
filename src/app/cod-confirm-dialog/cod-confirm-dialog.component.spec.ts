import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodConfirmDialogComponent } from './cod-confirm-dialog.component';

describe('CodConfirmDialogComponent', () => {
  let component: CodConfirmDialogComponent;
  let fixture: ComponentFixture<CodConfirmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodConfirmDialogComponent]
    });
    fixture = TestBed.createComponent(CodConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
