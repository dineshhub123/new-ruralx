import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css']
})
export class ProductSliderComponent {
    imageBaseUrl = environment.imageBaseUrl;
  @Input() title: string = '';
  @Input() products: any[] = [];
constructor(public router:Router){}
getCategoryColor(category: string): string {
  const colors: any = {
    boys: '#FFF3E0',         // Light Orange
    girls: '#FCE7F3',        // Light Pink
    mens: '#EFF6FF',         // Light Blue
    womens: '#F3E8FF',       // Light Purple
    kids: '#ECFDF5',      // Light Green
    electricals: '#FEE2E2',  // Light Red
    electronics: '#E0F2FE',  // Sky Blue
    technology: '#F0FDFA',   // Light Teal
    beauty_personal_care: '#FEF2F2',       // Rose
    home_kitchen: '#FFF7ED',       // Mint Green
    footwear: '#F5F3FF',     // Lavender
    fashion: '#FFF7ED'       // Cream Orange
  };

  return colors[category] || '#F9FAFB';
}

getCategoryTitleColor(category: string): string {
  const colors: any = {
    boys: '#D97706',
    girls: '#DB2777',
    mens: '#2563EB',
    womens: '#7C3AED',
    kids: '#10B981',
    electricals: '#DC2626',
    electronics: '#0284C7',
    technology: '#0F766E',
    beauty: '#E11D48',
    sports: '#16A34A',
    footwear: '#6D28D9',
    fashion: '#C2410C',
    beauty_personal_care: '#9F1239', // Rose Pink
    home_kitchen:  '#9A3412'
  };

  return colors[category] || '#374151';
}

formatCategory(category: string): string {
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
getDiscountPercent(mrp: number, discount: number): number {
  if (!mrp || mrp <= 0) {
    return 0;
  }
  return Math.floor((discount / mrp) * 100);
}
  onClickImage(category: any, subCategory: any) {
    this.router.navigate(['/display-item'], {
      queryParams: {
        category,
        subCategory
      }
    });
  }
  viewAllCategory(category: any) {
    this.router.navigate(['/display-item'], {
      queryParams: {
        category: category,
        source: 'dashboard'
      }
    });
  }

}
