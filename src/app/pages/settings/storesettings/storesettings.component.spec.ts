import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresettingsComponent } from './storesettings.component';

describe('StoresettingsComponent', () => {
  let component: StoresettingsComponent;
  let fixture: ComponentFixture<StoresettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoresettingsComponent]
    });
    fixture = TestBed.createComponent(StoresettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
