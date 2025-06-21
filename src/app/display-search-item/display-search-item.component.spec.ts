import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySearchItemComponent } from './display-search-item.component';

describe('DisplaySearchItemComponent', () => {
  let component: DisplaySearchItemComponent;
  let fixture: ComponentFixture<DisplaySearchItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaySearchItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySearchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
