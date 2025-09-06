import { Component, NgZone, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { ApiService } from './services/api.service';
import { LoginService } from './services/login.service';
import { Location, ViewportScroller } from '@angular/common';
import { FormControl } from '@angular/forms';
import { DailogComponent } from './dailog/dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddcartService } from './services/addcart.service';
import { Product } from './product-zoom/product-zoom.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'material-ui-angular';
  username: string | null = null;
  expandedPanel: string = '';
  @ViewChild('searchValue') input: any;
  myControl = new FormControl();
  public data: any;
  public filteredOptions: any = [];
  public name: any;
  public animal: any
  public cartItems: Product[] = [];
  options: string[] = [];
  public retrieveResonse: any;
  public itemQuantity: number = 0;
  public base64Data: any;
  public retrievedImage: any;
  public imageUrl = null;
  public selectedFile: any;
  public sellItemData: any
  public buyerUsername: any;
  public getNotifyUserArray: any;
  private sub = new Subscription();
  constructor(private zone: NgZone, public dialog: MatDialog, public location: Location, public addCartService: AddcartService, private toastr: ToastrService,
    public loginService: LoginService,
    public router: Router,
    private http: HttpClient,
    private _DomSanitizationService: DomSanitizer,
    public apiService: ApiService,
    private viewportScroller: ViewportScroller
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        //this.viewportScroller.scrollToPosition([0, 0]);
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'  // or 'smooth' for animation
        });
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  ngOnInit(): void {
    this.loginService.user$.subscribe(user => {
     if (user) {
       this.calculateUserCartQuantity(user);
     }
  });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(),
      map(value => this._filter(value || '')),
    );
    this.setExpandedPanel(this.router.url);
    this.userlist()
    this.loginService.user$.subscribe(user => {
      this.username = user?.user_first_name ?? null;
    });
  }

  calculateUserCartQuantity(loginUser:any){
  this.addCartService.cart$.subscribe(items => {
    const userCartItems = items.filter((item: any) => item?.userId === loginUser?.userId);
    this.cartItems = userCartItems;
    let filerCartItems = userCartItems.filter((item: any) => item?.userId === loginUser?.userId)
    this.itemQuantity = filerCartItems.reduce((total:number, item:any) => total + (item?.quantity || 0), 0);
  });

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  setExpandedPanel(url: string): void {
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

  userLogout() {
    const user = this.loginService.getUser();
    this.loginService.logout()
    this.toastr.success(`Thanks, ${user?.user_first_name}! You've been logged out. Visit again soon!`, 'Logged Out');
    const loginUser = this.loginService.getUser();
    this.addCartService.cart$.subscribe(items => {
      const userItems = items.filter((item: any) => item.userId === loginUser?.userId);
      this.itemQuantity = userItems.reduce((sum: number, item: any) => sum + (item?.quantity || 0), 0);
    });
    this.router.navigate(['login']);
  }
  notification() {
    this.router.navigate(["sell-notification"]);

  }
  upload() {
    this.router.navigate(["upload"]);
  }
  userlist() {
    this.apiService.getUserBuyerDetails().subscribe((Response: any) => {
      this.sellItemData = Response
      let userlistData = this.sellItemData.map((item: any) =>
        item.user_first_name)
      let removeDuplicates = new Set(userlistData)
      this.buyerUsername = [...removeDuplicates];
      this.getNotifyUserArray = [];
      for (let i = 0; i < this.buyerUsername.length; i++) {
        let getNotifyUser = this.sellItemData.find((item: any) => item.user_first_name === this.buyerUsername[i])
        if (getNotifyUser) {
          this.getNotifyUserArray.push(getNotifyUser);
        }

      }
    });
  }

  back(): void {
    this.location.back()
  }

  openNotification() {

  }

  cartFun() {
    this.router.navigate(['addcart'])
  }
  // searchDataFn(searchData: any) {
  //   let searchValue = this.options.find(value => value === searchData)
  //   if (searchValue) {
  //     let userData = {
  //       searchData: searchValue
  //     };
  //     this.apiService.searchData(userData).subscribe((res: any) => {
  //       let displaySearchData = res;
  //       localStorage.setItem('displaySearchData', JSON.stringify(displaySearchData))
  //       this.router.navigate(['./display-item'])
  //       setTimeout(() => {
  //         this.reloadCurrentRoute();
  //       }, 5)
  //       this.input.nativeElement.value = '';

  //     })
  //   }
  // }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  openDialogD(): void {
    const dialogRef = this.dialog.open(DailogComponent, {
      width: '250px',
      data: { name: this.name, animal: this.animal }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }


}

