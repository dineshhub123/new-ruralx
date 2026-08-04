import { Component, OnInit, ElementRef, Renderer2, ViewChild, HostListener, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AddcartService } from '../services/addcart.service';
import { environment } from 'src/environments/environment.prod';
import { SizeService } from '../services/size.service';
import { AddcartDailogComponent } from '../addcart-dailog/addcart-dailog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  private allSearchItems: any[] = [];
  public items: any;
  public addCartData: any;
  public hideHeader: boolean = false;
  public sizes: any[] = [];
  public mainCategory: any;
  public subCategory: any;
  public selectedCategory = 'All Category';
  public selectedSubCategory = 'All';
  public chipsList: any[] = [];
  public subCategoryChips: any[] = [];
  filteredProducts: any[] = [];
  allProducts: any[] = [];
  showAllChip = true;
  lastScrollTop = 0;
  MAX_QTY = 4;
  flyCartIncreament: any
  constructor(public apiService: ApiService, public activatedRoute: ActivatedRoute, public router: Router, public addCartService: AddcartService, private sizeService: SizeService, public dialog: MatDialog,
  ) {

  }
  category:any
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const category = params['category'];
      const subCategory = params['subCategory'];
      const source = params['source'];
      this.showAllChip = !!category;
      this.category = category;
      this.mainCategory = category;
      this.subCategory = subCategory;
      this.selectedCategory = 'All Category';
      this.selectedSubCategory = 'All';
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
          searchData: {
        category: this.mainCategory,
        sub_category: this.subCategory
      }

    // searchData: this.mainCategory
    //   ? { category: this.mainCategory }
    //   : ''
  };
  this.apiService.searchData(payload).subscribe((res: any) => {
    this.isLoading = false;
    const user = JSON.parse(localStorage.getItem('login_user') || '{}');
    this.searchItem = (res?.data || []).map((item: any) => {
      const firstVariant = item.variants?.[0];
      item.selectedColor = firstVariant?.colorCode || '';
      item.selectedSize = item.size || '';
      const cartData = this.convertToCartDBFormat(item, user.userId);
      return {
        ...item,
        ...cartData
      };
    });
    this.allSearchItems = [...this.searchItem];
    this.selectedCategory = 'All Category';
    this.selectedSubCategory = 'All';
    this.buildCategoryChips();
    this.updateSubCategoryChips();
    this.applyFilters();

    if (this.searchItem.length > 0) {
      this.sizes = this.sizeService.getSizes(
        this.searchItem[0].category,
        this.searchItem[0].sub_category
      );
    }

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
    const updateItem = (item: any) => {
      const found = cart.find((c: any) => c.product_id === item.product_id);
      return {
        ...item,
        id: found?.id || null,
        quantity: found ? found.quantity : 0
      };
    };

    this.allSearchItems = this.allSearchItems?.map(updateItem);
    this.searchItem = this.searchItem?.map(updateItem);
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
openFilter(): void {
  // A product listing can be opened from a subcategory (for example, "Tshirts").
  // Use the product's parent category so boys', girls', and kids' age filters appear.
  const category = this.searchItem?.[0]?.category || this.mainCategory;
  const sheet = this.dialog.open(ProductFilterSheetComponent, {
    panelClass: 'product-filter-dialog',
    position: { bottom: '0' },
    width: '100vw',
    maxWidth: '100vw',
    enterAnimationDuration: '1ms',
    exitAnimationDuration: '350ms',
    data: {
      category,
      selectedPrice: this.selectedPrice,
      selectedAge: this.selectedAge
    }
  });
  sheet.afterClosed().subscribe((filter) => {
    if (!filter) return;
    this.selectedPrice = filter.price;
    this.selectedAge = filter.age;
    this.applyFilters();
  });
}
  selectedAge = 'all';

  private applyFilters(): void {
    this.searchItem = this.allSearchItems.filter(item => {
      const categoryMatch = this.selectedCategory === 'All Category' || item.category === this.selectedCategory;
      const subCategoryMatch = this.selectedSubCategory === 'All' || item.sub_category === this.selectedSubCategory;
      const price = Number(item.price ?? item.product_price ?? 0);
      const priceMatch = this.selectedPrice === 'all' || this.isPriceInRange(price, this.selectedPrice);
      const ageMatch = this.selectedAge === 'all' || this.matchesAge(item, this.selectedAge);
      return categoryMatch && subCategoryMatch && priceMatch && ageMatch;
    });
  }

  private buildCategoryChips(): void {
    const map = new Map<string, any>();
    this.allSearchItems.forEach((product: any) => {
      if (!map.has(product.category)) {
        map.set(product.category, {
          category: product.category,
          image: product.variants?.[0]?.images?.[0]
            ? this.imageBaseUrl + '/' + product.variants[0].images[0]
            : 'assets/category/default.png'
        });
      }
    });
    this.chipsList = [
      { category: 'All Category', image: '' },
      ...Array.from(map.values())
    ];
  }

  private updateSubCategoryChips(): void {
    const products = this.selectedCategory === 'All Category'
      ? this.allSearchItems
      : this.allSearchItems.filter(item => item.category === this.selectedCategory);

    const map = new Map<string, any>();
    products.forEach((product: any) => {
      if (!map.has(product.sub_category)) {
        map.set(product.sub_category, {
          subCategory: product.sub_category
        });
      }
    });

    this.subCategoryChips = [
      { subCategory: 'All' },
      ...Array.from(map.values())
    ];
  }

  private isPriceInRange(price: number, range: string): boolean {
    const selectedRange = this.priceRanges.find(item => item.value === range);
    if (!selectedRange) return true;
    return (selectedRange.minPrice === null || price >= selectedRange.minPrice) &&
      (selectedRange.maxPrice === null || price <= selectedRange.maxPrice);
  }

  private matchesAge(item: any, age: string): boolean {
    // Supports the common API fields and keeps products visible when no age data exists yet.
    const productAge = String(item.age ?? item.age_group ?? item.ageGroup ?? item.size ?? '').toLowerCase();
    const selectedAge = age.toLowerCase().replace('-months', '');
    return !productAge || productAge.includes(age.toLowerCase()) || productAge.includes(selectedAge);
  }
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.selectedSubCategory = 'All';
    this.updateSubCategoryChips();
    this.applyFilters();
  }

  selectSubCategory(subCategory: string) {
    this.selectedSubCategory = subCategory;
    this.applyFilters();
  }

  onselectCategory(category: any, subCategory: any) {
    if (category === 'All Category') {
      this.itemInitilize();   // Your all products API
      return;
    }
    const payload = {
      searchData: {
        "category": category,
        "sub_category": subCategory
      }
    };
    this.isLoading = true;
    this.apiService.searchData(payload).subscribe((res: any) => {
      this.isLoading = false;
      this.searchItem = res;
      const user = JSON.parse(localStorage.getItem('login_user') || '{}');
      this.searchItem = (res || []).map((item: any) => {
        const firstVariant = item.variants?.[0];
        item.selectedColor = firstVariant?.colorCode || '';
        item.selectedSize = item.size || '';
        const cartData = this.convertToCartDBFormat(item, user.userId);
        return {
          ...item,
          ...cartData
        };
      });
      this.allSearchItems = [...this.searchItem];
      this.buildCategoryChips();
      this.updateSubCategoryChips();
      this.applyFilters();
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
formatCategoryName(category: string): string {
  if (!category) return '';
  category = category.trim().toLowerCase();
  const names: { [key: string]: string } = {
    home_kitchen: 'Home & Kitchen',
    beauty_personal_care: 'Beauty & Personal Care',
    electronics: 'Electronics',
    electricals: 'Electricals',
    mens: "Men's Fashion",
    womens: "Women's Fashion",
    boys: "Boys' Fashion",
    girls: "Girls' Fashion",
    kids: "Kids & Toys"
  };

  return (
    names[category] ||
    category
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
  );
}

}

@Component({
  selector: 'app-product-filter-sheet',
  template: `
    <section class="filter-sheet">
      <div class="filter-sheet__handle" aria-hidden="true"></div>
      <div class="filter-sheet__header">
        <div>
          <span class="filter-sheet__eyebrow">{{ categoryLabel }}</span>
          <h3>Filter products</h3>
        </div>
        <button class="filter-sheet__close" mat-icon-button aria-label="Close filter" (click)="close()"><mat-icon>close</mat-icon></button>
      </div>

      <div class="filter-section">
        <div class="filter-section__title"><mat-icon>account_balance_wallet</mat-icon><h4>Price range</h4></div>
        <mat-chip-listbox [(ngModel)]="selectedPrice" aria-label="Price range">
          <mat-chip-option *ngFor="let range of priceRanges" [value]="range.value">{{ range.label }}</mat-chip-option>
        </mat-chip-listbox>
      </div>

      <div class="filter-section" *ngIf="ageRanges.length">
        <div class="filter-section__title"><mat-icon>child_care</mat-icon><h4>{{ ageHeading }}</h4></div>
        <mat-chip-listbox [(ngModel)]="selectedAge" aria-label="Age range">
          <mat-chip-option *ngFor="let age of ageRanges" [value]="age.value">{{ age.label }}</mat-chip-option>
        </mat-chip-listbox>
      </div>

      <div class="filter-sheet__actions">
        <button class="filter-sheet__clear" mat-stroked-button (click)="clear()">Clear all</button>
        <button class="filter-sheet__apply" mat-raised-button color="primary" (click)="apply()"><mat-icon>done</mat-icon>Apply filters</button>
      </div>
    </section>
  `,
  styles: [`
    .filter-sheet { padding: 9px 16px calc(18px + env(safe-area-inset-bottom)); color: #172b3a; }
    .filter-sheet__handle { width: 40px; height: 4px; margin: 0 auto 0px; border-radius: 10px; background: #d6dde2; }
    .filter-sheet__header, .filter-sheet__actions { display: flex; align-items: center; justify-content: space-between; }
    .filter-sheet__eyebrow { display: block; color: #2e7d32; font-size: 11px; font-weight: 700; letter-spacing: .7px; text-transform: uppercase; }
    .filter-sheet__header h3 { margin: 2px 0 0; color: #102a43; font-size: 16px; font-weight: 700; }
    .filter-sheet__close { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; padding: 0; color: #52616b; background: #f2f5f6; --mdc-icon-button-state-layer-size: 34px; }
    .filter-sheet__close mat-icon { width: 20px; height: 20px; font-size: 20px; line-height: 20px; }
    .filter-section { margin-top: 10px; padding: 8px; border: 1px solid #e6ece9; border-radius: 10px; background: #fbfdfc; }
    .filter-section__title { display: flex; align-items: center; gap: 5px; margin-bottom: 4px; }
    .filter-section__title mat-icon { width: 19px; height: 19px; font-size: 19px; color: #2e7d32; }
    h4 { margin: 0; font-size: 14px; font-weight: 700; color: #1e3d2a; }
    mat-chip-listbox { display: flex; flex-wrap: wrap; gap: 8px; }
    :host ::ng-deep .mat-mdc-chip { border: 1px solid #d9e4dd !important; background: #fff !important; }
    :host ::ng-deep .mat-mdc-chip .mdc-evolution-chip__text-label { font-size: 11px !important; }
    :host ::ng-deep .mat-mdc-chip.mdc-evolution-chip--selected { border-color: #2e7d32 !important; background: #e8f5e9 !important; }
    :host ::ng-deep .mat-mdc-chip.mdc-evolution-chip--selected .mdc-evolution-chip__text-label { color: #1f6a2d !important; font-weight: 700; }
    :host ::ng-deep .mat-mdc-chip.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark { color: #2e7d32 !important; }
    :host ::ng-deep .mat-mdc-chip.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path { stroke: #2e7d32 !important; }
    .filter-sheet__actions { gap: 10px; margin-top: 10px; padding-top: 14px; border-top: 1px solid #edf0ee; }
    .filter-sheet__actions button { min-height: 44px; flex: 1; border-radius: 10px; font-weight: 700; }
    .filter-sheet__clear { border-color: #9aa8a1; color: #355142; }
    .filter-sheet__apply { display: flex; align-items: center; justify-content: center; gap: 4px; background: #2e7d32; }
    .filter-sheet__apply mat-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class ProductFilterSheetComponent {
  selectedPrice: string;
  selectedAge: string;
  readonly priceRanges = [
    { label: 'All', value: 'all' }, { label: 'Under ₹299', value: '0-299' },
    { label: '₹300–₹499', value: '300-499' }, { label: '₹500–₹999', value: '500-999' },
    { label: '₹1000–₹1999', value: '1000-1999' }, { label: '₹2000+', value: '2000-plus' }
  ];
  readonly ageChips = [
    { label: 'All', value: 'all' }, { label: '2–4 Y', value: '2-4' }, { label: '4–6 Y', value: '4-6' },
    { label: '6–8 Y', value: '6-8' }, { label: '8–10 Y', value: '8-10' }, { label: '10–12 Y', value: '10-12' },
    { label: '12–14 Y', value: '12-14' }, { label: '14–16 Y', value: '14-16' }
  ];
  readonly monthAges = [
    { label: 'All', value: 'all' }, { label: '0–6 M', value: '0-6' }, { label: '6–12 M', value: '6-12' },
    { label: '12–18 M', value: '12-18' }, { label: '18–24 M', value: '18-24' }
  ];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<ProductFilterSheetComponent>) {
    this.selectedPrice = data.selectedPrice || 'all';
    this.selectedAge = data.selectedAge || 'all';
  }

  get ageRanges() {
    const category = String(this.data.category || '').toLowerCase();
    if (category.includes('kid') || category.includes('toddler') || category.includes('baby')) {
      return this.monthAges;
    }
    if (category.includes('boy') || category.includes('girl')) {
      return this.ageChips;
    }
    return [];
  }

  get categoryLabel(): string {
    return this.formatCategoryName(String(this.data.category || 'All products'));
  }

  formatCategoryName(category: string): string {
    if (!category) return '';
    category = category.trim().toLowerCase();
    const names: { [key: string]: string } = {
      home_kitchen: 'Home & Kitchen',
      beauty_personal_care: 'Beauty & Personal Care',
      electronics: 'Electronics',
      electricals: 'Electricals',
      mens: "Men's Fashion",
      womens: "Women's Fashion",
      boys: "Boys' Fashion",
      girls: "Girls' Fashion",
      kids: 'Kids & Toys'
    };

    return names[category] || category
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  get ageHeading(): string {
    const category = String(this.data.category || '').toLowerCase();
    console.log("category",category)
    return category.includes('kids') || category.includes('toddler') || category.includes('baby')
      ? 'Age (months)' : 'Age (years)';
  }
  clear(): void { this.selectedPrice = 'all'; this.selectedAge = 'all'; }
  close(): void { this.dialogRef.close(); }
  apply(): void { this.dialogRef.close({ price: this.selectedPrice, age: this.selectedAge }); }
}

