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
  sliderImage1: any[] = []
  sliderImage2: any[] = []
  sliderImage4: any[] = []
  sliderImage5: any[] = []
  sliderImage6: any[] = []
  sliderImage7: any[] = []
  sliderImage8: any[] = []
  sliderImage9: any[] = []
  sliderImage10: any[] = []
  sliderImage11: any[] = []
  sliderImage12: any[] = []
  productName: any;
  salwarName: any;
  ShoesName: any;
  tshirtName: any;
  sandalsName: any;
  ironName: any;
  walletName: any;
  kidShoesName: any;
  jentsShoesName: any;
  smartwatchName: any;
  kidsWearName: any;
  smartPhoneName: any;
  loading = true;

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.fetchCategoriesTypeItems();
  }
  fetchCategoriesTypeItems() {

    let sandalPayload = {
      searchData: "sandals"
    }
    this.apiService.searchData(sandalPayload).subscribe(itemList => {
      const productN = itemList.flatMap((name: any) => name.product_name
      )
      this.sandalsName = productN;

      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage1 = allImages;
      this.loading = false
    })
    let sareePayload = {
      searchData: "saree"
    }
    this.apiService.searchData(sareePayload).subscribe(itemList => {
      const productN = itemList.flatMap((name: any) => name.product_name
      )
      this.productName = productN;
      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage4 = allImages;
      this.loading = false
    })
    let salwarPayload = {
      searchData: "salwar_suits"
    }
    this.apiService.searchData(salwarPayload).subscribe(itemList => {
      const productN = itemList.flatMap((name: any) => name.product_name
      )
      this.salwarName = productN;

      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage5 = allImages;
      this.loading = false
    })
    let beltPayload = {
      searchData: "irons"
    }
    this.apiService.searchData(beltPayload).subscribe(itemList => {
      const productN = itemList.flatMap((name: any) => name.product_name
      )
      this.ironName = productN;

      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage6 = allImages;
      this.loading = false
    })

    let shoeKidesPayload = {
      searchData: "shoes_kids"
    }
    this.apiService.searchData(shoeKidesPayload).subscribe(itemList => {
      const productN = itemList.flatMap((name: any) => name.product_name
      )
      this.kidShoesName = productN;

      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage7 = allImages;
      this.loading = false
    })

    let walletPayload = {
      searchData: "wallets"
    }
    this.apiService.searchData(walletPayload).subscribe(itemList => {
      const productN = itemList.flatMap((name: any) => name.product_name
      )
      this.walletName = productN;

      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage8 = allImages;
      this.loading = false

    })
    let shoesPayload = {
      searchData: "shoes"
    }
    this.apiService.searchData(shoesPayload).subscribe(itemList => {
      const productN = itemList.flatMap((name: any) => name.product_name
      )
      this.jentsShoesName = productN;

      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage9 = allImages;
      this.loading = false

    })
    let watchPayload = {
      searchData: "smartwatches"
    }
    this.apiService.searchData(watchPayload).subscribe(itemList => {
      const productN = itemList.flatMap((name: any) => name.product_name
      )
      this.smartwatchName = productN;

      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage10 = allImages;
      this.loading = false
    })
    let kidWearPayload = {
      searchData: "kids wear"
    }
    this.apiService.searchData(kidWearPayload).subscribe(itemList => {
      const productN = itemList.flatMap((name: any) => name.product_name
      )
      this.kidsWearName = productN;

      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage11 = allImages;
      this.loading = false
    })
    let smartPhonePayload = {
      searchData: "smartphones"
    }
    this.apiService.searchData(smartPhonePayload).subscribe(itemList => {
      const productN = itemList.flatMap((name: any) => name.product_name
      )
      this.smartPhoneName = productN;

      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage12 = allImages;
      this.loading = false
    })

    let tshirtPayload = {
      searchData: "tshirts"
    }
    this.apiService.searchData(tshirtPayload).subscribe(itemList => {
      const productN = itemList.flatMap((name: any) => name.product_name
      )
      this.tshirtName = productN;

      const allImages = itemList.flatMap((product: any) =>
        product.variants.flatMap((variant: any) => variant.images[0])
      );
      this.sliderImage2 = allImages;
      this.loading = false
    })

  }
  onClickImage(catgory: any) {
    let selectedImage = {
      searchData: catgory
    };
    this.apiService.searchData(selectedImage).subscribe((res: any) => {
      let displaySearchData = res;
      localStorage.setItem('displaySearchData', JSON.stringify(displaySearchData))
      this.router.navigate(['./display-item'])
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
