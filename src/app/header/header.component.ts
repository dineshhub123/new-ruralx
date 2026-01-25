import { Component, OnInit, TemplateRef, ViewChild, Inject, ChangeDetectorRef, NgZone, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DailogComponent } from '../dailog/dailog.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
//import {NgbModal,NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { User, IUserResponse } from './user.class';
import { Observable, Subscriber } from 'rxjs'
import { ApiService } from '../services/api.service';
import { map, startWith } from 'rxjs/operators';
import { strings } from '@material/chips/deprecated/trailingaction/constants';
import { DOCUMENT } from '@angular/common';
import { AddcartService } from '../services/addcart.service';
import { Product } from '../product-zoom/product-zoom.component';
import { LoginService } from '../services/login.service';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ScrollService } from '../scroll.service';

export interface DialogData {
  animal: string;
  name: string;

  //constructor(private dialogRef:MatDialogRef){}

}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchValue') input: any;
  myControl = new FormControl();
  //opt: string[] = ['mobile', 'fan', 't-shirt', 'telephone', 'jins', 'bicycle', 'shoes'];
  options: string[] = [];
  public filteredOptions: any = [];
  public name: any;
  public animal: any
  data = [];
  zoomId: any;
  searchName: string = "";
  public cartItems: Product[] = [];
  public hideHeader:boolean = false;
  lastScrollTop = 0;
  showHeaderAtTop = false;
@HostListener('window:scroll', [])

  //public formdata: any
  //public radioForm: FormGroup;
  public isMenuOpen: boolean = false
  public itemQuantity: number = 0;
  username: string | null = null;
  constructor(@Inject(DOCUMENT) private document: Document, public addCartService: AddcartService, public loginService: LoginService, private cdRef: ChangeDetectorRef, private zone: NgZone,
    public dialog: MatDialog, private http: HttpClient, public router: Router, private fb: FormBuilder, private apiService: ApiService, private _bottomSheet: MatBottomSheet,private scrollService: ScrollService
    ) {
    this.apiService.getProductListDetailsData().subscribe((data: any) => {
      // Collect product names + categories
      let searchList: string[] = [];
      data.forEach((item: any) => {
        if (item.product_name) searchList.push(item.product_name);
        if (item.category) searchList.push(item.sub_category);
      });
      // Remove duplicates
      this.options = Array.from(new Set(searchList));
    });
    // this.radioForm = new FormGroup({
    //   radioOption: new FormControl('')
    // });

  }
  // get f() { return this.formdata.controls; }
  ngOnInit() {
    this.loadUserAddress();
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

this.scrollService.scroll$.subscribe(scrollTop => {
  // Always show header at top
  if (scrollTop <= 0) {
    this.hideHeader = false;
    this.showHeaderAtTop = false;
    return;
  }

  // Scroll down → hide
  if (scrollTop > this.lastScrollTop && scrollTop > 80) {
    this.hideHeader = true;
    this.showHeaderAtTop = true;
  }
  // Scroll up → show
  else if (scrollTop < this.lastScrollTop) {
    this.hideHeader = false;
    this.showHeaderAtTop = false;
  }

  this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
 });
  }





  ngAfterViewInit() {

  }

  openBottomSheet(): void {
    // this._bottomSheet.open(BottomSheetOverviewExampleSheet);
    const bottomSheetRef = this._bottomSheet.open(BottomSheetOverviewExampleSheet);
    bottomSheetRef.afterDismissed().subscribe((selectedAddress) => {
      if (selectedAddress) {
        this.setHeaderAddress(selectedAddress);
      }
    });
  }
  public deliverToText: string = "Choose your location";

  setHeaderAddress(address: any) {
    console.log(address)
    // For logged-in user address
    if (address?.user_first_name) {
      this.deliverToText =
        `Deliver to ${address.user_first_name} ${address.user_last_name}, ` +
        `${address.street_area} - ${address.user_pincode}`;
    }

    // For shipment address
    else if (address?.shipment_fullname) {
      this.deliverToText =
        `Deliver to ${address.shipment_fullname}, ` +
        `${address.shipment_city} - ${address.shipment_zipcode}`;
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  onSidenavClick(isMenuOpen: any) {
    //this.isMenuOpen = false;
    if (isMenuOpen) {
      this.document.body.classList.remove('no-scroll');
    } else if (!isMenuOpen) {
      this.document.body.classList.add('no-scroll');

    }
  }
  openCloseSidepanel(ev: any) {

  }
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
    const dialogRef = this.dialog.open(DailogComponent, {
      width: '250px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  cartFun() {
    this.router.navigate(['addcart'])
  }
  searchItem(items: any) {
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
  loginPage() {
    this.router.navigate(['login'])
  }
  admin() {
    this.router.navigate(['adminpanel'])

  }

  selectEvent(item: any) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  // displayFn(user: User) {
  //   if (user) { return user.name; }
  // }
  toTitleCase(value: string): string {
  return value
    ?.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

loadUserAddress() {
  const userInfo = localStorage.getItem("login_user");
  if (!userInfo) {
    this.deliverToText = "Choose your location";
    return;
  }

  const user = JSON.parse(userInfo);

  if (user.isGuest) {
    // Guest user → reset header
    this.deliverToText = "Choose your location";
    localStorage.removeItem("default_shipment_address");
  } else {
    // Logged-in user → check if there is a selected shipment
    const selectedAddress = localStorage.getItem("default_shipment_address");
    if (selectedAddress) {
      const ship = JSON.parse(selectedAddress);
      this.deliverToText = `Deliver to ${ship.shipment_fullname}, ${ship.shipment_city} - ${ship.shipment_zipcode}`;
    } else {
      // fallback to user's main address
      this.deliverToText = `Deliver to ${user.user_first_name} ${user.user_last_name}, ${this.toTitleCase(user.street_area) } - ${user.user_pincode}`;
    }
  }
}


}

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: './bottom-sheet-overview-example-sheet.html',
  styleUrls: ['./bottom-sheet-overview-example-sheet.css'],


})
export class BottomSheetOverviewExampleSheet {
  public loginUserAddress: any[] = []
  public radioForm: FormGroup;
  public exiestShipment: any = [];

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private apiService: ApiService,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>) {
    this.radioForm = new FormGroup({
      radioOption: new FormControl('')
    });

  }
  getshipDetails() {
    this.apiService.getShippingAddress().subscribe((res: any) => {
      let userInfo: any;
      userInfo = localStorage.getItem("login_user")
      let user = JSON.parse(userInfo)
      const shipingObj = res?.filter((shipment: any) => (
        shipment.login_user_mobile === user?.user_phone &&
        shipment?.login_user_first_name === user?.user_first_name &&
        shipment?.login_user_email === user?.user_email &&
        shipment?.login_user_password === user?.user_password
      ))
      this.exiestShipment = shipingObj;
    })
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  get f() { return this.radioForm.controls; }

  ngOnInit() {
    let userAddress: any;
    userAddress = localStorage.getItem("login_user")
    let address = JSON.parse(userAddress)
    this.loginUserAddress.push(address)
    this.radioForm = new FormGroup({
      radioOption: new FormControl(this.loginUserAddress[0])
    });
    this.getshipDetails();
  }

  onAddressSelect() {
    const selectedAddress = this.radioForm.value.radioOption;
    this._bottomSheetRef.dismiss(selectedAddress);
  }
}
