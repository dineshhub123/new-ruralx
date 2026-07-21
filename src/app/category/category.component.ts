import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  imageBaseUrl = environment.imageBaseUrl;
  public isLoading: boolean = false;
  constructor(public apiService: ApiService, public router: Router, private cdr: ChangeDetectorRef) { }
  selectedCategory = '';
  uniqueCategories: any[] = [];
  products: any[] = []
  selectedCategoryDisplay = '';

  onSelectCategory(category: string, displayText: string) {
    this.selectedCategory = category;
    const currentLang =
      localStorage.getItem('language') || 'en';

    this.selectedCategoryDisplay =
      currentLang === 'en'
        ? category
        : displayText;

    let categoryPayload = {
      searchData: category
    };

    this.apiService
      .getOnSelctCategoryList(categoryPayload)
      .subscribe(catList => {
        this.products = catList;
      });
  }
  // Get unique subcategories with one representative image
  get uniqueSubcategories() {
    const map = new Map();
    this.products.forEach(p => {
      if (!map.has(p.sub_category)) {
        map.set(p.sub_category, {
          name: p.sub_category,
          image: p.variants[0].images[0] // first image of first variant
        });
      }
    });
    return Array.from(map.values());
  }

  // Get all products for a subcategory
  getProductsBySub(subCategory: string) {
    return this.products.filter(p => p.sub_category === subCategory);
  }

  ngOnInit() {
    this.isLoading = true;
    this.apiService.getCategoryList().subscribe((response: any) => {
      this.isLoading = false;
      const products = response;
      const seen = new Set();
      this.uniqueCategories = products.filter((item: any) => {
        if (seen.has(item.category)) {
          return false;
        }
        seen.add(item.category);
        return true;
      });
      let defaultCategry = {
        searchData: this.uniqueCategories[0].category
      }
      this.apiService.getOnSelctCategoryList(defaultCategry).subscribe(catList => {
        this.isLoading = false;
        this.selectedCategory = this.uniqueCategories[0].category;
        this.selectedCategoryDisplay = this.uniqueCategories[0].category;
        this.products = catList
        this.cdr.detectChanges();
        setTimeout(() => {
          const firstCat: any =
            document.querySelector('.cat-name');
          if (firstCat) {
            this.selectedCategoryDisplay =
              firstCat.innerText.trim();
          } else {
            this.selectedCategoryDisplay =
              this.uniqueCategories[0].category;
          }
        }, 900);
      })
    })
  }
  onSelectMainCategory(subCate: any) {
    this.router.navigate(['/display-item'], {
      queryParams: {
        category: subCate
      }
    });
  }
  formatCategory(category: string): string {
    return (category || '').replaceAll('_', ' ');
  }
  onContentScroll(event: Event) {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    // ⭐ Android Pull-to-Refresh
    (window as any).Android?.setPullToRefreshEnabled?.(scrollTop <= 0);
  }
  selectedAge = 'all';

  ageChips = [
    { label: 'All', value: 'all' },
    { label: '2-4 Y', value: '2-4' },
    { label: '4-6 Y', value: '4-6' },
    { label: '6-8 Y', value: '6-8' },
    { label: '8-10 Y', value: '8-10' },
    { label: '10-12 Y', value: '10-12' },
    { label: '12-14 Y', value: '12-14' },
    { label: '14-16 Y', value: '14-16' }
  ];
 selectedKidsAge = 'all'

  kidsAgeChips = [
  { label: 'All', value: 'all' },
  { label: '0-6 M', value: '0-6-months' },
  { label: '6-12 M', value: '6-12-months' },
  { label: '12-18 M', value: '12-18-months' },
  { label: '18-24 M', value: '18-24-months' }
];

getCategorySubtitle(category: string): string {
  switch (category?.toLowerCase()) {
    case 'boys':
      return 'Find the best for your little champ';

    case 'girls':
      return "Discover styles she'll love every day";

    case 'toddler':
      return 'Everything your little ones need';

    case 'mens':
      return 'Upgrade your everyday style';

    case 'womens':
      return 'Discover elegance for every occasion';

    case 'electronics':
      return 'Smart gadgets for everyday life';

    case 'electricals':
      return 'Reliable essentials for your home';

    case 'technology':
      return 'Power your world with the latest tech';

    default:
      return 'Discover amazing products for everyone';
  }
}
}
