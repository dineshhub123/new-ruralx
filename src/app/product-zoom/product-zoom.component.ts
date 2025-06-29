import { Component, OnInit, Inject, ViewChild } from '@angular/core';
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
// Register Swiper modules
SwiperCore.use([Zoom, Thumbs, Pagination]);

@Component({
  selector: 'app-product-zoom',
  templateUrl: './product-zoom.component.html',
  styleUrls: ['./product-zoom.component.css']
})
export class ProductZoomComponent implements OnInit {
  @ViewChild('mainSwiper', { static: false }) ProductZoomComponent?: ProductZoomComponent;

  thumbsSwiper: any;
  public showModal: boolean = false;
  show() {
    this.showModal = true;
    this.document.body.classList.add('no-scroll');
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

  increment() {
    this.counter += 1;
  }

  decrement() {
    if (this.counter > 0) {
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
    @Inject(DOCUMENT) private document: Document,
  ) {
    let itemZoom: any;
    itemZoom = localStorage.getItem('selected-item')
    this.cartItems = JSON.parse(itemZoom)
    this.displayItems = [
      this.cartItems.img_front,
      this.cartItems.img_side,
      this.cartItems.img_back,
      this.cartItems.img_top,
      this.cartItems.img_triangle,
    ]
    this.cartItems["displayImages"] = this.displayItems;

    console.log("cartItem", this.cartItems?.displayImages)

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
  }
  ChildFrontDisplay(childImg: any) {
    this.cartItems.img_front = childImg;

  }
  addCartItem: any = []


  addCart(cartData: any) {
    cartData["quantity"] = this.counter
    this.addCartService.addToCart(cartData)
  }
  addDetails() {
    this.router.navigate(['./useraddress'])
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
  product_price: number
}