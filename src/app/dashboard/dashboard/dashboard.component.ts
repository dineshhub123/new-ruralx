import { Component, ElementRef, inject, NgZone, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { EChartsOption } from 'echarts';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { trigger, transition, animate, style } from '@angular/animations';
import { forkJoin, range } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ScrollService } from 'src/app/scroll.service';
import { environment } from 'src/environments/environment.prod';
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
  loading = true;
  cardSubCategoryList: any[] = [];
  categoryData: any = {}; // store data per category
  constructor(private router: Router, private apiService: ApiService, private scrollService: ScrollService, private ngZone: NgZone) {
    this.apiService.getProductListDetailsData().subscribe(list => {
      const subCategory = list.map((sub: any) => sub.sub_category)
      // Remove duplicates
      const uniqueSubCategory = [...new Set(subCategory)];
      this.cardSubCategoryList = uniqueSubCategory;
      this.groupCards();
      this.fetchChipCategories(this.cardSubCategoryList)
      this.cardSubCategoryList.forEach((sub: any) => {
        this.dynamicCardCategory(sub);
      });
    })

  }

  ngOnInit() {
    this.fetchCategoriesTypeItems();
    window.addEventListener('pullToRefresh', () => {
      // 🔥 ENTER ANGULAR ZONE
      this.ngZone.run(() => {
        this.fetchCategoriesTypeItems();
      });
    }); this.scrollService.scroll$.subscribe(scrollTop => {
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
  chipsList: any[] = []; // dynamic chip list
  fetchChipCategories(category: any) {
    let payload = { searchData: category };
    this.apiService.searchData(payload).subscribe((list: any[]) => {
      // Remove duplicate categories
      const uniqueCategories = [
        ...new Set(list.map((item: any) => item.sub_category))
      ];
      // Build chip list dynamically
      this.chipsList = uniqueCategories.map(category => {
        const firstItem = list.find(item => item.sub_category === category);
        const image = firstItem?.variants?.[0]?.images || ['../assets/img/default.png'];
        this.loading = false;
        // ✅ limit to max 10 chips
        return {
          category: category,
          image: image
        };

      });
      this.chipsList = this.chipsList.slice(0, 14)
    });
  }

  dynamicCardCategory(subCategory: any) {
    let payload = { searchData: subCategory };
    this.apiService.searchData(payload).subscribe(itemList => {
      const productNames = itemList.flatMap((p: any) => p.product_name);
      const images = itemList.flatMap((p: any) =>
        p.variants.flatMap((v: any) => v.images[0])
      );
      // Store per subcategory
      this.categoryData[subCategory] = {
        name: productNames[0], // show first name or customize
        images: images.slice(0, 4), // first 4 images
        mrp:itemList.flatMap((p: any) => p.product_mrp_price),
        price:itemList.flatMap((p: any) => p.product_price),
        discount:itemList.flatMap((p: any) => p.product_discount)

      };
      this.loading = false;
    });
  }

  // for carousel
  carouselData: any[] = []; // to store category + images + names
  fetchCategoriesTypeItems() {
    // 🔄 Reset data on refresh
    this.carouselData = [];

    const categories = ['sandals', 'tshirts', 'shoes', 'saree', 'salwar_suit'];
    //const categories = ['saree'];

    // Create API calls array
    const requests = categories.map(category => {
      const payload = { searchData: category };
      return this.apiService.searchData(payload);
    });

    // 🔥 WAIT FOR ALL APIS
    forkJoin(requests).subscribe({
      next: (responses: any[]) => {

        responses.forEach((itemList, index) => {
          const category = categories[index];

          const names = itemList.map((p: any) => p.product_name);
          const images = itemList.flatMap((p: any) =>
            p.variants?.flatMap((v: any) => v.images?.[0] || []) || []
          );

          this.carouselData.push({
            category,
            productNames: names,
            images
          });
        });

        // ✅ STOP ANDROID SPINNER (ONLY ONCE)
        (window as any).Android?.stopSwipeRefresh();
        this.loading = false
      },
      error: (err) => {
        console.error(err);
        (window as any).Android?.stopSwipeRefresh();
        this.loading = false
      }
    });
  }



  onClickImage(category: any) {
    let selectedImage = {
      searchData: category
    };
    this.apiService.searchData(selectedImage).subscribe((res: any) => {
      let displaySearchData = res;
      localStorage.setItem('displaySearchData', JSON.stringify(displaySearchData))
      this.router.navigate(['./display-item'])
    })

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
groupedCategories: any[] = [];
groupCards() {
  const chunkSize = 4;
  for (let i = 0; i < this.cardSubCategoryList.length; i += chunkSize) {
    this.groupedCategories.push(
      this.cardSubCategoryList.slice(i, i + chunkSize)
    );
  }
}
}
