import { Component, NgZone, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient,HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable, startWith } from 'rxjs';
import { ApiService } from './api.service';
import { LoginService } from './login.service';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { DailogComponent } from './dailog/dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddcartService } from './addcart.service';
import { Product } from './product-zoom/product-zoom.component';
import { ToastrService } from 'ngx-toastr';
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'material-ui-angular';
  username: string | null = '';
  expandedPanel: string = '';
  @ViewChild('searchValue') input: any;
  myControl = new FormControl();
 public data:any;
  public filteredOptions: any = [];
  public name: any;
  public animal: any
 public cartItems: Product[] = [];
 options: string[] = [];
  public retrieveResonse:any;
 public itemQuantity: number = 0;
  public base64Data:any;
  public retrievedImage:any;
  public imageUrl = null;
  public selectedFile:any;
  public sellItemData:any
  public buyerUsername: any;
  public getNotifyUserArray:any;


  constructor( private zone: NgZone, public dialog: MatDialog,public location:Location, public addCartService: AddcartService, private toastr: ToastrService,
  public router:Router, 
  private http:HttpClient,
  private _DomSanitizationService:DomSanitizer, 
  public apiService: ApiService, 
  private loginService: LoginService) 

  { 
   
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setExpandedPanel(event.urlAfterRedirects);
      }
    });

 this.apiService.getProductListDetailsData().subscribe((data: any) => {
      let searchList = data.map((item: any) => item.category);
      let removeDuplicateArr = new Set(searchList)
      let filterArray: any = [...removeDuplicateArr]
      this.options = filterArray;
    },

      error => console.error(error));



}
  ngOnInit():void {

    this.loginService.username$.subscribe((name: any) => {
        this.zone.run(() => {
      this.username = name;
        });
    });
    this.addCartService.cart$.subscribe(items => {
      this.cartItems = items
      this.cartItems = this.addCartService.getCart();
      let quant = this.cartItems.map((qty: any) => qty?.quantity)
      this.itemQuantity = quant.reduce((a: any, b: any) => a + b, 0)
    })

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(),
      map(value => this._filter(value || '')),
    );

    this.setExpandedPanel(this.router.url);
     this.userlist()
      this.loginService.getUsername().subscribe((name) => {
      this.username = name;
    });


  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  setExpandedPanel(url: string): void {
console.log(url, 'url')
    if (url.includes('/orders')) {
      this.expandedPanel = 'orders';
    } else if (url.includes('/products')) {
      this.expandedPanel = 'products';
    } else if (url.includes('/customers')) {
      this.expandedPanel = 'customers';
    } else if (url.includes('/reports')) {
      this.expandedPanel = 'reports';
    } else if (url.includes('/settings')) {
      this.expandedPanel = 'settings';
    } else {
      this.expandedPanel = 'dashboard';
    }
  }

  isExpanded(panel: string): boolean {
    return this.expandedPanel === panel;
  }


adminLogout() {
  const adminName = localStorage.getItem('username') || 'Admin';
  localStorage.removeItem('adminMobile');
  localStorage.removeItem('adminName');
 this.toastr.success(`Thanks, ${adminName}! You've been logged out. Visit again soon!`, 'Logged Out');
  this.router.navigate(['login']);
}
 notification(){
    this.router.navigate(["sell-notification"]);
  
  }
  upload(){
    this.router.navigate(["upload"]);
  }
  

  userlist() {
    this.apiService.getUserBuyerDetails().subscribe((Response: any) => {
     this.sellItemData = Response
     let userlistData=this.sellItemData.map((item: any) => 
     item.user_first_name)
     let removeDuplicates=new Set(userlistData)
     this.buyerUsername=[...removeDuplicates];
    this.getNotifyUserArray = []; 
     for (let i = 0; i < this.buyerUsername.length; i++) {
    let  getNotifyUser=this.sellItemData.find((item:any) => item.user_first_name=== this.buyerUsername[i])
    if (getNotifyUser) {
    this.getNotifyUserArray.push(getNotifyUser);
  }
   
    }
});}

  back(): void {
    this.location.back()
  }

  openNotification() {

  }

searchQuery = '';

cartFun() {
    this.router.navigate(['addcart'])
  }
  searchItem(items: any) {
    console.log(items.value)
  }
  keyword = 'name';
  product = [
    {
      id: 1,
      name: 'Georgia'
    },
    {
      id: 2,
      name: 'Usa'
    },
    {
      id: 3,
      name: 'England'
    }
  ];

  searchDataFn(searchData: any) {
    let searchValue = this.options.find(value => value === searchData)
    if (searchValue) {
      let userData = {
        searchData: searchValue
      };
       this.apiService.searchData(userData).subscribe((res: any) => {
        let displaySearchData = res;
        localStorage.setItem('displaySearchData', JSON.stringify(displaySearchData))
        this.router.navigate(['./display-item'])
        setTimeout(() => {
          this.reloadCurrentRoute();
        }, 5)
        this.input.nativeElement.value = '';

      })
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

openDialogD(): void {
  console.log('Click handler called'); 
  const dialogRef = this.dialog.open(DailogComponent, { 
    width: '250px',
    data: { name: this.name, animal: this.animal }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog closed', result); 
    this.animal = result;
  });
}

loginPage(){
}


}

