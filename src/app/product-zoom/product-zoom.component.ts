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
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';

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
  public productReview: any[] = [];
  public ratingSummary: any[] = [];
  public visibleRatings: any[] = [];
  public showAll = false;
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  selectedImage: any[] = [];
  summary: any = {};
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
    private scrollService: ScrollService,
    private loginService: LoginService,
    private toast: ToastrService
  ) {

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

  loadProduct(productId: string) {
    let payload = {
      product_id: productId
    }
    this.apiService.getProductById(payload).subscribe((res: any) => {
      this.cartItems = res?.data;
      this.getProductReview(this.cartItems?.product_id)
      this.colorCodes = [...new Set(this.cartItems?.variants?.map((v: any) => v.colorCode))];
      this.sizes = this.sizeService.getSizes(this.cartItems.category, this.cartItems.sub_category);
      this.selectedColor = this.colorCodes[0];
      this.selectedSize = this.sizes[1]
      this.updateImage();


    });
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
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const productId = params['product_id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });

  }

  addCartItem: any = []
  addCart(cartData: any) {
    const addCartPayload = {
      product_id: cartData.product_id,
      product_name: cartData.product_name,
      price: cartData.product_price,
      mrp: cartData.product_mrp_price,
      discount: cartData.product_discount,
      quantity: this.counter,
      size: this.selectedSize ? this.selectedSize : "",
      color: this.selectedImage[0].color,
      image: this.selectedImage[0].images[0]
    };
    this.addCartService.addToCart(addCartPayload).subscribe((res: any) => {
      this.addCartService.loadCartFromAPI();
    });
  }

  buyNow(product: any) {
    //get current user synchronously (better)
    const user = JSON.parse(localStorage.getItem('login_user') || '{}');
    if (!user || user.user_first_name === 'Guest') {
      this.router.navigate(['/login']);
      return;
    }
    //validation
    if (!this.selectedImage?.length) {
      this.toast.error('Please select color');
      return;
    }
    //create NEW object (do not mutate original)
    const payload = {
      product_id: product.product_id,
      product_name: product.product_name,
      price: product.product_price,
      mrp: product.product_mrp_price,
      discount: product.product_discount,
      quantity: this.counter || 1,
      size: this.selectedSize || '',
      color: this.selectedImage[0].color,
      image: this.selectedImage[0].images[0]
    };
    // store in localStorage
    this.addCartService.setBuyNowItem(payload);
    // navigate
    this.router.navigate(['/useraddress']);
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
  getVariantLabel(item: any): string {

    if (!item || item.length === 0) return 'Variant';

    const first = item[0];

    if (first.includes('GB') || first.includes('TB')) {
      return 'Storage';
    }

    if (!isNaN(first)) {
      return 'Size';
    }
    // Kids Size (5C, 6C, 1Y, 2Y)
    if (first.match(/^\d+(C|Y)$/)) {
      return 'Size';
    }

    const clothSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    if (clothSizes.includes(first.toUpperCase())) {
      return 'Size';
    }
    return 'Variant';
  }

  // cusomer Review

  selectedSort = 'top';

  sortChanged() {
    // Call API based on sort
  }

  markHelpful(review: any) {
    try {
      const formData = new FormData();
      formData.append('review_id', String(review?.id));
      formData.append('user_id', review?.user_id);
      formData.append('user_name', review?.user_name);
      this.apiService.submitReviewHelpful(formData).subscribe((res) => {
        if (res.status) {
          review.helpful_count++;
        }
      })
    } catch (err) {
      console.log(err)
    }

  }

  writeReview() {
    this.router.navigate(['/write-review', this.cartItems.product_id])
  }

  getProductReview(productId: any) {
    try {
      this.apiService.getProductReview(productId).subscribe((res) => {
        this.productReview = res?.data;
        this.visibleRatings = this.productReview.slice(0, 6);
      })
      this.apiService.getReviewSummary(productId).subscribe((res) => {
        this.summary = res?.data
        // ⭐ Convert to UI Array Format
        this.ratingSummary = [
          { star: 5, percent: this.summary.five_star },
          { star: 4, percent: this.summary.four_star },
          { star: 3, percent: this.summary.three_star },
          { star: 2, percent: this.summary.two_star },
          { star: 1, percent: this.summary.one_star }
        ];
      })
    } catch (err) {
      console.log(err)
    }
  }
  toggleRatings() {
    this.showAll = !this.showAll;
    this.updateVisibleRatings();
  }

  updateVisibleRatings() {
    this.visibleRatings = this.showAll
      ? this.productReview
      : this.productReview.slice(0, 5);
  }

  getFullStars() {
    const rating = Number(this.summary?.avg_rating) || 0;
    return Array(Math.floor(rating)).fill(0);
  }

  hasHalfStar() {
    return this.summary?.avg_rating % 1 >= 0.2;
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