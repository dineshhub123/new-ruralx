import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DailogComponent } from '../dailog/dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { AddcartService } from '../addcart.service';
import Swiper from 'swiper';
import SwiperCore, { Zoom, Thumbs, Pagination, } from 'swiper';
import { ApiService } from '../api.service';
import { SwiperComponent } from 'swiper/angular';
import { SizeService } from '../services/size.service';
// Register Swiper modules
SwiperCore.use([Zoom, Thumbs, Pagination]);

@Component({
  selector: 'app-product-zoom',
  templateUrl: './product-zoom.component.html',
  styleUrls: ['./product-zoom.component.css']
})
export class ProductZoomComponent implements OnInit {
  //@ViewChild('mainSwiper', { static: false }) ProductZoomComponent?: ProductZoomComponent;
 @ViewChild('mainSwiper') mainSwiper?: SwiperComponent;
  @ViewChild('thumbsSwiperRef') thumbsSwiperRef?: SwiperComponent;

  thumbsSwiper: any;
  public showModal: boolean = false;
  show() {
    this.showModal = true;
    setTimeout(() => {
    this.resetThumbsSwiper();
    this.thumbsSwiper?.update();
  },100);
    this.document.body.classList.add('no-scroll');
  }
  resetThumbsSwiper() {
  this.thumbsSwiper = null;
}
ngOnChanges() {
  // Optional: force swiper update if you store viewChild for it
  this.thumbsSwiper?.update();
}
  public data: any;
  res: any;
  public zoomId: any;
  public child: any = true;
  public childImg: any;
  public childImgTop: any;
  public childImgSide: any;
  public childImgBack: any;
  public childImgFront: any;
  public childImgFrontTri: any;
  public searchName: string = "";
  public quantity: any;
  public name: any;
  public animal: any;
  public cartItems: any = []
  public displayItems: any = []
  public counter: number = 1;
  public inStock: any;
  public colorCodes: any[] = [];
  public sizes: any[] = [];

  selectedColor: string | null = null;
  selectedSize: string | null = null;
  selectedImage: any[] = [];
  increment() {
    this.counter += 1;
  }

  decrement() {
    if (this.counter > 1) {
      this.counter--;
    }
  }

  enableZoom: Boolean = true;
  previewImageSrc = "";
  zoomImageSrc = "assets/img/niya1.png";
  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public addCartService: AddcartService,
    private apiService: ApiService,
    @Inject(DOCUMENT) private document: Document,
    private cd: ChangeDetectorRef,
    private sizeService : SizeService
  ) 
  {

    let itemZoom: any;
    itemZoom = localStorage.getItem('selected-item')
    this.cartItems = JSON.parse(itemZoom)
    this.colorCodes = [...new Set(this.cartItems?.variants.map((v: any) => v.colorCode))];
    this.sizes = [...new Set(this.cartItems?.variants.map((v: any) => v.size))];
    const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "6-In", "7-In", "8-In", "9-In", "10-In"]; // Define logical order
    const sortedSizes = this.sizes.sort((a, b) => {
      const indexA = sizeOrder.indexOf(a);
      const indexB = sizeOrder.indexOf(b);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
   // this.inStock = this.cartItems?.variants[2].stock
  }

  swiperVal: any
  onSwiperReady(swiper: Swiper) {
    this.swiperVal = swiper
    // Apply initial zoom after Swiper + Zoom are initialized
    const zoomContainer = swiper.slides[swiper.activeIndex].querySelector('.swiper-zoom-container');
    if (zoomContainer instanceof HTMLElement) {
      // Set initial scale
      swiper.zoom.scale = 1;
      zoomContainer.style.transform = `scale(${swiper.zoom.scale})`;

    }
  }
  ngAfterViewInit() {
  this.cd.detectChanges(); // tell Angular to re-check after ViewChild is set

  }
  onThumbsSwiperInit(swiper: any) {
  // Handle destroyed swiper
  if (swiper && !swiper.destroyed) {
    this.thumbsSwiper = swiper;
  }
}

  hide() {
    this.showModal = false;
    this.document.body.classList.remove('no-scroll');

  }

  openDialog_(): void {
    const dialogRef = this.dialog.open(DailogComponent, {
      width: '250px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }
  getCart: any = []
  ngOnInit() {
      // if product does not have sizes from admin, fetch from service
    this.sizes = this.sizeService.getSizes(this.cartItems.category, this.cartItems.sub_category);
    console.log("sizes",this.sizes)

    //if (this.cartItems?.disabled_size == "true") {
      this.selectedColor = this.colorCodes[0];
      //this.selectedSize = this.sizes[0];
    //} else {
      //this.selectedColor = this.colorCodes[0];
    //}
    this.updateImage();
  }
  addCartItem: any = []
  addCart(cartData: any) {
    let user: any
    user = localStorage.getItem("login_user")
    let userId = JSON.parse(user);
    cartData.userId = userId?.userId
    cartData.quantity = this.counter
    cartData.isGuest = userId?.isGuest
    cartData.image_url = this.selectedImage[0].images
    cartData.size = this.selectedImage[0].size
    cartData.color = this.selectedImage[0].color
    cartData.variants = []
    this.addCartService.addToCart(cartData)
  }
  addDetails() {
    this.router.navigate(['./useraddress'])
  }
  onColorSelect(code:any) {
  this.selectedColor = code;
    setTimeout(() => {
      this.mainSwiper?.swiperRef?.update();
      this.thumbsSwiperRef?.swiperRef?.update();
      this.mainSwiper?.swiperRef?.slideTo(0); // reset to first image
      this.updateImage();
      this.cd.detectChanges();
    },0);
    this.mainSwiper?.swiperRef?.slideTo(0);
  }

  onSizeSelect(size: string) {
    this.selectedSize = size;
    setTimeout(() => {
      this.mainSwiper?.swiperRef.update();
      this.thumbsSwiperRef?.swiperRef.update();
      this.mainSwiper?.swiperRef.slideTo(0); // reset to first image
      this.updateImage();
      this.cd.detectChanges();
    },0);

  }

  updateImage() {
    // if (this.cartItems?.disabled_size == "true") {
    //   const match = this.cartItems?.variants.filter(
    //     (v: any) => v.colorCode === this.selectedColor && v.size === this.selectedSize);
    //   this.selectedImage = match ? match : null;

    // } else {
      const match = this.cartItems?.variants.filter(
        (v: any) => v.colorCode === this.selectedColor);
      this.selectedImage = match ? match : null;
    //}
  }

}
export interface Product {
  id: number,
  category: string,
  delivery_date: number,
  img_front: string,
  product_description: string,
  product_discount: number,
  product_mrp_price: number,
  product_name: string,
  product_price: number,
  userId: string,
  isGuest: boolean,
  user_first_name: string
}