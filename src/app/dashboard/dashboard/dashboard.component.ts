import { Component, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { EChartsOption } from 'echarts';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { trigger, transition, animate, style } from '@angular/animations';
import { range } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent {

    sliderImage1:any[]=[]
    sliderImage2:any[]=[]
    sliderImage3:any[]=[]
    sliderImage4:any[]=[]
    sliderImage5:any[]=[]
    sliderImage6:any[]=[]
    sliderImage7:any[]=[]
    sliderImage8:any[]=[]
    sliderImage9:any[]=[]

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.fetchCategoriesTypeItems();
  }
  fetchCategoriesTypeItems() {
    let sandalPayload = {
      searchData: "sandals"
    }
    this.apiService.searchData(sandalPayload).subscribe(itemList => {
      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage1 = allImages;
    })
    let tshirtPayload = {
      searchData: "tshirts"
    }
    this.apiService.searchData(tshirtPayload).subscribe(itemList => {
      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage2 = allImages;
    })
    let shoePayload = {
      searchData: "shoes"
    }
    this.apiService.searchData(shoePayload).subscribe(itemList => {
      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage3 = allImages;
    })
    let sareePayload = {
      searchData: "saree"
    }
    this.apiService.searchData(sareePayload).subscribe(itemList => {
      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage4 = allImages;
    })
    let salwarPayload = {
      searchData: "salwar_suits"
    }
    this.apiService.searchData(salwarPayload).subscribe(itemList => {
      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage5 = allImages;
    })
    let beltPayload = {
      searchData: "irons"
    }
    this.apiService.searchData(beltPayload).subscribe(itemList => {
      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage6 = allImages;
    })

    let shoeKidesPayload = {
      searchData: "shoes_kids"
    }
    this.apiService.searchData(shoeKidesPayload).subscribe(itemList => {
      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage7 = allImages;
    })

    let walletPayload = {
      searchData: "wallets"
    }
    this.apiService.searchData(walletPayload).subscribe(itemList => {
      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage8 = allImages;
    })
    let shoesPayload = {
      searchData: "shoes"
    }
    this.apiService.searchData(shoesPayload).subscribe(itemList => {
      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage9 = allImages;
    })

  }


  userNoSearchItem(searchData: any) {
    let userChipsData = {
      searchData: searchData
    };
    this.apiService.searchData(userChipsData).subscribe(res => {
      let displayMobileData = res;
      localStorage.setItem('displaySearchData', JSON.stringify(displayMobileData))
      this.router.navigate(['./display-item'])
    })
  }


  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
