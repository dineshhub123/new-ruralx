import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionUpdateComponent } from './version-update.component';

describe('VersionUpdateComponent', () => {
  let component: VersionUpdateComponent;
  let fixture: ComponentFixture<VersionUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VersionUpdateComponent]
    });
    fixture = TestBed.createComponent(VersionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
