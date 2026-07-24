import { Component, ElementRef, inject, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ScrollService } from 'src/app/scroll.service';
import { environment } from 'src/environments/environment.prod';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent {
  imageBaseUrl = environment.imageBaseUrl;
  @ViewChild('tabHeader', { read: ElementRef })
  tabHeader!: ElementRef;
  public showHeaderAtTop: boolean = false;
  public lastScrollTop = 0;
  currentBannerIndex = 0;
  loading = true;
  chipsList: any[] = [];
  cardSubCategoryList: any[] = [];
  dashboardProducts: any = {};
  categoryList: string[] = [];
  categoryData: any = {}; 
  carouselData: any[] = []; 
  bannerImages: any[] = [];

  constructor(private router: Router, private apiService: ApiService, private scrollService: ScrollService, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.loadDashboardProducts();
    window.addEventListener('pullToRefresh', () => {
      this.ngZone.run(() => {
        this.loadDashboardProducts();
      });
    });

    this.scrollService.scroll$.subscribe(scrollTop => {
      // Always show header at top
      if (scrollTop <= 0) {
        this.showHeaderAtTop = false;
        return;
      }

      // Scroll down → hide
      if (scrollTop > this.lastScrollTop && scrollTop > 80) {
        this.showHeaderAtTop = true;
      }
      // Scroll up → show
      else if (scrollTop < this.lastScrollTop) {
        this.showHeaderAtTop = false;
      }

      this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  loadDashboardProducts(): void {
    this.apiService.getDashboardProductData().subscribe({
      next: (res: any) => {
        this.dashboardProducts = res;
        this.categoryList = Object.keys(res);
        this.rotateCategories();
        this.bannerImages = [];
        this.chipsList = [];
        this.categoryList.forEach((category: string) => {
          const products = res[category];
          if (!products?.length) {
            return;
          }
          // Banner Images (first image of every product)
          const bannerImages = products
            .map((product: any) => product.variants?.[0]?.images?.[0])
            .filter(Boolean);
          if (bannerImages.length) {
            const bannerObj = {
              category,
              image: bannerImages[0]
            };
            this.bannerImages.push(bannerObj);
            this.startBannerRotation(bannerImages, bannerObj);
          }
          // Chips List (unique sub categories)
          const uniqueSubCategories = [
            ...new Set(products.map((p: any) => p.sub_category))
          ];
          uniqueSubCategories.forEach((subCategory) => {
            const firstProduct = products.find(
              (p: any) => p.sub_category === subCategory
            );
            this.chipsList.push({
              category: subCategory,
              image: firstProduct?.variants?.[0]?.images || '../assets/img/default.png'
            });
          });
        });
        // Optional limit
        this.chipsList = this.chipsList.slice(0, 20);
        setTimeout(() => {
          ($('#homeBannerCarousel') as any).carousel();
        }, 500);
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  formatCategory(category: string): string {
    return (category || '').replaceAll('_', ' ');
  }

  ngAfterViewInit() {
    const header = this.tabHeader?.nativeElement
      .querySelector('.mat-mdc-tab-header');
    if (!header) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    header.addEventListener('mousedown', (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - header.offsetLeft;
      scrollLeft = header.scrollLeft;
    });
    header.addEventListener('mouseleave', () => isDown = false);
    header.addEventListener('mouseup', () => isDown = false);
    header.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - header.offsetLeft;
      const walk = (x - startX) * 1.5; // speed
      header.scrollLeft = scrollLeft - walk;
    });
  }
rotateCategories(): void {
  if (!this.categoryList.length) {
    return;
  }
  let index = Number(localStorage.getItem('categoryIndex') || '0');
  index = index % this.categoryList.length;
  this.categoryList = [
    ...this.categoryList.slice(index),
    ...this.categoryList.slice(0, index)
  ];
  localStorage.setItem(
    'categoryIndex',
    ((index + 1) % this.categoryList.length).toString()
  );
}

  getDiscountPercent(mrp: number, discount: number): number {
    if (!mrp || mrp <= 0) {
      return 0;
    }
    return Math.floor((discount / mrp) * 100);
  }

  startBannerRotation(images: string[], bannerObj: any) {
    let index = 0; // local index for this banner
    setInterval(() => {
      index = (index + 1) % images.length;
      bannerObj.image = images[index];
    }, 15000); // 15 sec
  }

  onClickImage(category: any) {
    this.router.navigate(['/display-item'], {
      queryParams: {
        category: category
      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  onTabChange(event: any) {
    const selectedCategory = this.chipsList[event.index]?.category;
    if (event.index !== 0) {
      this.onClickImage(selectedCategory);
    }
  }
}
