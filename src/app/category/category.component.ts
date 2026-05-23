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
        },900);
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
}
