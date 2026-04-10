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
import { AddressService } from '../address.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchValue') input: any;
  myControl = new FormControl();
  options: string[] = [];
  public filteredOptions: any = [];
  public name: any;
  public animal: any
  data = [];
  zoomId: any;
  searchName: string = "";
  public cartItems: Product[] = [];
  public hideHeader: boolean = false;
  lastScrollTop = 0;
  public isLoading: boolean = false;
  showHeaderAtTop = false;
  public deliverText: string = "Choose your location";
  @HostListener('window:scroll', [])
  public isMenuOpen: boolean = false
  public itemQuantity: number = 0;
  username: string | null = null;
  constructor(@Inject(DOCUMENT) private document: Document, private addressService: AddressService, public addCartService: AddcartService, public loginService: LoginService, private cdRef: ChangeDetectorRef, private zone: NgZone,
    public dialog: MatDialog, private http: HttpClient, public router: Router, private fb: FormBuilder, private apiService: ApiService, private _bottomSheet: MatBottomSheet, private scrollService: ScrollService
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

  }
  // get f() { return this.formdata.controls; }
  ngOnInit() {
    this.loginService.user$.subscribe((res: any) => {
      if (res?.isGuest) {
        this.deliverText = 'Choose your location';
      }
    })
    // 1) On refresh set from localStorage
    const saved = this.addressService.getSelectedAddress();

    if (saved) {
      this.updateHeader(saved);
    } else {
      this.deliverText = 'Choose your location';
    }
    // 2) Subscribe: only update when address is not null
    this.addressService.selectedAddress$.subscribe((addr: any) => {
      if (addr) {
        this.updateHeader(addr);
      }
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

  updateHeader(addr: any) {
    this.deliverText = `Deliver to ${addr.full_name ? addr.full_name : addr.user_first_name + ' ' + addr.user_last_name}, ${addr.street_area} - ${addr.user_pincode}`;
  }
  openBottomSheet(): void {
    // this._bottomSheet.open(BottomSheetOverviewExampleSheet);
    const bottomSheetRef = this._bottomSheet.open(BottomSheetOverviewExampleSheet);
    bottomSheetRef.afterDismissed().subscribe((selectedAddress) => {
    });
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
    this.router.navigate(['/display-item'], {
      queryParams: {
        category: searchValue
      }
    });
     this.input.nativeElement.value = '';
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
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  cartFun() {
    this.router.navigate(['addcart'])
  }
  searchItem(items: any) {
  }
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
  public isLoading: boolean = false;
  public user: any;
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, public router: Router, public loginService: LoginService, private apiService: ApiService, private addressService: AddressService,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>) {
    let loginUserStr = localStorage.getItem('login_user');
    if (loginUserStr) {
      this.user = JSON.parse(loginUserStr);
    }

    this.radioForm = new FormGroup({
      radioOption: new FormControl('')
    });

  }
loadAddresses() {
  this.isLoading = true;
  this.apiService.getShippingAddressByUserId(this.user.userId)
    .pipe(
      finalize(() => this.isLoading = false) // always runs (success or error)
    )
    .subscribe({
      next: (res: any) => {
        if (res?.status) {
          this.exiestShipment = res.data;
          this.setDefaultRadio();
        }
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  get f() { return this.radioForm.controls; }

  ngOnInit() {
    this.loadAddresses();
    let user: any = {};
    user = this.user;
    this.loginUserAddress.push(user)
    this.addressService.selectedAddress$.subscribe((addr: any) => {
      if (!addr) return;
      const sameRef = this.loginUserAddress?.find((x: any) => x?.id == addr?.id);
      const shipRef = this.exiestShipment?.find((x: any) => x?.id == addr?.id);
      this.radioForm.patchValue({ radioOption: sameRef ?? shipRef ?? null });
    });


  }
  setDefaultRadio() {
    const selectedAddr = this.addressService.getSelectedAddress();
    if (!selectedAddr) return;
    const sameRef = this.loginUserAddress?.find((x: any) => x?.id == selectedAddr?.id);
    const shipRef = this.exiestShipment?.find((x: any) => x?.id == selectedAddr?.id);
    this.radioForm.patchValue({ radioOption: sameRef ?? shipRef ?? null });
  }

  onAddressSelect(user: any) {
    this.radioForm.patchValue({ radioOption: user });
    const selectedAddress = this.radioForm.value.radioOption;
    this.addressService.setSelectedAddress(selectedAddress);
    this._bottomSheetRef.dismiss();
  }
  goToLogin() {
    this.router.navigate(['/login']);
    this._bottomSheetRef.dismiss();
  }

}
