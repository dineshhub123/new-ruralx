import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DailogComponent } from '../dailog/dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { AddcartService } from '../services/addcart.service';
import Swiper from 'swiper';
import SwiperCore, { Zoom, Thumbs, Pagination, } from 'swiper';
import { ApiService } from '../services/api.service';
import { SwiperComponent } from 'swiper/angular';
import { SizeService } from '../services/size.service';
import { ScrollService } from '../scroll.service';
import { environment } from 'src/environments/environment.prod';
// Register Swiper modules
SwiperCore.use([Zoom, Thumbs, Pagination]);

@Component({
  selector: 'app-product-zoom',
  templateUrl: './product-zoom.component.html',
  styleUrls: ['./product-zoom.component.css']
})
export class ProductZoomComponent implements OnInit {
  imageBaseUrl = environment.imageBaseUrl;
  @ViewChild('mainSwiper') mainSwiper?: SwiperComponent;
  @ViewChild('thumbsSwiperRef') thumbsSwiperRef?: SwiperComponent;
  @ViewChild('mainProductImage', { static: false })
  mainProductImage!: ElementRef<HTMLElement>;

  thumbsSwiper: any;
  public showModal: boolean = false;
  show() {
    this.showModal = true;
    this.scrollService.openPopup();
    setTimeout(() => {
      this.resetThumbsSwiper();
      this.thumbsSwiper?.update();
    }, 100);
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
  MAX_QTY = 4;
  increment() {
    if (this.counter < this.MAX_QTY) {
    this.counter += 1;
    }
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
    private sizeService: SizeService,
    private scrollService:ScrollService,
  ) {

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
    this.scrollService.closePopup();
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
    this.sizes = this.sizeService.getSizes(this.cartItems.category, this.cartItems.sub_category);
    this.selectedColor = this.colorCodes[0];
    this.selectedSize = "M"
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
    cartData.size = this.sizes[0]
    cartData.color = this.selectedImage[0].color
    //cartData.variants = []
    this.addCartService.addToCart(cartData)
  }
  addDetails() {
    this.router.navigate(['./useraddress'])
  }
  onColorSelect(code: any) {
    this.selectedColor = code;
    setTimeout(() => {
      this.mainSwiper?.swiperRef?.update();
      this.thumbsSwiperRef?.swiperRef?.update();
      this.mainSwiper?.swiperRef?.slideTo(0); // reset to first image
      this.updateImage();
      this.cd.detectChanges();
    }, 0);
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
    }, 0);

  }

  updateImage() {
    const match = this.cartItems?.variants.filter((v: any) => v.colorCode === this.selectedColor);
    this.selectedImage = match ? match : null;
  }
  flyToCart(productImg: HTMLElement) {
    const cartIcon = document.getElementById('cartIconTarget');
    if (!cartIcon || !productImg) return;

    const imgClone = productImg.cloneNode(true) as HTMLElement;
    imgClone.classList.add('fly-img');
    document.body.appendChild(imgClone);

    const start = productImg.getBoundingClientRect();
    const end = cartIcon.getBoundingClientRect();

    // start position
    imgClone.style.left = start.left + 'px';
    imgClone.style.top = start.top + 'px';
    imgClone.style.width = start.width + 'px';
    imgClone.style.height = start.height + 'px';
    imgClone.style.borderRadius = '18px';
    // center of cart icon
    const xMove =
      end.left + end.width / 2 - (start.left + start.width / 2);
    const yMove =
      end.top + end.height / 2 - (start.top + start.height / 2);

    requestAnimationFrame(() => {
      imgClone.style.transform =
        `translate(${xMove}px, ${yMove}px) scale(0.15)`;
      imgClone.style.opacity = '0';
    });
    /* ✨ CART GLOW */
    cartIcon.classList.add('cart-glow', 'cart-bounce');
    setTimeout(() => {
      cartIcon.classList.remove('cart-glow', 'cart-bounce');
    }, 600);

    setTimeout(() => imgClone.remove(), 700);
  }
flyActiveSwiperImageToCart() {
  const activeImg = document.querySelector(
    '.swiper-slide-active img.product-image'
  ) as HTMLElement;

  if (activeImg) {
    this.flyToCart(activeImg);
  } else {
    console.warn('No active swiper image found');
  }
}

ngOnDestroy() {
  this.scrollService.closePopup();
  this.document.body.classList.remove('no-scroll');

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