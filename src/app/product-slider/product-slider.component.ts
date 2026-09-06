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
    boys: '#F5E1C4',
    girls: '#F2D6E3',
    mens: '#DCEBFA',
    womens: '#E6D9F5',
    kids: '#D8F0E4',
    electricals: '#F4D5D5',
    electronics: '#D5ECF7',
    technology: '#D8F0EC',
    beauty_personal_care: '#F4DCDC',
    home_kitchen: '#F5E3D0',
    footwear: '#E5DFF4',
    fashion: '#F5E3D0'
  };

  return colors[category] || '#F9FAFB';
}

getCategoryTitleColor(category: string): string {
  const colors: any = {
    boys: '#5B3A14',
    girls: '#64213D',
    mens: '#183B5C',
    womens: '#49346B',
    kids: '#185C43',
    electricals: '#6B2020',
    electronics: '#164E63',
    technology: '#14534D',
    beauty: '#701A32',
    sports: '#14532D',
    footwear: '#44316B',
    fashion: '#6B3415',
    beauty_personal_care: '#701A32',
    home_kitchen: '#6B3415'
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
        subCategory,
        source: "category"
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
