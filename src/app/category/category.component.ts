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
  leftMenu = [
    { key: 'mens', label: 'Men', category: 'mens' },
    { key: 'womens', label: 'Women', category: 'womens' },
    { key: 'boys', label: 'Boys', category: 'boys' },
    { key: 'girls', label: 'Girls', category: 'girls' },
    { key: 'kids', label: 'Kids', category: 'kids' },
    { key: 'electronics', label: 'Electronics', category: 'electronics' },
    { key: 'electricals', label: 'Electricals', category: 'electricals' },
    { key: 'home_kitchen', label: 'Home & Kitchen', category: 'home_kitchen' },
    { key: 'beauty_personal_care', label: 'Beauty & Personal Care', category: 'beauty_personal_care' }
  ];

  constructor(public apiService: ApiService, public router: Router, private cdr: ChangeDetectorRef) { }
  selectedCategory = '';
  uniqueCategories: any[] = [];
  products: any[] = []
  selectedCategoryDisplay = '';
  selectedSubCategory: any
  categorySortData: any = []
  uniqueSubcategories: any = []


  get sidebarCategories() {
    return this.leftMenu;
  }
onSelectCategory(category: string) {
  this.selectedCategory = category;
  this.isLoading = true;
  this.selectedCategoryDisplay = this.formatCategoryName(category);
  // Clear old data
  this.products = [];
  this.uniqueSubcategories = [];
  this.categorySortData = [];
  this.selectedSubCategory = '';
  const categoryPayload = {
    searchData: category
  };
  this.apiService.searchData(categoryPayload).subscribe({
    next: (res: any) => {
      if (res.status && res.data?.length) {
        this.products = res.data;
        this.isLoading = false;
        this.uniqueSubcategories = this.getUniqueSubCategories(this.products);
        // Auto select first chip
        if (this.uniqueSubcategories.length > 0) {
          this.selectedSubCategory = this.uniqueSubcategories[0].name;
          this.onSelectMainCategory(
            this.selectedCategory,
            this.selectedSubCategory
          );
        }
      } else {
        this.products = [];
        this.uniqueSubcategories = [];
        this.categorySortData = [];
        this.selectedSubCategory = '';
        this.isLoading = false;
      }
    },
    error: (err) => {
      console.error(err);
      this.products = [];
      this.isLoading = false;
      this.uniqueSubcategories = [];
      this.categorySortData = [];
      this.selectedSubCategory = '';
    }
  });
}

  getUniqueSubCategories(products: any[]) {
    const map = new Map();
    products.forEach(product => {
      if (!map.has(product.category)) {
        map.set(product.category, {
          name: product.category,
          image: product.variants?.[0]?.images?.[0] || ''
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
      console.log('Fetched products:', products);
      const seen = new Set();
      this.uniqueCategories = products.filter((item: any) => {
        if (seen.has(item.category)) {
          return false;
        }
        seen.add(item.category);
        return true;
      });

      const normalize = (value: string) => (value || '').trim().toLowerCase();

      this.leftMenu = this.leftMenu.map(menuItem => {
        const matchedCategory = this.uniqueCategories.find(cat => {
          const catKey = normalize(cat.category);
          return catKey === normalize(menuItem.category)
            || catKey === normalize(menuItem.key)
            || catKey === normalize(menuItem.key.replace(/s$/, ''));
        });
        return { ...menuItem, category: matchedCategory?.category || menuItem.category };
      });
      this.selectedCategory = "mens";
      this.onSelectCategory(this.selectedCategory);

    });
  }
  
onSelectMainCategory(mainCategory: any, category: any) {
  this.selectedSubCategory = category;
  this.isLoading = true;
  this.categorySortData = [];
  const payload = {
    searchData: {
      category: mainCategory,
      sub_category: category
    }
  };

  this.apiService.searchData(payload).subscribe(
    (res: any) => {
     const data = res?.data || [];
      // Remove duplicate sub_category
      const uniqueMap = new Map();
      data.forEach((item: any) => {
        const key = item.sub_category?.trim().toLowerCase();
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      });

      this.categorySortData = Array.from(uniqueMap.values());
      this.isLoading = false;
    },
    (error) => {
      console.error(error);
      this.categorySortData = [];
      this.isLoading = false;
    }
  );
}

redirectToDisplayProductList(category: string, subCategory: string) {
    this.router.navigate(['/display-item'], {
      queryParams: {
        category,
        subCategory,
        source: 'category'
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

    return names[category] || category.replace(/_/g, ' ');
  }
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
