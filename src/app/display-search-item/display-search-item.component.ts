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
  public mainCategory :any;
  public selectedCategory = 'All Category';
  public chipsList:any
  showAllChip = true;
  lastScrollTop = 0;
  MAX_QTY = 4;
  flyCartIncreament: any
  constructor(public apiService: ApiService, public activatedRoute: ActivatedRoute, public router: Router, public addCartService: AddcartService, private sizeService: SizeService, public dialog: MatDialog,
  ) {

  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const category = params['category'];
       const source = params['source'];
      this.showAllChip = source === 'dashboard';
      this.mainCategory = category
      if (category) {
        this.itemInitilize();
      }
    });

    this.addCartService.cart$.subscribe((cart: any[]) => {
      if (this.searchItem?.length) {
        this.updateSearchWithCart(cart);
      }
    });

  }
itemInitilize() {
  this.isLoading = true;
  const payload = {
    searchData: this.mainCategory
  };
  this.apiService.searchData(payload).subscribe((res: any) => {
    this.isLoading = false;
    const user = JSON.parse(localStorage.getItem('login_user') || '{}');
    this.searchItem = (res || []).map((item: any) => {
      const firstVariant = item.variants?.[0];
      // ✅ set default selections
      item.selectedColor = firstVariant?.colorCode || '';
      item.selectedSize = item.size || '';
      const cartData = this.convertToCartDBFormat(item, user.userId);
      return {
        ...item,        
        ...cartData   
      };

    });

    // ✅ set sizes (only once)
    if (this.searchItem.length > 0) {
      this.sizes = this.sizeService.getSizes(
        this.searchItem[0].category,
        this.searchItem[0].sub_category
      );
    }
      const map = new Map();
      this.searchItem.forEach((product:any) => {
        if (!map.has(product.sub_category)) {
          map.set(product.sub_category, {
            name: product.sub_category,
            image: product.variants?.[0]?.images?.[0]
              ? this.imageBaseUrl + '/' + product.variants[0].images[0]
              : 'assets/category/default.png'
          });
        }
      });

      this.chipsList = [
        {
          name: 'All Category',
          image: ''
        },
        ...Array.from(map.values())
      ];

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
      image: selectedVariant?.images?.[0] || '0',
      stock:selectedVariant?.stock > 0 ? selectedVariant?.stock: 0,
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
    console.log("addItam",addItam)
    let user: any;
    user = localStorage.getItem("login_user");
    let findUser = JSON.parse(user)
    if (this.sizes?.length > 0) {
      const dialogRef = this.dialog.open(AddcartDailogComponent, {
       width: '350px',
       maxWidth: '95vw',   // responsive
       height: 'auto',
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
selectedPrice = 'all';

  priceRanges = [
  {
    label: 'All',
    value: 'all',
    minPrice: null,
    maxPrice: null
  },
  {
    label: 'Under-₹299',
    value: '0-299',
    minPrice: 0,
    maxPrice: 299
  },
  {
    label: '₹300-₹499',
    value: '300-499',
    minPrice: 300,
    maxPrice: 499
  },
  {
    label: '₹500-₹999',
    value: '500-999',
    minPrice: 500,
    maxPrice: 999
  },
  {
    label: '₹1000-₹1999',
    value: '1000-1999',
    minPrice: 1000,
    maxPrice: 1999
  },
  {
    label: '₹2000+',
    value: '2000-plus',
    minPrice: 2000,
    maxPrice: null
  }
];
openFilter(){
  
}
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.onselectCategory(category)
    console.log("selectedCategory", this.selectedCategory)
  }

onselectCategory(category: any) {
  if (category === 'All Category') {
    this.itemInitilize();   // Your all products API
    return;
  }
  const payload = {
    searchData: category
  };
  this.isLoading = true;
  this.apiService.searchData(payload).subscribe((res: any) => {
    this.isLoading = false;
    this.searchItem = res;
    const user = JSON.parse(localStorage.getItem('login_user') || '{}');
    this.searchItem = (res || []).map((item: any) => {
      const firstVariant = item.variants?.[0];
      // ✅ set default selections
      item.selectedColor = firstVariant?.colorCode || '';
      item.selectedSize = item.size || '';
      const cartData = this.convertToCartDBFormat(item, user.userId);
      return {
        ...item,        
        ...cartData   
      };

    });
  });
} 

categoryInfo: any = {
    mens: {
      title: 'Mens',
      description: "Explore our wide range of men's fashion and accessories."
    },
    womens: {
      title: 'Womens',
      description: "Explore our wide range of women's fashion and accessories."
    },
    boys: {
      title: 'Boys',
      description: "Find stylish and comfortable clothing for growing boys."
    },
    girls: {
      title: 'Girls',
      description: "Discover trendy outfits and accessories for girls."
    },
    toddler: {
      title: 'Kids',
      description: "Everything your little ones need, from clothing to footwear."
    },
    electronics: {
      title: 'Electronics',
      description: "Shop the latest gadgets, accessories, and electronic essentials."
    },
    electricals: {
      title: 'Electricals',
      description: "Quality electrical products for your home and workplace."
    },

    footwear: {
      title: 'Footwear',
      description: "Step into comfort with our collection of shoes, sandals, and slippers."
    },
    clothing: {
      title: 'Clothing',
      description: "Browse fashionable clothing for every occasion."
    },
    beauty: {
      title: 'Beauty',
      description: "Enhance your style with beauty and personal care products."
    },
    home: {
      title: 'Home & Kitchen',
      description: "Make your home better with quality home and kitchen essentials."
    }
  };

  getCategoryInfo(category: string) {
    return (
      this.categoryInfo[category?.toLowerCase()] || {
        title: category,
        description: 'Explore our latest collection of quality products.'
      }
    );
  }
  formatCategory(category: string): string {
    return (category || '').replaceAll('_', ' ');
  }

}

