import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductZoomComponent } from './product-zoom.component';

describe('ProductZoomComponent', () => {
  let component: ProductZoomComponent;
  let fixture: ComponentFixture<ProductZoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductZoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
