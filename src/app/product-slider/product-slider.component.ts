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
    'boys': '#D97706',
    'girls': '#EC4899',
    'mens': '#2563EB',
    'womens': '#8B5CF6',
    'toddler': '#10B981',
    'electricals': '#E11D48',
    'electronics': '#0EA5E9',
    'technology': '#14B8A6',
    'beauty': '#EF4444',
    'sports': '#22C55E',
    'footwear': '#7C3AED',
    'fashion': '#E11D48' 
  };

  return colors[category] || '#4B5563';   // Default color
}

getDiscountPercent(mrp: number, discount: number): number {
  if (!mrp || mrp <= 0) {
    return 0;
  }
  return Math.floor((discount / mrp) * 100);
}
  onClickImage(category: any) {
    this.router.navigate(['/display-item'], {
      queryParams: {
        category: category
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