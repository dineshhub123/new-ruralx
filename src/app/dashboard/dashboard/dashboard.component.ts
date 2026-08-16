import { Component, ElementRef, inject, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ApiService } from 'src/app/services/api.service';
import { ScrollService } from 'src/app/scroll.service';
import { environment } from 'src/environments/environment.prod';
import { AiAssistantComponent } from 'src/app/ai-assistant/ai-assistant.component';
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

  constructor(private router: Router, private apiService: ApiService, private scrollService: ScrollService, private ngZone: NgZone, private bottomSheet: MatBottomSheet) {
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
        this.dashboardProducts = res?.data;
        this.categoryList = Object.keys(this.dashboardProducts);
        this.rotateCategories();
        this.bannerImages = [];
        this.chipsList = [];
        this.categoryList.forEach((category: string) => {
          const products = this.dashboardProducts[category];
          if (!products?.length) {
            return;
          }

          // Banner Images (first image of every product)
          const bannerItems = products
            .filter((product: any) => product.variants?.[0]?.images?.[0])
            .map((product: any) => ({
              image: product.variants[0].images[0],
              category: product.main_category,
              subCategory: product.sub_category
            }));

          if (bannerItems.length) {
            const bannerObj = { ...bannerItems[0] };

            this.bannerImages.push(bannerObj);
            this.startBannerRotation(bannerItems, bannerObj);
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
              category: firstProduct.main_category,
              subCategory,
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

startBannerRotation(bannerItems: any[], bannerObj: any) {
  let index = 0;
  setInterval(() => {
    index = (index + 1) % bannerItems.length;
    bannerObj.image = bannerItems[index].image;
    bannerObj.category = bannerItems[index].category;
    bannerObj.subCategory = bannerItems[index].subCategory;
  }, 15000);
}

  onClickImage(category: any, subCategory: any) {
    this.router.navigate(['/display-item'], {
      queryParams: {
        category: category,
        subCategory,
        source: 'category'
      }
    });
  }

  onClickChips(category: any, subCategory: any) {
    this.router.navigate(['/display-item'], {
      queryParams: {
        category: category,
        subCategory,
        source: "category"
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
      //this.onClickImage(selectedCategory);
    }
  }

  openAiAssistant() {
    (window as any).Android?.setPullToRefreshEnabled?.(false);
    const bottomSheetRef = this.bottomSheet.open(AiAssistantComponent, {
      panelClass: 'ai-assistant-bottom-sheet'
    });

    bottomSheetRef.afterDismissed().subscribe(() => {
      (window as any).Android?.setPullToRefreshEnabled?.(true);
    });
  }

}
