import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadScreenshotComponent } from './upload-screenshot.component';

describe('UploadScreenshotComponent', () => {
  let component: UploadScreenshotComponent;
  let fixture: ComponentFixture<UploadScreenshotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadScreenshotComponent]
    });
    fixture = TestBed.createComponent(UploadScreenshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
