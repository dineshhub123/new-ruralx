import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  constructor(public apiService:ApiService){}
  categories = [
    {
      name: 'Electronics',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      subCategories: [
        {
          name: 'Mobiles',
          image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
        },
        {
          name: 'Laptops',
          image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
        },
        {
          name: 'Cameras',
          image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
        },
      ],
    },
    {
      name: 'Fashion',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      subCategories: [
        {
          name: 'Men',
          image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
        },
        {
          name: 'Women',
          image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
        },
        {
          name: 'Kids',
          image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
        },
      ],
    },
  ];
 uniqueCategories: any[] = [];
 ngOnInit() {
this.apiService.getCategoryList().subscribe((response:any)=>{
const products = response;

  const seen = new Set();
  this.uniqueCategories = products.filter((item:any) => {
    if (seen.has(item.category)) {
      return false;
    }
    seen.add(item.category);
    return true;
  });})
 }

}
