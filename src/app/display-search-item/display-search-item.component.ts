import { Component, OnInit, ElementRef, Renderer2, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AddcartService } from '../services/addcart.service';
import { environment } from 'src/environments/environment.prod';
import { SizeService } from '../services/size.service';
import { AddcartDailogComponent } from '../addcart-dailog/addcart-dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-display-search-item',
  templateUrl: './display-search-item.component.html',
  styleUrls: ['./display-search-item.component.css']
})
export class DisplaySearchItemComponent implements OnInit {
  @HostListener('window:scroll', [])
  imageBaseUrl = environment.imageBaseUrl;
  public isLoading: boolean = false;
  public searchItem: any;
  public items: any;
  public addCartData: any;
  public hideHeader: boolean = false;
  public sizes: any[] = [];
  lastScrollTop = 0;
  MAX_QTY = 4;
  flyCartIncreament: any
  constructor(public apiService: ApiService, public activatedRoute: ActivatedRoute, public router: Router, public addCartService: AddcartService, private sizeService: SizeService, public dialog: MatDialog,
  ) {

  }
  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      const category = params['category'];
      if (category) {
        this.itemInitilize(category);
      }
    });

    this.addCartService.cart$.subscribe((cart: any[]) => {
      if (this.searchItem?.length) {
        this.updateSearchWithCart(cart);
      }
    });

  }
itemInitilize(category: string) {

  this.isLoading = true;

  const payload = {
    searchData: category
  };

  this.apiService.searchData(payload).subscribe((res: any) => {

    this.isLoading = false;

    const user = JSON.parse(localStorage.getItem('login_user') || '{}');

    this.searchItem = (res || []).map((item: any) => {

      const firstVariant = item.variants?.[0];

      // ✅ set default selections
      item.selectedColor = firstVariant?.colorCode || '';
      item.selectedSize = item.size || '';

      // ✅ convert to cart format
      const cartData = this.convertToCartDBFormat(item, user.userId);

      // ✅ merge (IMPORTANT FIX)
      return {
        ...item,        // keep original product (variants etc.)
        ...cartData     // add cart fields (id, quantity, color, image)
      };

    });

    // ✅ set sizes (only once)
    if (this.searchItem.length > 0) {
      this.sizes = this.sizeService.getSizes(
        this.searchItem[0].category,
        this.searchItem[0].sub_category
      );
    }

    console.log("Final searchItem:", this.searchItem);

    // ✅ sync with cart
    this.updateSearchWithCart(this.addCartService.getCart());

  });

}


  convertToCartDBFormat(item: any, userId: string) {
    const selectedVariant = item.variants?.find(
      (v: any) => v.colorCode === item.selectedColor
    ) || item.variants?.[0];

    return {
      id: item.id || null, // if already exists in cart
      user_id: userId, // pass from login
      product_id: item.product_id,
      product_name: item.product_name,
      category: item.category,
      sub_category: item.sub_category,
      // ✅ convert to string (DB format)
      price: Number(item.product_price).toFixed(2),
      mrp: Number(item.product_mrp_price).toFixed(2),
      discount: Number(item.product_discount).toFixed(2),
      quantity: item.quantity > 0 ? item.quantity : 0,
      size: item.selectedSize || item.size || '',
      color: selectedVariant?.color || item.color || '',
      image: selectedVariant?.images?.[0] || '',
      hsn_code: item.hsn_code,
      gst_rate: item.gst_rate,
      created_at: item.created_at || null,
      updated_at: item.updated_at || null
    };

  }
  updateSearchWithCart(cart: any[]) {
    this.searchItem = this.searchItem?.map((item: any) => {
      const found = cart.find((c: any) =>
        c.product_id === item.product_id
      );
      return {
        ...item,
        id: found?.id || null,      // 🔥 THIS IS THE FIX
        quantity: found ? found.quantity : 0
      };
    });

  }

  onWindowScroll() {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;
    // Always show header at top
    if (currentScroll <= 0) {
      this.hideHeader = false;
      return;
    }

    // Scroll down → hide
    if (currentScroll > this.lastScrollTop && currentScroll > 80) {
      this.hideHeader = true;
    }
    // Scroll up → show
    else if (currentScroll < this.lastScrollTop) {
      this.hideHeader = false;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
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

  flyToCartFromEvent(event: MouseEvent) {
    if (this.currentQty >= this.MAX_QTY) {
      return;
    }
    const target = event.currentTarget as HTMLElement;

    // Find the product card
    const productCard = target.closest('.product-card');
    if (!productCard) return;

    // Find the image inside this card
    const productImg = productCard.querySelector(
      '.product-image'
    ) as HTMLElement;

    if (productImg) {
      this.flyToCart(productImg);
    }

  }
  get currentQty(): number {
    const item = this.searchItem.find((i: any) => i.id);
    return item?.quantity || 0;
  }


  ngAfterViewInit() {

  }
  imgClick(item: any) {
    this.router.navigate(['/pzoom'], {
      queryParams: {
        product_id: item.product_id
      }
    });

  }
  addCartQuntity(event: any, addItam: any) {
    let user: any;
    user = localStorage.getItem("login_user");
    let findUser = JSON.parse(user)
    if (this.sizes?.length > 0) {
      const dialogRef = this.dialog.open(AddcartDailogComponent, {
        data: {
          cartData: addItam,
          user: findUser,
          sizes: this.sizes
        }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    else {
      const addCartPayload = {
        product_id: addItam.product_id,
        product_name: addItam.product_name,
        price: addItam.price,
        mrp: addItam.mrp,
        discount: addItam.product_discount,
        quantity: 1,
        size: addItam?.size,
        color: addItam.color,
        image: addItam?.image
      };
      this.addCartService.addToCart(addCartPayload).subscribe((res: any) => {
        this.addCartService.loadCartFromAPI();
      });
      this.flyToCartFromEvent(event);
    }

  }


  mapToCartFormat(item: any) {
    const selectedVariant = item.variants?.find(
      (v: any) => v.color === item.color || v.colorCode === item.selectedColor
    ) || item.variants?.[0];

    return {
      id: item.id,
      product_id: item.product_id,
      product_name: item.product_name,
      price: item.product_price,
      mrp: item.product_mrp_price,
      discount: item.product_discount,
      quantity: item.quantity || 1,
      // 🔥 VERY IMPORTANT
      size: item.size || item.selectedSize || '',
      color: item.color || selectedVariant?.color || '',
      image: item.image || selectedVariant?.images?.[0] || '',
      hsn_code: item.hsn_code,
      gst_rate: item.gst_rate
    };
  }

  increment(item: any) {
    if (item.quantity >= this.MAX_QTY) return;
    const cartItem = this.mapToCartFormat(item);
    const newQty = item.quantity + 1;
    this.addCartService.updateQuantity(cartItem, newQty).subscribe(() => {
      this.addCartService.loadCartFromAPI();
    });
  }


  decrement(item: any) {
    const newQty = item.quantity - 1;
    this.addCartService.updateQuantity(item, newQty).subscribe(() => {
      this.addCartService.loadCartFromAPI();
    });

  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}

